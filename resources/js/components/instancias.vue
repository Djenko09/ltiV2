<template>
<div>

  <br>
    <div>
      <h1>Instances</h1>
    </div>
    <br>
    <div>
      <button type="submit" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModalInstances">Create Instance</button>
    </div>
      <br>
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
                  <option v-for="image in images" :key="image.id" v-bind:value="image.id">{{ image.name }}</option>
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
              <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="createInstance()" >Create</button>
            </div>

          </div>
        </div>
      </div>
      <table class="table table-hover">

        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Flavor ID</th>
            <th> Image </th>
            <th> Options </th>

          </tr>
        </thead>

        <tbody
        v-for="instance in instances"
        :key="instance.id"
        >
        <tr>
          <td v-if="instance.name">{{ instance.name}}</td>
          <td v-else>Nada...</td>
          <td class="bg-danger" v-if="instance.status === 'ERROR'"> {{instance.status}}</td>
          <td class="bg-warning" v-if="instance.status === 'SHUTOFF'"> {{instance.status}}</td>
          <td class="bg-info" v-if="instance.status === 'PAUSED'"> {{instance.status}}</td>
          <td class="bg-success" v-if="instance.status === 'ACTIVE'"> {{instance.status}}</td>
          <td >
            <div v-for="flavor in flavors" :key="flavor.id" >

              <a  v-if="flavor.id === instance.flavor.id">  {{flavor.name}} </a>

            </div>
          </td>

          <div v-for="image in images" :key="image.id">
            <td v-if="image.id === instance.image.id"> {{image.name}} </td>
          </div>

          <td>
           <button
                type="button"
                class="btn btn-sm btn-success"
                v-on:click="instanceEdit(instance)"
              >Edit</button>
            <button
            type="button"
            class="btn btn-sm btn-danger"
            v-on:click="deleteInstance(instance)"
            >Delete</button>
          </td>

        </tr>
        <editInstance
            :instance="selectedInstanceEdit"
            @edit-canceled="cancelInstanceEdit"
            @save-edit="saveInstanceEdit"
            v-if="selectedInstanceEdit && selectedInstanceEdit === instance"
          ></editInstance>
      </tbody>
    </table>
</div>
</template>

<script type="text/javascript">

import InstanceEdit from "./editInstance.vue";

export default {
  data: function() {

    return{
      url: process.env.MIX_URL,
      instances: [],
      instance: {
        name: "",
        flavor_id: "",
        image_id: "",
        network_id: ""
      },
      networks: [],
      images: [],
      flavors: [],
      selectedInstance: null,
      selectedInstanceEdit: null
      };
    },
    methods: {
      getInstances(){
           axios.get(this.url + "/compute/v2.1/servers/detail", {
            headers: {'x-auth-token': this.$store.state.token} })

           .then(response=>{

             this.instances = response.data.servers;
             console.log(this.instances);
           })
      },
      getImages: function(){
        axios.get(this.url + "/image/v2/images",{
           headers: {'x-auth-token': this.$store.state.token} })

           .then(response=>{
             this.images = response.data.images;
             console.log(images);
           })
      },
      getFlavors: function(){

           axios.get(this.url + "/compute/v2.1/flavors",{
           headers: {'x-auth-token': this.$store.state.token} })

           .then(response=>{
             this.flavors = response.data.flavors;
             console.log(images);
           })
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
     deleteInstance: function(instance){
       axios.delete(this.url + "/compute/v2.1/servers/" + instance.id, {
            headers: {'x-auth-token': this.$store.state.token} })


           this.$toasted.show("Instance Deleted With Success");

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
           this.$router.push("/home");
           this.$toasted.show("Instance Created");

         });
     },
      instanceEdit: function(instance) {
      this.selectedInstance = null;
      this.selectedInstanceEdit = instance;
    },
    cancelInstanceEdit: function() {
      this.selectedInstanceEdit = null;
    },
    saveInstanceEdit: function() {
      this.selectedInstanceEdit = null;

      this.$router.push("/home");
      this.$toasted.show("Instance edit successfully!");
    },
     exit(){
       this.$emit('exit-instance');
     },
  },
  components: {
    editInstance: InstanceEdit

  },
  mounted() {
    this.getInstances();
    this.getFlavors();
    this.getImages();
    this.getNetworks();
  }
}
</script>
