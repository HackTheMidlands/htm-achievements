data "cloudflare_zones" "production" {
  filter {
    name        = var.cloudflare_zone_domain
    lookup_type = "contains"
  }
}

locals {
  base_domain = "achivements.${var.cloudflare_zone_domain}"
  subdomains = [
    "admin",
    "api",
  ]
  domains = toset(concat(formatlist("%s.${local.base_domain}", tolist(local.subdomains)), ["${local.base_domain}"]))
}

resource "cloudflare_record" "v4" {
  for_each = local.domains
  zone_id  = lookup(data.cloudflare_zones.production.zones[0], "id")
  name     = each.key
  value    = hcloud_server.node1.ipv4_address
  type     = "A"
  ttl      = 1
  proxied  = true
}

resource "cloudflare_record" "v6" {
  for_each = local.domains
  zone_id  = lookup(data.cloudflare_zones.production.zones[0], "id")
  name     = each.key
  value    = hcloud_server.node1.ipv6_address
  type     = "AAAA"
  ttl      = 1
  proxied  = true
}

resource "tls_private_key" "origin" {
  algorithm = "RSA"
}

resource "tls_cert_request" "origin" {
  key_algorithm   = tls_private_key.origin.algorithm
  private_key_pem = tls_private_key.origin.private_key_pem

  subject {
    common_name  = ""
    organization = "Terraform Test"
  }
}

resource "cloudflare_origin_ca_certificate" "origin" {
  csr          = tls_cert_request.origin.cert_request_pem
  hostnames    = local.domains
  request_type = "origin-rsa"
}
