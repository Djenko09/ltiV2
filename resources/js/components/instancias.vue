<template>
<div>


    <div>
      <h1>Instances</h1>
      <button type="submit" class="btn btn-danger"v-on:click="exit()">Close</button>
    </div>

      <table class="table table-striped">

        <thead class="thead-dark">
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
          <td v-if="instance.name">{{ instance.name }}</td>
          <td v-else>Nada...</td>
          <td>{{ instance.status }}</td>
          <td >
            <div v-for="flavor in flavors" :key="flavor.id" >

              <a  v-if="flavor.id === instance.flavor.id">  {{flavor.name}} </a>

            </div>
          </td>

          <div v-for="image in images" :key="image.id">
            <td v-if="image.id === instance.image.id"> {{image.name}} </td>
          </div>

          <td>
            <!--<button
            type="button"
            class="btn btn-sm btn-primary"
            v-on:click="movementDetails(movement)"
            >Details</button>-->
            <button
            type="button"
            class="btn btn-sm btn-danger"
            v-on:click="deleteInstance(instance.id)"
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

    return{
      url: process.env.MIX_URL,
      instances: [],
      images: [],
      flavors: [],
      url: process.env.MIX_URL,
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
     deleteInstance: function(instance){
       axios.delete(this.url + "/compute/v2.1/servers/" + instance, {
            headers: {'x-auth-token': this.$store.state.token} })


           this.$toasted.show("Instance Deleted With Success");

     },
     exit(){
       this.$emit('exit-instance');
     },
  },
  mounted() {
    this.getInstances();
    this.getFlavors();
    this.getImages();
  }
}
</script>
