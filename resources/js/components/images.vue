<template>
<div>
  <div>
    <h1>Images</h1>
  </div>
  <div class="form-group">
    <label>File
    <input type="file" class="form-control" id="file" ref="file" v-on:change="handleFileUpload()" placeholder="Upload Image" >
    </label>
    <button v-on:click="submitFile()">Submit</button>
  </div>
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
      file:'',
    }
  },
  methods:{
    getImages: function(){
      axios.get(this.url + "/image/v2/images",{
         headers: {'x-auth-token': this.$store.state.token}
       }).then(response=>{
           this.images = response.data.images;
           console.log(images);
         })
    },

    handleFileUpload(){
      this.file=this.$refs.file.files[0];
    },
    submitFile(){
      let formData = new FormData();
      formData.append('file',this.file);
      axios.post(this.url + "/image/v2/images",
      {
        container_format:"bare",
        disk_format:"raw",
        name:"xp",
        id:"b2173dd3-7ad6-4362-baa6-a68bce3567cb"
      },{
        headers : {"x-auth-token": this.$store.state.token}
      }).then(response=>{
        console.log('Success');
      }).catch(error=>{
        console.log('Error');
      })
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
