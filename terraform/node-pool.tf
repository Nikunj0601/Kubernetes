# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/google_service_account
resource "google_service_account" "kubernetes" {
  account_id = "kubernetes-assignment"
}

resource "google_artifact_registry_repository_iam_member" "iam_member" {
  project = "kubernetes-assignment-417316"
  location = "northamerica-northeast1"
  repository = "cloud-assignment"
  role = "roles/artifactregistry.reader"
  member = "serviceAccount:${google_service_account.kubernetes.email}"
}


# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/container_node_pool
resource "google_container_node_pool" "general" {
  name       = "general"
  cluster    = google_container_cluster.kubernetes-assignment.id
  node_count = 1

  node_config {
    preemptible  = true
    machine_type = "e2-standard-2"
    disk_type = "pd-standard"
    disk_size_gb = 10

    labels = {
      role = "general"
    }

    service_account = google_service_account.kubernetes.email
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
  }
}
