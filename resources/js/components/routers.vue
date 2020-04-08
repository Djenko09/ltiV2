<template>
  <div>
    <br />
    <div>
      <h1>Routers</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalRouters"
      >Create Router</button>
    </div>
    <br />
    <div class="modal" id="myModalRouters">
      <!-- Form para criar router  -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Router</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="router.name"
                id="name"
                placeholder="eg: my router"
              />
            </div>

            <div class="form-group">
              <label for="network">Pool</label>
              <select class="form-control" v-model="router.network_id">
                <option
                  v-for="network in networks"
                  :key="network.id"
                  v-bind:value="network.id"
                  v-show="network['router:external'] == 1"
                >{{ network.name}}</option>
              </select>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="createRouter()"
            >Create</button>
          </div>
          <!-- FIm do Form para criar router  -->
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Admin State</th>
          <th>Availability Zones</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody v-for="router in routers" :key="router.id">
        <tr>
          <td>{{ router.name}}</td>
          <td class="bg-danger" v-if="router.status === 'INACTIVE'">{{router.status}}</td>
          <td class="bg-success" v-if="router.status === 'ACTIVE'">{{router.status}}</td>
          <td v-if="router.admin_state_up == 1">UP</td>
          <td v-else>DOWN</td>
          <td v-for="zone in router.availability_zones" :key="zone">{{zone}}</td>
          <td>
            <button
              type="button"
              class="btn btn-sm btn-success"
              data-toggle="modal"
              data-target="#myModalRouterEdit"
              v-on:click="editRouter(router.id)"
            >Edit Router</button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteRouter(router.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="modal" id="myModalRouterEdit">
      <!-- [INICIO] Formulario para editar router-->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Edit Router</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="router.name"
                id="name"
                placeholder="eg: my network"
              />
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="sendEditRouter()"
              >Edit</button>
              <!--[FIM] Formulario para editar router -->
            </div>
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
      routers: [],
      router: {
        id: "",
        network_id: "",
        name: ""
      },
      networks: []
    };
  },
  methods: {
    getRouters: function() {
      axios
        .get(this.url + ":9696/v2.0/routers", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.routers = response.data.routers;
          console.log(this.routers);
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
    createRouter() {
      axios
        .post(
          this.url + ":9696/v2.0/routers",
          {
            router: {
              name: this.router.name,
              external_gateway_info: {
                network_id: this.router.network_id
              }
            }
          },
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )
        .then(response => {
          this.$toasted.show("Router Created!");
          this.getRouters();
        });
    },
    editRouter(id) {
      this.router.id = id;
    },
    sendEditRouter() {
      axios
        .put(
          this.url + ":9696/v2.0/routers/" + this.router.id,
          {
            router: {
              name: this.router.name
            }
          },
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )
        .then(response => {
          this.$toasted.show("Router Edited!");
          this.getRouters();
        });
    },
    deleteRouter(id) {
      axios
        .delete(this.url + ":9696/v2.0/routers/" + id, {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.$toasted.show("Router Deleted!");
          this.getRouters();
        });
    }
  },

  mounted() {
    this.getRouters();
    this.getNetworks();
  }
};
</script>
