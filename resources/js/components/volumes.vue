<template>
<div>


    <div>
      <h1>Volumes</h1>
      <button type="submit" class="btn btn-danger" v-on:click="exit()">Close</button>
    </div>

      <table class="table table-striped">

        <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th> Options </th>

          </tr>
        </thead>
<tbody
        v-for="volume in volumes"
        :key="volume.id"
        >
        <tr>
          <td>{{ volume.name }}</td>
          <td>{{ volume.size }} GiB</td>
         
       </tr>
     
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
      volumes: [],
      images: [],
      flavors: [],
      selectedInstance: null,
      selectedInstanceEdit: null
      };
    },
    methods: {
      getVolumes(){
           axios.get(this.url + "/volume/v3/" + this.$store.state.project+"/volumes/detail", {
            headers: {'x-auth-token': this.$store.state.token} })

           .then(response=>{
            console.log(response.data);
             this.volumes = response.data.volumes;
            
           })
      },
     /* getImages: function(){
        axios.get(this.url + "/image/v2/images",{
           headers: {'x-auth-token': this.$store.state.token} })

           .then(response=>{
             this.images = response.data.images;
             console.log(images);
           })
      },
       deleteInstance: function(instance){
       axios.delete(this.url + "/compute/v2.1/servers/" + instance.id, {
            headers: {'x-auth-token': this.$store.state.token} })


           this.$toasted.show("Instance Deleted With Success");

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
    },*/
     exit(){
       this.$emit('exit-volumes');
     },
  },
 /* components: {
    editInstance: InstanceEdit

  },*/
  mounted() {
    this.getVolumes();
    //this.getImages();
  }
}
</script>
