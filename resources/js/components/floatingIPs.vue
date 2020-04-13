<template>
  <div>
    <br />
    <div>
      <h1>Floating IPs</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalFloatingIP"
      >Allocate IP</button>
    </div>
    <br />
    <div class="modal" id="myModalFloatingIP">
      <!-- formulario para criar um ip flutuante-->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Allocate IP</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="network">Pool</label>
              <select class="form-control" v-model="network.id">
                <option
                  v-for="network in networks"
                  :key="network.id"
                  v-bind:value="network.id"
                  v-show="network['router:external'] == 1"
                >{{ network.name}}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <input
                type="text"
                class="form-control"
                v-model="description"
                id="description"
                placeholder="eg: teste floating ip"
              />
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="allocateIP()"
            >Allocate IP</button>
          </div>
        </div>
      </div>
    </div> <!--  FIM formulario para criar um ip flutuante-->

    <!-- tabela que mostra os ips flutuantes -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>IP Address</th>
          <th>Description</th>
          <th>Mapped Fixed IP Address</th>
          <th>pool</th>
          <th>Status</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody v-for="floatingIP in floatingIPs" :key="floatingIP.id">
        <tr>
          <td>{{ floatingIP.floating_ip_address}}</td>
          <td>{{ floatingIP.description}}</td>
          <td>{{ floatingIP.fixed_ip_address}}</td>
          <td>public</td>

          <td class="bg-warning" v-if="floatingIP.status === 'DOWN'">{{floatingIP.status}}</td>
          <td class="bg-success" v-if="floatingIP.status === 'ACTIVE'">{{floatingIP.status}}</td>

          <td>
            <button
              v-show="floatingIP.fixed_ip_address == null "
              type="button"
              class="btn btn-sm btn-success"
              data-toggle="modal"
              data-target="#myAssociateIP"
              v-on:click="saveFloatingID(floatingIP.id)"
            >Associate</button>
            <button
              v-show="floatingIP.port_id != null"
              type="button"
              class="btn btn-sm btn-warning"
              v-on:click="disassociateFloatingIP(floatingIP.id)"
            >Disassociate</button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteFloatingIP(floatingIP)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table> <!--  FIM tabela que msotra os ips fluntuantes-->

      <!-- formulario para associar o IP flutuante a uma VM -->
    <div class="modal" id="myAssociateIP">

      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Associate IP</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="instance">Port</label>
              <select class="form-control" v-model="instance">
                <option
                  v-for="instance in instances"
                  :key="instance.id"
                  v-bind:value="instance"
                >{{ instance.name}}</option>
              </select>
            </div>
          </div>
          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="associateIP(instance)"
            >Associate IP</button>
          </div>
        </div>
      </div>
    </div>   <!-- FIM  formulario para associar o IP flutuante a uma VM -->
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      floatingIPs: [],
      instances: [],
      networks: [],
      network: { id: "" },
      description: "",
      ports: [],
      port_id: "",
      float_ID: "",
      instance: {
        ip: ""
      }
    };
  },
  methods: {
    getFloatingIPs: function() { //funcao que obtem os ips flutuantes
      axios
        .get(this.url + ":9696/v2.0/floatingips", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.floatingIPs = response.data.floatingips;
        });
    },
    getNetworks: function() {  //funcao que obtem as redes
      axios
        .get(this.url + ":9696/v2.0/networks", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.networks = response.data.networks;
        });
    },
    getInstances() { //funcao que obtem as instancias
      axios
        .get(this.url + "/compute/v2.1/servers/detail", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.instances = response.data.servers;
        });
    },
    allocateIP() {  //funcao que aloca um ip flutuante
      axios
        .post(
          this.url + ":9696/v2.0/floatingips",
          {
            floatingip: {
              floating_network_id: this.network.id,
              project_id: this.$store.state.project,
              description: this.description
            }
          },
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )
        .then(response => {
          this.$toasted.show("Floating IP Allocated");
          this.getFloatingIPs();
        });
    },
    saveFloatingID(id) { //guarda ID do IP flutuante  para depois ser usado para associar a uma vm
      this.float_ID = id;
    },
    associateIP(instance) { //funcao que associa IP flutuante a uma VM
      axios
        .get(this.url + ":9696/v2.0/ports", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.ports = response.data.ports;

          for (const port of this.ports) {

            if (port.fixed_ips[0].ip_address == instance.addresses.private[0].addr || port.fixed_ips[0].ip_address == instance.addresses.private[1].addr) {

              this.port_id = port.id;
              axios.put(this.url + ":9696/v2.0/floatingips/" + this.float_ID,
              {
                floatingip: {
                  port_id: this.port_id,

                }
              }
              ,{
                headers: { "x-auth-token": this.$store.state.token }
              }).then(response => {

          this.$toasted.show("FloatingIP associated");
           this.getFloatingIPs();

              });
            }
          }

        });

    },
      disassociateFloatingIP(id) { //funcao que desassocia o IP da VM
        axios.put(this.url + ":9696/v2.0/floatingips/" + id,
              {
                floatingip: {
                  port_id: null,

                }
              }
              ,{
                headers: { "x-auth-token": this.$store.state.token }
              }).then(response => {
                  this.$toasted.show("FloatingIP disassociated");
                  this.getFloatingIPs();
              });
    },
    deleteFloatingIP(floatingIP) {  //eliminar IP flutuante
      axios
        .delete(this.url + ":9696/v2.0/floatingips/" + floatingIP.id, {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.$toasted.show("Floating IP Deleted With Success");
          this.getFloatingIPs();
        });
    }
  },

  mounted() { //a pagina ao ser carregada executa as seguintes funcoes
    this.getInstances();
    this.getNetworks();
    this.getFloatingIPs();

    this.getNetworks();

  }
};
</script>
