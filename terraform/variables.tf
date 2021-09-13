############
# Cloudflare
############
variable "cloudflare_zone_domain" {
  type        = string
  description = "Base host name"
}

##########
# Software
##########

variable "docker_compose_version" {
  default = "1.29.2"
}

variable "environment" {
  type    = string
  default = "production"
}

variable "tag" {
  type    = string
  default = null
}
