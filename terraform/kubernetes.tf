# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_cluster
resource "google_container_cluster" "kubernetes-assignment" {
  name                     = "kubernetes-assignment"
  location                 = "us-central1-c"
  initial_node_count       = 1

  addons_config {
    http_load_balancing {
      disabled = false
    }
  }
}
