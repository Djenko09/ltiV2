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
    <div class="modal" id="myModalService">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Service</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="service.name"
                id="name"
                placeholder="Insert a name "
              />
            </div>
            <div class="form-group">
              <div class="row">
                <div class="col">
                  <label for="image">Port</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="service.port"
                    placeholder="80"
                  />
                </div>
                <div class="col">
                  <label for="replicas">Target port</label>
                  <input
                    type="number"
                    class="form-control"
                    v-model="service.targetPort"
                    placeholder="80"
                  />
                </div>
              </div>
            </div>
            <div class="form-group">
              <label for="protocol">Procotol</label>
              <select class="form-control" name="protocolSelect" v-model="service.protocol">
                <option value="TCP">TCP</option>
                <option value="UDP">UPD</option>
              </select>
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="createService()"
              >Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
      <div class="container-fluid">
      <div style="margin-top:50px" class="card">
        <div class="row">
          <div class="col-md-4">
            <button
              style="margin-top:10px;margin-left:10px;margin-bottom:10px"
              type="submit"
              class="btn btn-outline-dark"
              data-toggle="modal"
              data-target="#myModalService"
            >Create Service <i class="fa fa-plus-circle"></i></button>
          </div>
        </div>
      </div>
    <div style="margin-top:10px" class="card shadow">
        <div class="card-header bg-primary text-white">
          <div>Services list</div>
      </div>
      <div class="card-body">
        <table v-if="services.length" class="table table-hover shadow">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Cluster IP</th>
              <th>Internal endpoints</th>
              <th>External endpoints</th>
              <th>Age</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody v-for="service in services">
            <tr>
              <td>{{service.metadata.name}}</td>
              <td>{{service.spec.clusterIP}}</td>
              <td v-if="service.spec.ports[0].nodePort">
                {{service.metadata.name}}: {{service.spec.ports[0].port}}\{{service.spec.ports[0].protocol}} |
                {{service.metadata.name}}: {{service.spec.ports[0].nodePort}}\{{service.spec.ports[0].protocol}}
              </td>

              <td
                v-if="!service.spec.ports[0].nodePort"
              >{{service.metadata.name}}: {{service.spec.ports[0].port}}\{{service.spec.ports[0].protocol}}</td>
              <td>x</td>
              <td>{{service.metadata.managedFields[0].time}} Hours</td>
              <td>
                <button type="button" name="button" class="btn btn-danger" v-on:click="deleteService(service.metadata.name)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                <button type="button" name="button" class="btn btn-secondary" data-toggle="modal"
                data-target="#myModalDetail" v-on:click="detail(service)"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="jumbotron shadow">
          <h2 class="text-center">Nothing to show. Namespace {{this.$store.state.namespace}} has no services</h2>
        </div>
      </div>
    </div>
     <div class="modal" id="myModalDetail" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Details </h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
           <div class="modal-body">
            <b>Name:</b>  {{this.serviceDetailsMetadata.name}}<br>
            <b>uid:</b>  {{this.serviceDetailsMetadata.uid}}<br>
            <b>NameSpace:</b> {{this.serviceDetailsMetadata.namespace}}<br>
            <b>Labels:</b>  {{this.serviceDetailsMetadata.labels}}<br>
            <b>Creations time:</b> {{this.serviceDetailsMetadata.creationTimestamp}}<br><br>
            <b>Cluster IP:</b> {{this.serviceDetailsSpec.clusterIP}}<br>
            <b>Type:</b> {{this.serviceDetailsSpec.type}}<br>
            <b>Session Affinity:</b> {{this.serviceDetailsSpec.sessionAffinity}}<br><br>

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
      services: [],
      service: {
        name:null,
        port:null,
        targetPort:null,
        namespace:null,
        protocol:null,
      },
      namespaces: [],

      //details
      serviceDetailsMetadata : [],
      serviceDetailsSpec : [],
      serviceDetailsStatus : []
    }
  },
  methods: {
    getServices() {
      axios
        .get(this.url + "/api/v1/namespaces/"+this.$store.state.namespace+"/services")

        .then(response => {

          this.services = response.data.items;
          this.calculoIdade();
        });
    },
    calculoIdade(){
      var arrayLength = this.services.length;
      for(var i = 0; i<arrayLength; i++){

        var date = this.services[i].metadata.managedFields[0].time;
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
        this.services[i].metadata.managedFields[0].time = diferenca.toFixed(1);
      }
    },
    deleteService(service){
      axios.delete(this.url + "/api/v1/namespaces/default/services/" + service).then(response=>{
        this.$toasted.show("Service " + " '" + service  + "' "  + " deleted");
        this.getServices();
      });
    },
    createService(){
      axios.post(this.url + "/api/v1/namespaces/" + this.$store.state.namespace + "/services",{
        "kind": "Service",
        "apiVersion": "v1",
        "metadata": {
            "name": this.service.name,
            "namespace": this.$store.state.namespace,
            "labels": {
              "app":  this.service.name,
            }
        },
        "spec": {
           "ports": [
            	{
	            "name": "90-90",
	            "protocol": this.service.protocol,
	            "port" : parseInt(this.service.port),
	            "targetPort" : parseInt(this.service.targetPort)
        		 }
            ],
                "selector": {
                    "app":  this.service.name
                },
                "type": "NodePort",
                "sessionAffinity": "None",
                "externalTrafficPolicy": "Cluster"
            }
      })
    },
    getNamespaces() {
    axios.get(this.url + "/api/v1/namespaces").then(response => {
      this.namespaces = response.data.items;
    });
  },
  changeNameSpace(namespace){
     this.$store.commit("setNameSpace", namespace);
     this.$toasted.info('Changed namespace to: ' + namespace);
     this.getServices();

  },
  detail(service) {
       this.serviceDetailsMetadata = service.metadata;
       this.serviceDetailsSpec= service.spec;
       this.serviceDetailsStatus = service.status;

    }
},
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getServices();
    this.getNamespaces();
  }
}
</script>
