<template>
  <div>
    <div>
      <h1>Volumes</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalVolumes"
      >Create Volume</button>
    </div>
    <br />
    <div class="modal" id="myModalVolumes">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Volumes</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" v-model="volume.name" id="name" />
            </div>

            <div class="form-group">
              <label for="size">Size (GB)</label>
              <input type="text" class="form-control" v-model="volume.size" id="size" />
            </div>

            <div class="form-group">
              <label for="image">Image</label>
              <select class="form-control" id="image" name="image" v-model="volume.image_id">
                <option value selected>Choose a image</option>
                <option
                  v-for="image in images"
                  :key="image.id"
                  v-bind:value="image.id"
                >{{ image.name }}</option>
              </select>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="createVolume()"
            >Create</button>
          </div>
        </div>
      </div>
    </div>
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Description</th>
          <th>Status</th>
          <th>Type</th>
          <th>Availability Zone</th>
          <th>Bootable</th>
          <th>Encrypted</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody v-for="volume in volumes" :key="volume.id">
        <tr>
          <td v-if="volume.name == ''">{{ volume.id }}</td>
          <td v-else>{{volume.name}}</td>
          <td>{{ volume.size}} GiB</td>
          <td v-if="volume.description == ''">-</td>
          <td v-else>{{volume.description}}</td>
          <td
            class="bg-success"
            v-if="volume.status === 'available'"
          >{{volume.status.toUpperCase()}}</td>
          <td class="bg-info" v-if="volume.status === 'in-use'">{{volume.status.toUpperCase()}}</td>
          <td class="bg-danger" v-if="volume.status === 'error'">{{volume.status.toUpperCase()}}</td>
          <td>{{volume.volume_type}}</td>
          <td>{{volume.availability_zone}}</td>
          <td v-if="volume.bootable === 'true'">YES</td>
          <td v-else>NO</td>
          <td v-if="volume.encrypted == false">NO</td>
          <td v-else>YES</td>
          <td>
            <button
              type="button"
              class="btn btn-sm btn-success"
              data-toggle="modal"
              data-target="#myModalVolumeEdit"
              v-on:click="volumeEdit(volume)"
            >Edit</button>
            <button
              type="button"
              class="btn btn-sm btn-warning"
              data-toggle="modal"
              data-target="#myModalSizeEdit"
              v-on:click="volumeEdit(volume)"
            >Edit size</button>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteVolume(volume)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="modal" id="myModalVolumeEdit">
      <!-- [INICIO] Formulario para editar router-->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">
              Edit Volume:
              <b>{{volume.name}}</b>
            </h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Volume Name</label>
              <input type="text" class="form-control" v-model="volume.name" id="name" />
            </div>
            <div class="form-group">
              <label for="name">Description</label>
              <input type="text" class="form-control" v-model="volume.description" id="description" />
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="sendVolumeEdit()"
              >Edit</button>
              <!--[FIM] Formulario para editar router -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal" id="myModalSizeEdit">
      <!-- [INICIO] Formulario para editar size volume-->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">
              Edit size of Volume:
              <b>{{volume.name}}</b>
            </h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">New Size(> than actual size)</label>
              <input type="text" class="form-control" v-model="volume.size" id="size" />
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="sendSizeEdit()"
              >Edit Size</button>
              <!--[FIM] Formulario para editar size volume -->
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
      volumes: [],
      volume: {
        id: "",
        name: "",
        size: "",
        image_id: ""
      },
      images: [],
      flavors: []
    };
  },
  methods: {
    getVolumes() {
      axios
        .get(
          this.url +
            "/volume/v3/" +
            this.$store.state.project +
            "/volumes/detail",
          {
            headers: { "x-auth-token": this.$store.state.token }
          }
        )

        .then(response => {
          console.log(response.data);
          this.volumes = response.data.volumes;
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
    deleteVolume: function(volume) {
      axios.delete(
        this.url +
          "/volume/v3/" +
          this.$store.state.project +
          "/volumes/" +
          volume.id,
        {
          headers: { "x-auth-token": this.$store.state.token }
        }
      );

      this.$toasted.show("Volume Deleted With Success");
    },
    createVolume: function() {
      if (this.volume.image_id == "") {
        //se a imagem não for passada
        axios
          .post(
            this.url + "/volume/v3/" + this.$store.state.project + "/volumes",
            {
              volume: {
                size: this.volume.size,
                availability_zone: null,
                source_volid: null,
                description: null,
                multiattach: false,
                snapshot_id: null,
                backup_id: null,
                name: this.volume.name,
                imageRef: null,
                volume_type: null,
                metadata: {},
                consistencygroup_id: null
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
            this.$toasted.show("Volume Created");
            this.getVolumes();
          });
      } else {
        //com imagem
        axios
          .post(
            this.url + "/volume/v3/" + this.$store.state.project + "/volumes",
            {
              volume: {
                size: this.volume.size,
                availability_zone: null,
                source_volid: null,
                description: null,
                multiattach: false,
                snapshot_id: null,
                backup_id: null,
                name: this.volume.name,
                imageRef: this.volume.image_id,
                volume_type: null,
                metadata: {},
                consistencygroup_id: null
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
            this.$toasted.show("Volume Created");
            this.getVolumes();
          });
      }
    },
    volumeEdit: function(volume) {
      this.volume.id = volume.id;
      this.volume.name = volume.name;
      this.volume.size = volume.size;
    },
    sendVolumeEdit() {
      axios
        .put(
          this.url +
            "/volume/v3/" +
            this.$store.state.project +
            "/volumes/" +
            this.volume.id,
          {
            volume: {
              name: this.volume.name,
              description: this.volume.description
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
          this.$toasted.show("Volume edited!");
          this.getVolumes();
        });
    },
    sendSizeEdit: function() {
         axios
        .post(this.url + "/volume/v3/"+this.$store.state.project +"/volumes/" + this.volume.id + "/action",
          {
            "os-extend": {
              new_size: this.volume.size,
              

            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }) .then(response => {
           this.$toasted.show("Size edited!");
           this.getVolumes();
          })
    }
  },

  mounted() {
    this.getVolumes();
    this.getImages();
  }
};
</script>
