<template>
  <div>
    <br />
    <div>
      <h1>Networks</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalNetworks"
      >Create Network</button>
    </div>
    <br />
    <div class="modal" id="myModalNetworks">  <!-- [INICIO] Formulario para criar rede -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Network</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                type="text"
                class="form-control"
                v-model="network.name"
                id="name"
                placeholder="eg: my network"
              />
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal" :class="{ disabled: isDisabled }" :disabled="isDisabled"
              v-on:click="createNetwork()"
            >Create</button>     <!-- [FIM] Formulario para criar rede -->
          </div>
        </div>
      </div>
    </div>

<!-- tabela que lista as redes -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Subnets Associated</th>
          <th>Shared</th>
          <th>Status</th>
          <th>Admin State</th>
          <th>Availability Zones</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody v-for="network in networks" :key="network.id">
        <tr>
          <td>{{ network.name}}</td>
        <div v-for="subnet in subnets" :key="subnet.id">
            <td v-if="subnet.network_id === network.id"> <b>{{subnet.name}}</b> {{subnet.cidr}}</td>
          </div>
          <td v-if="network.shared == 0">NO</td>
          <td v-else>Yes</td>
          <td class="bg-danger" v-if="network.status === 'ERROR'">{{network.status}}</td>
          <td class="bg-success" v-if="network.status === 'ACTIVE'">{{network.status}}</td>
          <td v-if="network.admin_state_up == 1">UP</td>
          <td v-else>DOWN</td>
          <td>nova</td>
          <td>

             <!-- botão que chama o formulario de editar cria sub rede passando o id da rede -->
            <button
              type="button"
              class="btn btn-sm btn-success"
              data-toggle="modal"
              data-target="#myModalSubnet"
              v-on:click="createSubnet(network.id)"
            >Create Subnet</button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteNetwork(network.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- FIM tabela que lista as redes -->
    <div class="modal" id="myModalSubnet">    <!-- [INICIO] Formulario para criar Sub rede -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Subnet</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Subnet</label>
              <input
                type="text"
                class="form-control"
                v-model="subnet.name"
                id="name"
                placeholder="eg: my network"
              />
            </div>

            <div class="form-group">
              <label for="flavor">Pool</label>
              <select
                class="form-control"
                id="subnetpool_id"
                name="subnetpool_id"
                v-model="subnet.subnetpool_id"
              >
                <option value selected>Choose a pool</option>
                <option
                  v-for="pool in subnetPools"
                  :key="pool.id"
                  v-bind:value="pool.id"
                >{{ pool.name}} ({{pool.prefixes[0]}})</option>
              </select>
            </div>

            <div class="form-group">
              <label for="version">IP version (IPv4 or IPv6)</label>
              <select class="form-control" id="version" name="version" v-model="subnet.version">
                <option value="4" selected>IPv4</option>
                <option value="6">IPv6</option>
              </select>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="sendCreateSubnet(subnet.version)"
            >Create</button>                                               <!--[FIM] Formulario para criar Sub rede -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      networks: [],
      network: {
        name: ""
      },
      subnet: {
        network_id: "",
        name: "",
        version: 0,
        subnetpool_id: "",
        gatewayIP: ""
      },
      subnets: [],
      subnetPools: []
    };
  },
  methods: {
    getNetworks: function() { //funcao que obtem as redes
      axios
        .get(this.url + ":9696/v2.0/networks", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.networks = response.data.networks;
          console.log(this.networks);
        });
    },
    createNetwork() { //funcao para criar rede
      axios.post(
        this.url + ":9696/v2.0/networks",
        {
          network: {
            name: this.network.name
          }
        },
        {
          headers: { "x-auth-token": this.$store.state.token }
        }
      ) .then(response => {
         this.$toasted.show("Network Created!");
         this.getNetworks();
        });
    },
    createSubnet(id) { //funcao que guarda o id da REDE
      this.subnet.network_id = id;
    },
    sendCreateSubnet(version) { //funcao que criar a subRede
      axios
        .post(
          this.url + ":9696/v2.0/subnets",
          {
            subnet: {
              name: this.subnet.name,
              ip_version: version,
              network_id: this.subnet.network_id,
              subnetpool_id: this.subnet.subnetpool_id,
            }
          },
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )
        .then(response => {
          this.$toasted.show("Subnet  " + response.data.subnet.cidr + " created! The gateway is " + response.data.subnet.gateway_ip );
          this.getSubnets();
          this.getNetworks();
        });
    },
    deleteNetwork(id){ //funcao que elimina uma rede
        axios
        .delete(
          this.url + ":9696/v2.0/networks/" +id,
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )
        .then(response => {
          this.$toasted.show("Network Deleted!");
          this.getSubnets();
          this.getNetworks();
        });

    },
    getSubnetPools() { //funcoa que obtem as pools
      axios
        .get(this.url + ":9696/v2.0/subnetpools", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.subnetPools = response.data.subnetpools;
          console.log(this.subnetPools);
        });
    },
    getSubnets() { //funcao que obtem as subnets
      axios
        .get(this.url + ":9696/v2.0/subnets", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.subnets = response.data.subnets;
          console.log(this.subnets);
        });
    }
  },
  computed:{
    isDisabled () {
      if (this.network.name) {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() { //a pagina ao ser carregada executa as seguintes funcoes
    this.getNetworks();
    this.getSubnets();
    this.getSubnetPools();
  }
};
</script>
