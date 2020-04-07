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
        data-target="#myModalInstances"
      >Allocate IP</button>
    </div>
    <br />
    <div class="modal" id="myModalInstances">
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
                v-show="network['router:external'] == 1">{{ network.name}}</option>
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
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>IP Address</th>
          <th>Description</th>
          <th>Mapped Fixed IP Address</th>
          <th>pool</th>
          <th>Status</th>
          <th> Options </th>

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
                type="button"
                class="btn btn-sm btn-success"
               
              >Associate</button>
            <button
            type="button"
            class="btn btn-sm btn-danger"
            v-on:click="deleteFloatingIP(floatingIP)"
            >Delete</button>
          </td>

        </tr>
      </tbody>
    </table>
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
    network: { id: ""},
      description: "",

    };
  },
  methods: {
    getFloatingIPs: function() {
      axios
        .get(this.url + ":9696/v2.0/floatingips", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.floatingIPs = response.data.floatingips;
          console.log(this.floatingIPs);
        });
    },
    getNetworks: function() {
      axios
        .get(this.url + ":9696/v2.0/networks", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.networks = response.data.networks;
          console.log(this.networks);
        });
    },
    getInstances() {
      axios
        .get(this.url + "/compute/v2.1/servers/detail", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.instances = response.data.servers;
          console.log(this.instances);
        });
    },
    allocateIP() {
      axios.post(
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
           console.log(response);
           this.$toasted.show("Floating IP Allocated");
           this.getFloatingIPs();

         });
    },
    deleteFloatingIP(floatingIP){
        axios.delete(this.url + ":9696/v2.0/floatingips/" + floatingIP.id, {
            headers: {'x-auth-token': this.$store.state.token} 
            })
            .then(response => {
           console.log(response);
           this.$toasted.show("Floating IP Deleted With Success");
           this.getFloatingIPs();

         });
          
        
     },
    
  },

  mounted() {
    this.getNetworks();
    this.getFloatingIPs();
    this.getInstances();
    this.getNetworks();
  }
};
</script>
