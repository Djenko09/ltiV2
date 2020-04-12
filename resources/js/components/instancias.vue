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
    <div class="modal fade bd-example-modal-xl" id="myModalInstances">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <div class="navbars">
              <a v-on:click="modalChange(details)">Details *</a>
              <a v-on:click="modalChange(source)">Source *</a>
              <a v-on:click="modalChange(flavor)">Flavor *</a>
              <a v-on:click="modalChange(network)">Networks *</a>
              <a v-on:click="modalChange(security)">Security Groups</a>
              <a v-on:click="modalChange(key)">Key pairs</a>
              <a v-on:click="modalChange(server)">Server Groups</a>
            </div>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div v-if="this.modalContent == this.details" class="form-group">
              <div class="form-group">
                <label for="name">Name *</label>
                <input type="text" class="form-control" v-model="instance.name" id="name" />
              </div>
              <div class="form-group">
                <label for="description">Description</label>
                <input type="text" class="form-control" v-model="instance.description" id="name" />
              </div>
              <div class="form-group">
                <label for="AvailabilityZone">Availability Zone *</label><br>
                <select class="form-control"  v-model="instance.availability_zone">
                    <option v-for="availabilityZone in availability_zones" :value="availabilityZone.zoneName">{{availabilityZone.zoneName}}</option>
                </select>
              </div>
              <div class="form-group">
                <div>
                  <b>Note: Please fill all the fields with * in order to create the instace with the minimiun requirements</b>
                </div>
              </div>
            </div>
            <div v-if="this.modalContent == this.source"class="form-group">
              <h3>
                <b>Source</b><br>
              </h3>
              <div class="form-group">
                <label for="image">Select an Image *</label>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Disk Format</th>
                      <th>Container Format</th>
                      <th>Status</th>
                      <th>Protected</th>
                      <th>Visibility</th>
                      <th>Select One</th>
                    </tr>
                  </thead>

                  <tbody v-for="image in images" :key="image.id">
                    <tr>
                      <td v-if="image.name === ''">{{ image.id }}</td>
                      <td v-else>{{ image.name }}</td>
                      <td>{{ image.disk_format }}</td>
                      <td>{{ image.container_format}}</td>
                      <td>{{ image.status }}</td>
                      <td v-if="image.protected == false">NO</td>
                      <td v-else>YES</td>
                      <td>{{ image.visibility }}</td>
                      <td>
                        <input type="checkbox" align="center" v-on:click="setSource(image.id)"/>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div v-if="this.modalContent == this.flavor" class="form-group">
              <h3>
                <b>Flavors</b><br>
              </h3>
              <b style="text-align:right">Select only one !</b><br><br>
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Vcpus</th>
                      <th>Ram</th>
                      <th>Total Disk</th>
                      <th>Public</th>
                      <th>Select One *</th>
                    </tr>
                  </thead>

                  <tbody v-for="flavor in flavors" :key="flavor.id">
                    <tr>
                      <td>{{flavor.name}}</td>
                      <td>{{flavor.vcpus}}</td>
                      <td>{{flavor.ram}}</td>
                      <td>{{flavor.disk}}</td>
                      <td>{{flavor["os-flavor-access:is_public"]}}</td>
                      <td>
                        <input type="checkbox" v-on:click="setFlavor(flavor.id)"/>
                      </td>
                    </tr>
                  </tbody>
                </table>

            </div>
            <div v-if="this.modalContent == this.network" class="form-group">
              <h3>
                <b>Networks</b><br><br>
              </h3>
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subnets Associated</th>
                    <th>Shared</th>
                    <th>Status</th>
                    <th>Admin State</th>
                    <th>Select One</th>
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
                    <td>{{network.status}}</td>
                    <td v-if="network.admin_state_up == 1">UP</td>
                    <td v-else>DOWN</td>
                    <td>
                      <input type="checkbox" v-on:click="setNetwork(network.id)"/>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="this.modalContent == this.security" class="form-group">
              <h3>
                <b>Security Groups</b><br><br>
              </h3>
              <table class="table table-hover">
                 <thead>
                   <tr>
                     <th>Name</th>
                     <th>Description</th>
                     <th>Select One</th>
                   </tr>
                 </thead>

                 <tbody
                 v-for="securityGroup in securityGroups"
                 :key="securityGroup.id"
                 >
                 <tr>
                   <td>{{ securityGroup.name }}</td>
                   <td>{{ securityGroup.description }}</td>
                   <td>
                     <input type="checkbox" v-on:click="setSecurityGroup(securityGroup.name)"/>
                   </td>
                 </tr>
               </tbody>
               </table>
            </div>
            <div v-if="this.modalContent == this.key" class="form-group">
              <h3>
                <b>Key pairs</b>
              </h3>
              <div class="container-fluid">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Select One</th>
                  </tr>
                </thead>

                <tbody
                v-for="keypairs in keypairs"
                :key="keypairs.id"
                >
                <tr>
                  <td>{{ keypairs.keypair.name }}</td>
                  <td>{{ keypairs.keypair.type }}</td>
                  <td>
                     <input type="checkbox" v-on:click="setKeyPairs(keypairs.keypair.name)"/>
                  </td>
                </tr>
              </tbody>
              </table>
              </div>
            </div>
            <div v-if="this.modalContent == this.server" class="form-group">
              <h3>
                <b>Server groups</b>
              </h3>
              <!--  tabela que lista os server groups -->
             <table class="table table-hover">

               <thead>
                 <tr>
                   <th>Name</th>
                   <th>Policy</th>
                   <th>Select One</th>
                 </tr>
               </thead>

               <tbody
               v-for="serverGroup in serverGroups"
               :key="serverGroup.id"
               >
               <tr>
                 <td>{{serverGroup.name}}</td>
                 <td>{{serverGroup.policy}}</td>
                 <td>
                  <input type="checkbox" v-on:click="setServerGroup(serverGroup.id)"/>
                 </td>
               </tr>
               </tbody>
             </table>   <!-- FIM tabela que lista os server groups -->
           </div>

          </div><!-- Fim do BODY contente -->
          <div class="modal-footer">
            <button type="button"   class="btn btn-danger" data-dismiss="modal" name="button">Close</button>
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="createInstance()" :class="{ disabled: isDisabled }" :disabled="isDisabled"
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
      subnets: [],
      keypairs:[],
      securityGroups:[],
      availability_zones:[],
      serverGroups:[],
      instance: {
        availability_zone:"",
        description: "",
        id: "",
        name: "",
        flavor_id: "",
        image_id: "",
        network_id: "",
        security_group:"default",
        server_group:"",
        keyname:"",
      },
      networks: [],
      images: [],
      flavors: [],
      console_url: "",
      //para as vistas do modal*/
      modalContent:"details",
      details:"details",
      source:"source",
      flavor:"flavor",
      network:"net",
      networksPorts:"netports",
      security:"security",
      key:"key",
      server:"server",
      trigger:null
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
              availability_zone: this.instance.availability_zone,
              key_name: this.instance.key_name,

              networks: [
                {
                  uuid: this.instance.network_id
                }
              ],

              security_groups:[
                {
                  name: this.instance.security_group
                }
              ],

              imageRef: this.instance.image_id,
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
          this.getInstances();
          this.$toasted.show("Instance Created");
        }).catch(error => {
          this.$toasted.error('instance not created')
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
    },
    modalChange(value){ //muda conteudo do modal de criar instancia
      this.modalContent = value;
    },
    getAvailabilityZones(){ // Obter Availability Zones
      axios.get(this.url + "/compute/v2.1/os-availability-zone",{
          headers: { "x-auth-token": this.$store.state.token }
      }).then(response =>{
        this.availability_zones = response.data.availabilityZoneInfo
      })
    },
    setFlavor(flavor){
      this.instance.flavor_id = flavor;
    },
    setNetwork(network){
      this.instance.network_id = network;
    },
    setSecurityGroup(securityGroup){
      this.instance.security_group = securityGroup;
    },
    setKeyPairs(keypair){
      this.instance.key_name = keypair;
    },
    setSource(source){
      this.instance.image_id = source;
    },
    setServerGroup(serverGroup){
      this.instance.server_group = serverGroup;
    },
    getSecurityGroups(){
      axios.get(this.url +":9696/v2.0/security-groups",{
        headers: {"x-auth-token": this.$store.state.token}
      }).then(response=>{
        this.securityGroups = response.data.security_groups;
      })
    },
    getKeyPairs: function(){ //funcao que obtem as keypairs
      axios.get(this.url + "/compute/v2.1/os-keypairs",{
         headers: {
             'x-auth-token': this.$store.state.token,
             'x-openstack-nova-api-version': '2.2'
             }
       }).then(response=>{
           this.keypairs = response.data.keypairs;
         })
    },
    getSubnets() { //funcao que obtem as subnetsp
      axios
        .get(this.url + ":9696/v2.0/subnets", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.subnets = response.data.subnets;
        });
    },
    getServerGroups(){   //funcão que obtem os server groups
      axios.get(this.url +"/compute/v2.1/os-server-groups",{
        headers: {'x-auth-token': this.$store.state.token}
      }).then(response=>{
        this.serverGroups= response.data.server_groups;
      })
    }
  },
  computed:{
    isDisabled () {
      if (this.instance.name && this.instance.image_id && this.instance.flavor_id && this.instance.network_id && this.instance.availability_zone) {
        return false;
      } else {
        return true;
      }
    }
  },

  mounted() {
    this.getSubnets();
    this.getInstances();
    this.getKeyPairs();
    this.getSecurityGroups();
    this.getServerGroups();
    this.getFlavors();
    this.getImages();
    this.getNetworks();
    this.getAvailabilityZones();
  }
};
</script>

<style media="screen">
<style>
body {
font-family: Arial, Helvetica, sans-serif;
margin: 0;
}

.navbars {
overflow: hidden;
background-color: black;
color:white;
width: 100%;
}

.navbars a {
float: left;
margin-left:20px;
font-size: 16px;
color: white;
text-align: center;
padding: 14px 16px;
text-decoration: none;
}

.subnav {
float: left;
overflow: hidden;
}

.subnav .subnavbtn {
font-size: 16px;
border: none;
outline: none;
color: white;
padding: 14px 16px;
background-color: inherit;
font-family: inherit;
margin: 0;
}

.navbars a:hover, .subnav:hover .subnavbtn {
background-color: #FFBF00;
}

.subnav-content {
display: none;
position: absolute;
left: 0;
background-color: white;
width: 100%;
z-index: 1;
}

.subnav-content a {
float: left;
color: white;
text-decoration: none;
}

.subnav-content a:hover {
background-color: #eee;
color: black;
}

.subnav:hover .subnav-content {
display: block;
}
</style>
