# Create a new server running debian
resource "hcloud_server" "node1" {
  name        = "node1"
  image       = "ubuntu-20.04"
  server_type = "cx11"
  user_data   = "${data.cloudinit_config.web.rendered}"
}
