import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import fs from "fs";

const app = express();

const port = 6000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.json());

app.post("/store-file", async (req, res) => {
  console.log("called");
  try {
    if (!fs.existsSync('/nikunj_PV_dir')) {
      fs.mkdirSync('/nikunj_PV_dir', { recursive: true });
    }
    const { file, data } = req.body;
    if (!file || !data) {
      console.log("****");
      return res.json({
        file,
        error: "Invalid JSON input.",
      });
    }
    const dataLines = data.split("\n");
    let writeStream = fs.createWriteStream(`/nikunj_PV_dir/${file}`);
    for (const line of dataLines) {
      writeStream.write(line + "\n");
    }
    writeStream.end();
    return res.status(200).json({
      file,
      message: "Success.",
    });
  } catch (error) {
    console.log(error);
    return res.json({
      file,
      error: "Error while storing the file to the storage.",
    });
  }
});

app.post("/calculate", async (req, res) => {
  try {
    const { file, product } = req.body;
    if (!file) {
      return res.status(400).json({ error: "Invalid JSON input.", file });
    }

    if (!fileExists(file)) {
      return res.status(404).json({ file, error: "File not found." });
    }

    const container2Url = `${process.env.CONTAINER2_URL}/calculate_product`;
    const response = await axios.post(container2Url, { file, product });
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
});

function fileExists(file) {
  try {
    const filePath = `/nikunj_PV_dir/${file}`;
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (error) {
    return false;
  }
}

app.listen(port, () => {
  console.log(`Container 1 listening at http://localhost:${port}`);
});
