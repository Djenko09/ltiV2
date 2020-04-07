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
          <h4 class="modal-title">Create a new Image</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" class="form-control"  placeholder="A name for the image" name="name" v-model="image.name"></input>
          </div>
          <div class="form-group">
            <label for="Disk_format">Disk Format *</label>
              <select class="form-control text-capitalize" v-model="image.disk_format">
               <option v-model="image.disk_format" value="ami">ami axd</option>
               <option v-model="image.disk_format">ari</option>
               <option v-model="image.disk_format">aki</option>
               <option v-model="image.disk_format">vhd</option>
               <option v-model="image.disk_format">vhdx</option>
               <option v-model="image.disk_format">vmdk</option>
               <option v-model="image.disk_format">raw</option>
               <option v-model="image.disk_format">qcow2</option>
               <option v-model="image.disk_format">vdi</option>
               <option v-model="image.disk_format">ploop</option>
               <option v-model="image.disk_format">iso</option>
            </select>
          </div>
          <div class="form-group">
            <label for="disk">Minimum Disk *</label>
            <input type="number" name="disk"  v-model="image.min_disk">
          </div>
          <div class="form-group">
            <label for="ram">Minimum RAM *</label>
            <input type="number" name="ram"  v-model="image.min_ram">
          </div>
          <div class="form-group">
            <input type="checkbox" id="protected1" name="protected1" value=true>
            <label for="protected1">Yes</label><br>
            <input type="checkbox" id="protected2" name="protected2" value=false>
            <label for="protected2">No</label><br>
          </div>
          <input type="file" class="form-control" id="file" ref="file" v-on:change="handleFileUpload" placeholder="Upload Image" >
          </label>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="createImage()">Create</button>
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
        <th>Status</th>
        <th>Visibility</th>
        <th>Options</th>
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
      <td class="bg-success" v-if="image.status === 'active'">{{ image.status }}</td>
      <td class="bg-danger" v-else>{{ image.status }}</td>
      <td>{{ image.visibility }}</td>
      <td>
       <button
            type="button"
            class="btn btn-sm btn-success"
          >Edit</button>
        <button
        type="button"
        class="btn btn-sm btn-danger"
        v-on:click="deleteImage(image.id)"
        >Delete </button>
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
        id:null,
        name:null,
        disk_format:null,
        container_formart:null,
        min_disk:null,
        min_ram:null,
        protected:null,
        tags:[],
        visibility:null,
      },
      disk_formats:[
        'ami',"ari","aki","vhd", "vhdx","vmdk","raw","qcow2","vdi","ploop","iso"
      ],
      image:{
        name:"undefined",
        disk_format:"iso",
        container_formart:"bare",
        min_disk:null,
        min_ram:null,
        protected:false,
        tags:[],
        visibility:"shared",
      },
      imageId:null,
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

    handleFileUpload(e){
      this.file= e.target.files[0];
      console.log(event.target.files[0])
    },
    createImage(){
      axios.post(this.url + "/image/v2/images",
      {
        "name":this.image.name,
        "disk_format":this.image.disk_format,
        "min_disk":parseInt(this.image.min_disk),
        "min_ram":parseInt(this.image.min_ram),
        "protected":this.image.protected,
        "tags":this.image.tags,
        "visibility":this.image.visibility

      },{
        headers : {"x-auth-token": this.$store.state.token}
      }).then(response=>{
        this.imageId= response.data.id
        console.log(this.imageId)
        this.submitfile();
        this.getImages();
      }).catch(error=>{
        console.log('Error');
      })
    },
    submitfile(){
     delete axios.defaults.headers.common["Authorization"];
      axios.put(this.url + "/image/v2/images/"+this.imageId+"/file",this.file,{
        headers : {
          "Content-Type" :"application/octet-stream",
          'X-Auth-Token': this.$store.state.token
          }

      }).then(response=>{
        console.log("UploadSucess!");
        this.getImages();
      }).catch(error=>{
        console.log('Error');
      })
    },
    deleteImage(image){
      axios.delete(this.url + "/image/v2/images/"+image,{
        headers : {
          'X-Auth-Token': this.$store.state.token
          }
      }).then(response=>{
        this.$toasted.info("Image deleted")
        this.getImages();
      }).catch(error =>{
        this.$toasted.error("Error deleting image");
      })
    },
    exit(){
      this.$emit('exit-images');
    }
  },
  mounted(){
    this.getImages();
  }

}
</script>

<style lang="css" scoped>
</style>
