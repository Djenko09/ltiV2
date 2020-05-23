<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="col-auto mr-auto">
            <div style="margin-top:10px;margin-left:5px;"class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01"><i class="fa fa-cubes" aria-hidden="true"></i></label>
              </div>
              <select class="custom-select" id="inputGroupSelect01">
                <option selected>Select Namespace</option>
                <option v-for="namespace in namespaces" :value="namespace.metadata.name" v-on:click="changeNameSpace(namespace.metadata.name)">{{namespace.metadata.name}}</option>
              </select>
            </div>
        </div>
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
    <div style="margin-top:50px" class="card shadow">
       <div class="card-header bg-primary text-white">
          <div>Replica Sets List</div>
      </div>
      <div class="card-body">
        <table v-if="replicas.length" class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Age</th>
              <th>Image</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody v-for="replica in replicas">
            <tr>
              <td>{{replica.metadata.name}}</td>
              <td>{{replica.metadata.labels}}</td>
              <td>{{replica.metadata.managedFields[0].time}} Hours</td>
               <td>{{replica.spec.template.spec.containers[0].image}}</td>
         <td>
                <button
                  type="button"
                  name="button"
                  class="btn btn-secondary"
                  data-toggle="modal"
                  data-target="#myModalDetail"
                  v-on:click="detail(replica)"
                >Details</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="jumbotron shadow">
          <h2 class="text-center">Nothing to show. Namespace {{this.$store.state.namespace}} has no replicas</h2>
        </div>
        <!-- FIM tabela que lista os deployments -->
      </div>
    </div>
    <div class="modal" id="myModalDetail" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Details</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
          <div class="modal-body">
            <b>Name:</b>
            {{this.replicaDetailsMetadata.name}}
            <br />
            <b>uid:</b>
            {{this.replicaDetailsMetadata.uid}}
            <br />
            <b>Labels:</b>
            {{this.replicaDetailsMetadata.labels}}
            <br />
            <b>Annotations:</b>
            {{this.replicaDetailsMetadata.annotations}}
            <br />

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
      replicas: [],
      replica: {},
      namespaces: [],
      replicaDetailsMetadata: [],
      replicaDetailsSpec: [],
      replicaDetailsStatus: [],
    };
  },
  methods: {
    getReplicas() {
      //função para obter os pods
      axios
        .get(this.url + "/apis/apps/v1/namespaces/"+this.$store.state.namespace+"/replicasets")

        .then(response => {
          console.log(response.data);
          this.replicas = response.data.items;
          var arrayLength = this.replicas.length;
          for(var i = 0; i<arrayLength; i++){

            var date = this.replicas[i].metadata.managedFields[0].time;
            var divideDiaHora = date.split("T");
            var dia = divideDiaHora[0].split("-");
            var divideHoraZ = divideDiaHora[1].split("Z");
            var horas = divideHoraZ[0].split(":");


            var data = new Date(dia[0],dia[1]-1,dia[2],horas[0],horas[1],horas[2],0);

            var hoje = new Date().getTime();
            var segundosNamespace = data.getTime();

            var diferenca = hoje-data;
            diferenca = (diferenca / (1000*60*60)) - 1


            //vidaNamespace = vidaNamespace / 36000;
            this.replicas[i].metadata.managedFields[0].time = diferenca.toFixed(1);
          }
        });
    },
      getNamespaces() {
      axios.get(this.url + "/api/v1/namespaces").then(response => {
        this.namespaces = response.data.items;
      });

    },
    changeNameSpace(namespace){
       this.$store.commit("setNameSpace", namespace);
       this.$toasted.info('Changed namespace to: ' + namespace);
       this.getReplicas();
    },
     detail(replica) {
      this.replicaDetailsMetadata = replica.metadata;
       this.replicaDetailsSpec = replica.spec;
       this.replicaDetailsStatus= replica.status;

    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getReplicas();
    this.getNamespaces();
  }
};
</script>
