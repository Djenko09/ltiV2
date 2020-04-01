<template>
  <div class="jumbotron bg-info">
    <h2>{{title}}</h2>

    <div class="alert alert-danger" v-if="showError">
      <button type="button" class="close-btn" v-on:click="showError=false">&times;</button>
      <strong>{{ successMessage }}</strong>
    </div>

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

    <div class="form-group">
      <a class="btn btn-success" v-on:click.prevent="createInstance()">Create Instance</a>
      <a class="btn btn-danger" v-on:click.prevent="cancel()">Cancel</a>
    </div>
  </div>
</template>


<script >
export default {
  data: function() {
    return {
      title: "Create Instance",
      // user: this.$store.state.user,
      instance: {
        name: "",
        flavor_id: "",
        image_id: "",
        network_id: ""
      },
      url: process.env.MIX_URL,
      showError: false,
      successMessage: "",
      flavors: [],
      images: [],
      networks: []
    };
  },
  methods: {
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
    getFlavors: function() {
      axios
        .get(this.url + "/compute/v2.1/flavors/detail", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          console.log(response.data.flavors);
          this.flavors = response.data.flavors;
          console.log(this.flavors);
        });
    },
    getImages: function() {
      axios
        .get(this.url + "/image/v2/images", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.images = response.data.images;
          console.log(this.images);
        });
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
    cancel: function() {
      this.$router.push("/home");
    }
  },

  mounted() {
    this.getFlavors();
    this.getImages();
    this.getNetworks();
  }
};
</script>