<template>
  <div class="jumbotron bg-info">
    <h2>{{title}}</h2>

    <div class="alert alert-danger" v-if="showError">
      <button type="button" class="close-btn" v-on:click="showError=false">&times;</button>
      <strong>{{ successMessage }}</strong>
    </div>

    <div class="form-group">
      <label for="name">Name</label>
      <input type="text" class="form-control" v-model="volume.name" id="name" />
    </div>

    <div class="form-group">
      <label for="image">Size (GB)</label>
      <input type="text" class="form-control" v-model="volume.size" id="size" />
    </div>

    <div class="form-group">
      <a
        class="btn btn-primary"
        v-on:click.prevent="createVolume(volume, project_id)"
      >Create Instance</a>
      <a class="btn btn-danger" v-on:click.prevent="cancel()">Cancel</a>
    </div>
  </div>
</template>


<script >
export default {
  data: function() {
    return {
      title: "Create Volume",
      // user: this.$store.state.user,

      volume: {
        name: "",
        size: ""
      },
      url: process.env.MIX_URL,
      showError: false,
      successMessage: "",
      flavors: [],
      images: [],
      networks: [],
      project_id: ""
    };
  },
  methods: {
    createVolume: function(volume, project_id) {
      axios
        .post(
          this.url + "/volume/v3/" + project_id +"/volumes",
          {
            
    "volume": {
        "size": volume.size,
        "availability_zone": null,
        "source_volid": null,
        "description": null,
        "multiattach": false,
        "snapshot_id": null,
        "backup_id": null,
        "name": volume.name,
        "imageRef": null,
        "volume_type": null,
        "metadata": {},
        "consistencygroup_id": null
    },
   
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
    getProjectID() {
      axios
        .get(this.url + "/identity/v3/auth/tokens", {
          headers: {
            "x-auth-token": this.$store.state.token,
            "x-subject-token": this.$store.state.token
          }
        })
        .then(response => {
          this.project_id = response.data.token.project.id;
          console.log(this.project_id);
        });
    },
    cancel: function() {
      this.$router.push("/home");
    }
  },

  mounted() {
    this.getProjectID();
  }
};
</script>