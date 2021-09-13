terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "HackTheMidlands"

    workspaces {
      name = "achivements"
    }
  }
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "2.26.1"
    }
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "1.31.1"
    }
  }
}
