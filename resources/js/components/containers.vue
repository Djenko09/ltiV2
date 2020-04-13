<template>
  <div>
    <div>
      <h1>Containers</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalContainers"
      >Create Container</button>
    </div>
    <br />

    <!-- formulario para criar um CONTAINER -->
    <div class="modal" id="myModalContainers">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Containers</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" class="form-control" v-model="container.name" id="name" placeholder="Insert name without spaces" />
            </div>

            <div class="form-group">
              <label for="image">Image</label>
              <select class="form-control" id="image" name="image" v-model="container.image_name">
                <option value selected>Choose a image</option>
                <option
                  v-for="image in images"
                  :key="image.id"
                  v-bind:value="image.name"
                >{{ image.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="memory">Memory (MiB)</label>
              <input type="number" class="form-control" v-model="container.memory" id="memory" placeholder="Insert a value >0 and <8192" />
            </div>

            <div class="form-group">
              <label for="cpu">Nº Vcpus</label>
              <input type="number" class="form-control" v-model="container.cpu" id="cpu" />
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="createContainer()"
            >Create</button>
          </div>
        </div>
      </div>
    </div>   <!-- FIM formulario para criar um CONTAINER -->

      <!-- tabela que lista os  containers-->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>UUID</th>
          <th>Image</th>
          <th>Memory</th>
          <th>Vcpus</th>
          <th>Options</th>
        </tr>
      </thead>
      <tbody v-for="container in containers" :key="container.id">
        <tr>
          <td>{{ container.name }}</td>
          <td>{{ container.uuid }}</td>
          <td>{{ container.image}}</td>
          <td>{{ container.memory}} MiB</td>
          <td>{{ container.cpu}}</td>
          <td>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              v-on:click="deleteContainer(container)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>   <!-- FIM  tabela que lista os  containers-->
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      containers: [],
      container: {
        name: "",
        image_name: "",
        memory: null,
        cpu: null
      },
      images: []
    };
  },
  methods: {
    getContainers() {   //funcao que obtem os containers
      axios
        .get(this.url + "/container/v1/containers", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.containers = response.data.containers;
        });
    },
    getImages: function() {  //funcao que obtem as imagens
      axios
        .get(this.url + "/image/v2/images", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.images = response.data.images;
        });
    },
    createContainer: function() { //funcao que cria container
      axios
        .post(
          this.url + "/container/v1/containers",
          {

            image: this.container.image_name,
            name: this.container.name,
            cpu: this.container.cpu,
            memory: this.container.memory,
            security_groups: ["default"],
            availability_zone: "nova",

          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
          this.$toasted.show("Container Created");
          this.getContainers();
        }).catch(error =>{
          this.$toasted.error("Container not created! An error ocurred")
        });
    },

    deleteContainer: function(container) { //funcao que elimina um container
      axios.delete(this.url + "/container/v1/containers/" +container.uuid, {
        headers: { "x-auth-token": this.$store.state.token }
      }) .then(response => {
          this.$toasted.show("Container Deleted With Success");
          this.getContainers();
        }).catch(error =>{
          this.$toasted.error("Container not deleted! An error ocurred")
        });

    }
  },

  mounted() { //a pagina ao ser carregada executa as seguintes funcoes
    this.getContainers();
    this.getImages();
  }
};
</script>
