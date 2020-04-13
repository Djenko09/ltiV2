<template>
  <div>
    <br />
    <div>
      <h1>Images</h1>
    </div>
    <br />
    <div class="form-group">

      <button
        type="button"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target=".bd-example-modal-xl"
      >New Image</button>
    </div>
    <br />
  <!-- formulario para criar imagem -->
    <div class="modal fade bd-example-modal-xl" id="myModalImages">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h3 class="modal-title">Create a new Image</h3><br>

            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div><br>
          <!-- Modal body -->
          <div class="modal-body">
            <form class action="index.html" method="post">
              <div class="form-group">
                <label for="name">Name *</label>
                <input
                  required
                  type="text"
                  class="form-control"
                  placeholder="A name for the image"
                  name="name"
                  v-model="image.name"
                />
              </div>
              <br />
              <div class="form-group">
                <h3>Image Source *</h3>
                <input
                  type="file"
                  class="form-control"
                  id="file"
                  ref="file"
                  v-on:change="handleFileUpload"
                  placeholder="Upload Image"
                />
              </div><br>
              <div class="form-group">
                <label for="Disk_format">Disk Format *</label>
                <select required class="form-control text-capitalize" v-model="image.disk_format">
                  <option value selected>Choose a format</option>
                  <option value="iso">ISO - Optical Disk Image</option>
                  <option value="ami">Ami - Amazon Kernel Image</option>
                  <option value="ari">ARI - Amazon Ramdisk Image</option>
                  <option value="aki">AKI - Amazon Kernel Image</option>
                  <option value="vhd">VHD - Virtual Hard Disk</option>
                  <option value="vmdk">VMDK - Virtual Machine Disk</option>
                  <option value="raw">RAW</option>
                  <option value="qcow2">QCOW2 - QEMU Emulator</option>
                  <option value="vdi">VDI - Virtual Disk Image</option>
                  <option value="ploop">PLOOP - Virtuozzo/Parallels Loopback Disk</option>
                </select>
              </div>
              <br>
              <h3>Image requirements *</h3><br>

              <div class="form-inline">
                <label for="disk">Minimum Disk (GB) *</label><br>
                <input
                  required
                  class="form-control mb-2 mr-sm-2 mb-sm-0"
                  type="number"
                  name="disk"
                  v-model="image.min_disk"
                />
                <label required for="ram">Minimum RAM (MB) *</label><br>
                <input
                  class="form-control mb-2 mr-sm-2 mb-sm-0"
                  type="number"
                  placeholder="1"
                  name="ram"
                  v-model="image.min_ram"
                />
              </div><br>

              <br />

              <h3>Image Sharing</h3><br>

              <label for="visibility ">Visibility:</label>
              <div class="form-group">
                <select required class="form-control text-capitalize" v-model="image.visibility">
                  <option value selected>Choose visibility</option>
                  <option value="private">Private</option>
                  <option value="shared">Shared</option>
                  <option value="community">Community</option>
                </select>
                  <br>
                  <div class="form-group">
                    <label for="protected">Protected:  </label>
                    <label class="mr-3">
                      <input type="radio" class="mr-1" value=true v-model="image.protected" /> Yes
                    </label>
                    <label class="mr-3">
                      <input type="radio" class="mr-1" value=false v-model="image.protected" /> No
                    </label>
                  </div>
                  <br>

              </div><br>
              <br>

              <!-- </label> -->
              <!-- Modal footer -->
              <div class="modal-footer">
                <input
                  type="submit"
                  class="btn btn-warning"
                  data-dismiss="modal"
                  :class="{ disabled: isDisabled }" :disabled="isDisabled"
                  v-on:click="createImage()"
                  value="Create"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div><!-- FIM formulario para criar imagem -->


<!-- tabela que mostra as imagens -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Disk Format</th>
          <th>Container Format</th>
          <th>Status</th>
          <th>Protected</th>
          <th>Visibility</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody v-for="image in images" :key="image.id">
        <tr>
          <td v-if="image.name === ''">{{ image.id }}</td>
          <td v-else>{{ image.name }}</td>
          <td>{{ image.disk_format }}</td>
          <td>{{ image.container_format}}</td>
          <td class="bg-success" v-if="image.status === 'active'">{{ image.status }}</td>
          <td class="bg-danger" v-else>{{ image.status }}</td>
          <td v-if="image.protected == false">NO</td>
          <td v-else>YES</td>
          <td>{{ image.visibility }}</td>
          <td>
            <button type="button" class="btn btn-sm btn-success">Edit</button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteImage(image.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>   <!-- FIM tabela que mostra as imagens -->
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      images: [],
      disk_formats: [
        "ami",
        "ari",
        "aki",
        "vhd",
        "vhdx",
        "vmdk",
        "raw",
        "qcow2",
        "vdi",
        "ploop",
        "iso"
      ],
      image: {
        name: "",
        disk_format: "",
        container_format: "bare",
        min_disk: null,
        min_ram: null,
        protected: false,
        tags: [],
        visibility: "private"
      },
      imageId: null,
      file: "",
      loading : true
    };
  },
  methods: {
    getImages: function() {   //função que obtem as imagens
      axios
        .get(this.url + "/image/v2/images", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.images = response.data.images;
        });
    },

    handleFileUpload(e) {
      this.file = e.target.files[0];

    },
    createImage() {  //função para criar imagemn

      if(this.image.protected === "true"){
        this.image.protected = true;
      }
        if(this.image.protected === "false"){
        this.image.protected = false;
      }
      axios
        .post(
          this.url + "/image/v2/images",
          {
            name: this.image.name,
            disk_format: this.image.disk_format,
            container_format: this.image.container_format,
            min_disk: parseInt(this.image.min_disk),
            min_ram: parseInt(this.image.min_ram),
            protected: this.image.protected,
            tags: this.image.tags,
            visibility: this.image.visibility
          },
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )
        .then(response => {
          this.imageId = response.data.id;
          this.image.name = undefined;

          this.submitfile();
          this.getImages();
        })
        .catch(error => {

        });
    },
    submitfile() {  //funcao para subtmeter o ficheiro da imagem
      delete axios.defaults.headers.common["Authorization"];
      axios
        .put(
          this.url + "/image/v2/images/" + this.imageId + "/file",
          this.file,
          {
            headers: {
              "Content-Type": "application/octet-stream",
              "X-Auth-Token": this.$store.state.token
            }
          }
        ),
        this.loading = true
        .then(response => {
          this.loading = false
          this.$toasted.success('Image created!')
          this.getImages();
        })
        .catch(error => {
          this.$toasted.error('Image not Created! An error ocurred')
        });
    },
    deleteImage(image) { //funcao que apaga uma imagem
      axios
        .delete(this.url + "/image/v2/images/" + image, {
          headers: {
            "X-Auth-Token": this.$store.state.token
          }
        })
        .then(response => {
          this.$toasted.info("Image deleted");
          this.getImages();
        })
        .catch(error => {
          this.$toasted.error("Error deleting image");
        });
    },
    exit() {
      this.$emit("exit-images");
    }
  },
  computed:{
    isDisabled () {
      if (this.image.name && this.file && this.image.min_disk && this.image.min_ram && this.image.disk_format) {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted() {   //a pagina ao ser carregada executa as seguintes funcoes
    this.getImages();
  }
};
</script>

<style lang="css" scoped>
</style>
