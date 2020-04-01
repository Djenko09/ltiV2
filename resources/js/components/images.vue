<template>
<div>
  <div>
    <h1>Images</h1>
    <button type="submit" class="btn btn-danger" v-on:click="exit()">Close</button>
  </div>
  <button type="submit" class="btn btn-warning"></button>
  <table class="table table-striped">

    <thead class="thead-dark">
      <tr>
        <th>Name</th>
        <th>Disk Format</th>
        <th>Container Format</th>
        <th>Status </th>
      </tr>
    </thead>

    <tbody
    v-for="image in images"
    :key="image.id"
    >
    <tr>
      <td>{{ image.name }}</td>
      <td>{{ image.disk_format }}</td>
      <td>{{ image.container_format}}</td>
      <td>
       <button
            type="button"
            class="btn btn-sm btn-success"
          >Edit</button>
        <button
        type="button"
        class="btn btn-sm btn-danger"
        >Delete</button>
      </td>
    </tr>
  </tbody>
  </table>
</div>
</template>

<script>
export default {

  data: function(){
    return{
      url: process.env.MIX_URL,
      images:[],
    }
  },
  methods:{
    getImages: function(){
      axios.get(this.url + "/image/v2/images",{
         headers: {'x-auth-token': this.$store.state.token,}
       })

         .then(response=>{
           this.images = response.data.images;
           console.log(images);
         })
    },
    getProjects(){
      axios.get(this.url + "/identity/v3/auth/token",{
        headers: {"x-auth-token": this.$store.state.token,
      "x-subject-token": this.$store.state.token}
      }).then(response =>{
        console.log(response.data.token.project.id)
      });
    },
    exit(){
      this.$emit('exit-images');
    }
  },
  mounted(){
    this.getImages();
    this.getProjects();
  }

}
</script>

<style lang="css" scoped>
</style>
