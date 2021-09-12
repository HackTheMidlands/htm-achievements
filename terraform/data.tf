#########################
# MultipartFile user-data
#########################
data "cloudinit_config" "web" {
  gzip          = false
  base64_encode = false

  part {
    content_type = "text/cloud-config"
    content = templatefile("${path.module}/templates/user-data.yaml",
      {
        files = {
          "/srv/achivements/docker-compose.yml"     = file("${path.module}/../docker-compose.yaml")
          "/srv/achivements/traefik/certs/dev.cert" = cloudflare_origin_ca_certificate.origin.certificate
          "/srv/achivements/traefik/certs/dev.pem"  = tls_private_key.origin.private_key_pem
          "/srv/achivements/.env" = templatefile("${path.module}/templates/env", {
            db_username     = ""
            db_password     = ""
            api_db_username = ""
            api_db_password = ""

            session_secret = ""

            discord_oauth_client_id     = ""
            discord_oauth_client_secret = ""
            twitter_oauth_client_id     = ""
            twitter_oauth_client_secret = ""

            admin_list = ""

          })
        }
      }
    )
  }

  part {
    content_type = "text/x-shellscript"
    content      = templatefile("${path.module}/scripts/install-docker.sh", { docker_compose_version = var.docker_compose_version })
    filename     = "00_docker.sh"
  }
}
