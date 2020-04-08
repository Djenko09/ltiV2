<template>
  <div>
    <br />
    <div>
      <h1>Instances</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalInstances"
      >Create Instance</button>
    </div>
    <br />
    <div class="modal" id="myModalInstances">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Instance</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" v-model="instance.name" id="name" />
            </div>

            <div class="form-group">
              <label for="image">Image</label>
              <select class="form-control" id="image" name="image" v-model="instance.image_id">
                <option value selected>Choose a image</option>
                <option
                  v-for="image in images"
                  :key="image.id"
                  v-bind:value="image.id"
                >{{ image.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="flavor">Flavor</label>
              <select class="form-control" id="flavor" name="flavor" v-model="instance.flavor_id">
                <option value selected>Choose a flavor</option>
                <option
                  v-for="flavor in flavors"
                  :key="flavor.id"
                  v-bind:value="flavor.id"
                >{{ flavor.name}} ||| VCPUS:{{flavor.vcpus}} ||| RAM:{{flavor.ram}}MB ||| DISK:{{flavor.disk}}GB</option>
              </select>
            </div>

            <div class="form-group">
              <label for="flavor">Network</label>
              <select class="form-control" id="flavor" name="flavor" v-model="instance.network_id">
                <option value selected>Choose a network</option>
                <option
                  v-for="network_id in networks"
                  :key="network_id.id"
                  v-bind:value="network_id.id"
                >{{ network_id.name}}</option>
              </select>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="createInstance()"
            >Create</button>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th>Flavor</th>
          <th>Image</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody v-for="instance in instances" :key="instance.id">
        <tr>
          <td v-if="instance.name">{{ instance.name}}</td>
          <td v-else>Nada...</td>
          <td class="bg-danger" v-if="instance.status === 'ERROR'">{{instance.status}}</td>
          <td class="bg-warning" v-if="instance.status === 'SHUTOFF'">{{instance.status}}</td>
          <td class="bg-info" v-if="instance.status === 'PAUSED'">{{instance.status}}</td>
          <td class="bg-info" v-if="instance.status === 'SUSPENDED'">{{instance.status}}</td>
          <td class="bg-success" v-if="instance.status === 'ACTIVE'">{{instance.status}}</td>
          <td>
            <div v-for="flavor in flavors" :key="flavor.id">
              <a v-if="flavor.id === instance.flavor.id">{{flavor.name}}</a>
            </div>
          </td>
          <div v-for="image in images" :key="image.id">
            <td v-if="image.id === instance.image.id">{{image.name}}</td>
          </div>
          <td>
            <button
              type="button"
              class="btn btn-sm btn-info"
              v-show="instance.status == 'ACTIVE'"
              v-on:click="viewconsole(instance)"
            >Console</button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteInstance(instance)"
            >Delete</button>
            <select>
              <option selected>*more options*</option>
              <option
                v-show="instance.status == 'ACTIVE'"
                v-on:click="pauseInstance(instance)"
              >Pause Instance</option>
              <option
                v-show="instance.status == 'ACTIVE'"
                v-on:click="suspendInstance(instance)"
              >Suspend Instance</option>
              <option
                v-show="instance.status == 'PAUSED' "
                v-on:click="resumeInstance(instance)"
              >Resume Instance</option>
              <option
                v-show="instance.status == 'SUSPENDED'"
                v-on:click="resumeSuspend(instance)"
              >Resume Instance</option>
              <option
                v-show="instance.status == 'ACTIVE'"
                v-on:click="alert1(instance)"
              >Reboot Instance</option>
              <option
                v-show="instance.status == 'ACTIVE'"
                v-on:click="alertShutDown(instance)"
              >Shutdown Instance</option>
              <option
                v-show="instance.status == 'SHUTOFF'"
                v-on:click="startInstance(instance)"
              >Start Instance</option>
              <option
                data-toggle="modal"
                data-target="#myModalInstanceEdit"
                v-on:click="instanceEdit(instance)"
              >Edit Instance</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal" id="myModalInstanceEdit">
      <!-- [INICIO] Formulario para editar router-->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">
              Edit Instance:
              <b>{{instance.name}}</b>
            </h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Instance Name</label>
              <input type="text" class="form-control" v-model="instance.name" id="name" />
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="sendInstanceEdit()"
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
      instances: [],
      instance: {
        id: "",
        name: "",
        flavor_id: "",
        image_id: "",
        network_id: ""
      },
      networks: [],
      images: [],
      flavors: [],
      console_url: ""
    };
  },
  methods: {
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
    getImages: function() {
      axios
        .get(this.url + "/image/v2/images", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.images = response.data.images;
          console.log(images);
        });
    },
    getFlavors: function() {
      axios
        .get(this.url + "/compute/v2.1/flavors/detail", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.flavors = response.data.flavors;
          console.log(images);
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
    deleteInstance: function(instance) {
      axios
        .delete(this.url + "/compute/v2.1/servers/" + instance.id, {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          console.log(response);
          this.$toasted.show("Instance Deleted With Success");
          this.getInstances();
        });
    },
    createInstance: function() {
      axios
        .post(
          this.url + "/compute/v2.1/servers",
          {
            server: {
              flavorRef: this.instance.flavor_id,
              name: this.instance.name,

              networks: [
                {
                  uuid: this.instance.network_id
                }
              ],

              imageRef: this.instance.image_id,

              availability_zone: "nova"
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          console.log(response);
          this.$toasted.show("Instance Created");
          this.getInstances();
        });
    },

    instanceEdit: function(instance) {
      this.instance.id = instance.id;
      this.instance.name = instance.name;
    },
    sendInstanceEdit() {
      axios
        .put(
          this.url + "/compute/v2.1/servers/" + this.instance.id,
          {
            server: {
              name: this.instance.name
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance edit successfully!");
          this.getInstances();
        });
    },
    pauseInstance(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",
          {
            pause: null
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance Paused!");
          this.getInstances();
        });
    },
    resumeInstance(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",
          {
            unpause: null
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance Paused!");
          setTimeout(2222);
          this.getInstances();
        });
    },
    suspendInstance(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",
          {
            suspend: null
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance Suspensed!");
          this.getInstances();
        });
    },
    resumeSuspend(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",
          {
            resume: null
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance Active!");
          this.getInstances();
        });
    },
    rebootInstance(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",
          {
            reboot: {
              type: "SOFT"
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance rebooting!");
          this.getInstances();
        });
    },
    shutdown(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",

          {
            "os-stop": null
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Instance off!");
          this.getInstances();
        });
    },
    startInstance(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",

          {
            "os-start": null
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
         this.$toasted.show("Instance started!");
        });
    },
    viewconsole(instance) {
      axios
        .post(
          this.url + "/compute/v2.1/servers/" + instance.id + "/action",

          {
            "os-getVNCConsole": {
              type: "novnc"
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.console_url = response.data.console.url;
          console.log(this.console_url);
          window.open(this.console_url);
         // win.focus();
        });
    },
    alert1(instance) {
      var x;
      var r = confirm(
        "You Selected '" +
          instance.name +
          "'. Please confirm your selection. Restarted instances losing all unsaved data to persistent storage!"
      );
      if (r == true) {
        x = "você pressionou OK!";
        this.rebootInstance(instance);
      } else {
        x = "Você pressionou Cancelar!";
      }
    },
    alertShutDown(instance) {
      var x;
      var r = confirm(
        "You Selected '" +
          instance.name +
          "'. Please confirm your selection. Instance will be shut down"
      );
      if (r == true) {
        x = "você pressionou OK!";
        this.shutdown(instance);
      } else {
        x = "Você pressionou Cancelar!";
      }
    }
  },

  mounted() {
    this.getInstances();
    this.getFlavors();
    this.getImages();
    this.getNetworks();
  }
};
</script>
