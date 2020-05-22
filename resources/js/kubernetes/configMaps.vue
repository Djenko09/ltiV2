<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <div class="col-auto mr-auto">
            <div style="margin-top:10px;margin-left:5px;" class="input-group mb-3">
              <div class="input-group-prepend">
                <label class="input-group-text" for="inputGroupSelect01"><i class="fa fa-cubes" aria-hidden="true"></i></label>
              </div>
              <select class="custom-select" id="inputGroupSelect01">
                <option selected>{{this.$store.state.namespace}}</option>
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
    <div style="margin-top:50px" class="card">
       <div class="card-header bg-primary text-white">
          <div>Config Maps List</div>
      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Age</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody v-for="config in configs">
            <tr>
              <td>{{config.metadata.name}}</td>
              <td v-if="config.metadata.labels">{{config.metadata.labels}}</td>
              <td v-if="!config.metadata.labels">----</td>
              <td>{{config.metadata.managedFields[0].time}} Hours</td>
         <td>
                <button
                  type="button"
                  name="button"
                  class="btn btn-secondary"
                  data-toggle="modal"
                  data-target="#myModalDetail"
                  v-on:click="detail(config)"
                >Details</button>
              </td>
            </tr>
          </tbody>
        </table>
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
            {{this.configDetailsMetadata.name}}
            <br />
            <b>uid:</b>
            {{this.configDetailsMetadata.uid}}
            <br />
            <b>Labels:</b>
            {{this.configDetailsMetadata.labels}}
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
      configs: [],
      config: {},
      namespaces: [],
      configDetailsMetadata: [],
      configDetailsSpec: [],
      configDetailsStatus: [],
    };
  },
  methods: {
    getConfigs() {
      //função para obter os pods
      axios
        .get(this.url + "/api/v1/namespaces/"+this.$store.state.namespace+"/configmaps")

        .then(response => {
          console.log(response.data);
          this.configs = response.data.items;
          var arrayLength = this.configs.length;
          for(var i = 0; i<arrayLength; i++){

            var date = this.configs[i].metadata.managedFields[0].time;
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
            this.configs[i].metadata.managedFields[0].time = diferenca.toFixed(1);
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
       this.getConfigs();
    },
     detail(replica) {
      this.configDetailsMetadata = replica.metadata;
       this.configDetailsSpec= replica.spec;
       this.configDetailsStatus= replica.status;

    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getConfigs();
    this.getNamespaces();
  }
};
</script>
