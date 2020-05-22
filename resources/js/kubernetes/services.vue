<template>
  <div>
    <div class="modal" id="myModalService">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Deployment</h4>
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
              <select class="" name="protocolSelect" v-model="service.protocol">
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
    <div >
      <button type="button" name="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModalService" >Create service</button>
    </div>
    <div style="margin-top:50px" class="card">
        <div class="card-header bg-primary text-white">

          <div>Services List of namespace:  <b class="text-dark">{{this.$store.state.namespace}}</b> </div>
           <a class="text-dark"> Change Namespace</a>
          <select>
            <option v-for="namespace in namespaces" :value="namespace.metadata.name" v-on:click="changeNameSpace(namespace.metadata.name)">{{namespace.metadata.name}}</option>
          </select>

      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
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
              <td>{{service.metadata.labels}}</td>
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
                <button type="button" name="button" class="btn btn-danger" v-on:click="deleteService(service.metadata.name)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
        <!-- FIM tabela que lista os pods -->
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
      namespaces: []
    }
  },
  methods: {
    getServices() {
      axios
        .get(this.url + "/api/v1/namespaces/"+this.$store.state.namespace+"/services")

        .then(response => {
          console.log(response.data);
          this.services = response.data.items;
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
        });
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
     this.getServices();
  },
},
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getServices();
    this.getNamespaces();
  }
}
</script>
