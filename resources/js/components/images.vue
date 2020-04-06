<template>
<div>
  <br>
  <div>
    <h1>Images</h1>
  </div>
  <br>
  <div class="form-group">
    <!--<label>File
    <input type="file" class="form-control" id="file" ref="file" v-on:change="handleFileUpload()" placeholder="Upload Image" >
    </label>
    <button v-on:click="submitFile()">Submit</button>-->
    <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModalImages">New Image</button>

  </div>
  <br>

  <div class="modal" id="myModalImages">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Create Security Group</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" class="form-control"  placeholder="A name for the iamge" name="name" v-model="images.name"></input>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="submitFile()" >Create</button>
        </div>

      </div>
    </div>
  </div>

  <table class="table table-hover">

    <thead>
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
      images:{
        name:null,
        id:null,
      },
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
        name:this.images.name,
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
