import express from 'express';
import bodyParser from 'body-parser';
import csv from 'csv-parser';
import fs from 'fs';
const app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.post('/calculate_product', (req, res) => {
    try {
        console.log("nikunj");
        const { file, product } = req.body;

        const filePath = `/nikunj_PV_dir/${file}`;
        const rows = [];

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                console.log(row);
                rows.push(row);
            })
            .on('error', (error) => {console.log(error); res.json({ error: 'Input file not in CSV format.', file })})
            .on('end', () => {
                const sum = calculateSum(rows, product);
                if (isNaN(sum) || sum == null || (file.split('.')[1] !== 'csv' && sum == 0)) {
                    res.json({ error: 'Input file not in CSV format.', file });
                } else {
                    res.json({ file, sum });
                }
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error.' });
    }
});

function calculateSum(rows, product) {
    let sum = 0;
    for (const row of rows) {
        console.log(row);
        if(Object.keys(row)[0] !== 'product' || Object.keys(row)[1].trim() !== 'amount') {
            return null;
        }
        if (row.product === product) {
            console.log(row[Object.keys(row)[1]]);
            sum += parseFloat(row[Object.keys(row)[1]]);
        }
    }
    return sum;
}

app.listen(PORT, () => {
    console.log(`Container 2 listening on port ${PORT}`);
});