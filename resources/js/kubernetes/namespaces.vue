<template >
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
          <li style="color:#fff;margin-top:8px;margin-right:5px;">
            <i class="fa fa-cubes" aria-hidden="true"></i> {{this.$store.state.namespace}}
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/"><i class="fa fa-sign-out" aria-hidden="true"></i>
              Exit</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <div class="container-fluid">
      <div style="margin-top:50px" class="card">
        <div class="row">
          <div class="col-md-4">
            <button
              style="margin-top:10px;margin-left:10px;margin-bottom:10px"
              type="submit"
              class="btn btn-outline-dark"
              data-toggle="modal"
              data-target="#myModalNameSpace"
            >Create Namespace <i class="fa fa-plus-circle"></i></button>
          </div>
        </div>
      </div>
    <div class="modal" id="myModalNameSpace">  <!-- [INICIO] Formulario para criar rede -->
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Namespace</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name *</label>
              <input
                type="text"
                class="form-control"
                v-model="namespace.name"
                id="name"
                placeholder="eg: development"
              />
            </div>
            <div class="form-group">
              <label for="name">Label *</label>
              <input
                type="text"
                class="form-control"
                v-model="namespace.label"
                id="name"
                placeholder="eg: team"
              />
            </div>
          </div>

          <!-- Modal footer -->
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-warning"
              data-dismiss="modal"
              v-on:click="createNamespace()"
            >Create</button>     <!-- [FIM] Formulario para criar rede -->
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:10px" class="card shadow">
      <div class="card-header bg-primary text-white">
        List of Namespaces
      </div>

      <div class="card-body">
        <table class="table table-hover shadow">
          <thead class="thead-dark" >
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Age</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="namespace in namespaces.items" :key="namespace.metadata.name">
            <tr>
              <td>{{ namespace.metadata.name }}</td>
              <td>{{ namespace.status.phase}}</td>
              <td>{{namespace.metadata.managedFields[0].time}} Hours</td>
              <td>
                <button type="button" name="button"class="btn btn-danger" v-on:click="deleteNamespace(namespace.metadata.name)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                <button type="button" name="button"class="btn btn-secondary" data-toggle="modal" data-target="#myModalDetail" v-on:click="details(namespace)"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="this.namespaceMetadata" class="modal" id="myModalDetail" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Namespace {{this.namespaceMetadata.name}}</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">

            <div class="container">
              <label>Id:</label>
              <div class="form-control">{{this.namespaceMetadata.uid}}</div>
            </div>

            <div style="margin-top:25px" class="container">
              <label>Manager</label>
              <div class="form-control">{{this.namespaceManaged.manager}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  data:function(){
    return{
      url : process.env.MIX_URL,
      namespaces:[],
      namespacesItems:[],
      namespace:{
        name:null,
        label:null
      },
      namespaceMetadata:[],
      namespaceManaged:[],

    }
  },

  methods:{
    getNamespaces(){
      axios.get(this.url + "/api/v1/namespaces").then(response=>{
        this.namespaces = response.data;
        this.namespacesItems = response.data.items;

        var arrayLength = this.namespacesItems.length;
        for(var i = 0; i<arrayLength; i++){

          var date = this.namespacesItems[i].metadata.managedFields[0].time;
          var divideDiaHora = date.split("T");
          var dia = divideDiaHora[0].split("-");
          var divideHoraZ = divideDiaHora[1].split("Z");
          var horas = divideHoraZ[0].split(":");


          var data = new Date(dia[0],dia[1]-1,dia[2],horas[0],horas[1],horas[2],0);

          var hoje = new Date().getTime();
          var segundosNamespace = data.getTime();

          var diferenca = hoje-data;
          diferenca = (diferenca / (1000*60*60)) - 1



          this.namespacesItems[i].metadata.managedFields[0].time = diferenca.toFixed(0);
        }

      })
    },
    changeNameSpace(namespace){
       this.$store.commit("setNameSpace", namespace);
       this.$toasted.info('Changed namespace to: ' + namespace);
    },
    createNamespace(){
      axios.post(this.url + "/api/v1/namespaces",{
          "apiVersion": "v1",
          "kind": "Namespace",
          "metadata": {
            "name": this.namespace.name,
            "labels": {
              "name": this.namespace.label
            }
          }
      })
    },
    details(namespace){
      this.namespaceMetadata = namespace.metadata;
      this.namespaceManaged = namespace.metadata.managedFields[0];
      console.log(this.namespaceManaged);
    },
    deleteNamespace(namespace){
      axios.delete(this.url + "/api/v1/namespaces/" + namespace).then(response=>{

        this.$toasted.success('NameSpace Deleted!');
         this.getNamespaces();
      })
    },

  },
  mounted(){
    this.getNamespaces();
  }

}
</script>

<style lang="css" scoped>
</style>
