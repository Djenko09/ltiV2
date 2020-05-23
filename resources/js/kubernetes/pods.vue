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
    <div class="modal" id="myModalPod">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Pods for namespace: <b>{{this.$store.state.namespace}}</b></h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="pod.name"
                id="name"
                placeholder="Insert name "
              />
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="createPod()"
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
              data-target="#myModalPod"
            >Create Pod <i class="fa fa-plus-circle"></i></button>
          </div>
        </div>
      </div>
    <div style="margin-top:10px" class="card shadow">
        <div class="card-header bg-primary text-white">

          <div>Pods List</div>
      </div>
      <div class="card-body">
        <table v-if="pods.length" class="table table-hover shadow">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Node</th>
              <th>Status</th>
              <th>Restarts</th>
              <th>Age</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody v-for="pod in pods">
            <tr>
              <td>{{pod.metadata.name}}</td>
              <td v-if="pod.spec.nodeName">{{pod.spec.nodeName}}</td>
              <td v-else>----</td>
              <td>{{pod.status.phase}}</td>
              <td v-for="res in pod.status.containerStatuses" v-if="res.restartCount">{{res.restartCount}}</td>
              <td>----</td>
              <td v-if="pod.metadata.managedFields[0].time">{{pod.metadata.managedFields[0].time}} Hours</td>
              <td v-else>----</td>
              <td>
                <button type="button" name="button" class="btn btn-danger" v-on:click="deletePod(pod.metadata.name)"><i class="fa fa-trash" aria-hidden="true"></i></button>
                 <button type="button" name="button" class="btn btn-secondary" data-toggle="modal"
        data-target="#myModalDetail" v-on:click="detail(pod)"><i class="fa fa-info-circle" aria-hidden="true"></i>
</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="jumbotron shadow">
          <h2 class="text-center">Nothing to show. Namespace {{this.$store.state.namespace}} has no pods</h2>
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
            <b>Name:</b>  {{this.podDetailsMetadata.name}}<br>
            <b>uid:</b>  {{this.podDetailsMetadata.uid}}<br>
            <b>NameSpace:</b> {{this.podDetailsMetadata.namespace}}<br>
            <b>Labels:</b>  {{this.podDetailsMetadata.labels}}<br>
            <b>Creations time:</b> {{this.podDetailsMetadata.creationTimestamp}}<br>
            <b>Node:</b> {{this.podDetailsSpec.nodeName}}<br><br>
            <b>Pod IP:</b> {{this.podDetailsStatus.podIP}}<br>
            <b>Host IP:</b> {{this.podDetailsStatus.hostIP}}<br><br>
            <b>Status:</b> {{this.podDetailsStatus.phase}}<br>
            <b>QoS Class:</b> {{this.podDetailsStatus.qosClass}}<br>
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
      pods: [],
      pod: {
        name:null,
        containerName: null,

      },

      //details
      podDetailsMetadata: [],
      podDetailsSpec: [],
      podDetailsStatus: [],
      namespaces: [],

    };
  },
  methods: {
    getPods() {
      //função para obter os pods
      axios
        .get(this.url + "/api/v1/namespaces/"+this.$store.state.namespace+"/pods")

        .then(response => {
          console.log(response.data);
          this.pods = response.data.items;

          var arrayLength = this.pods.length;
          for(var i = 0; i<arrayLength; i++){

            var date = this.pods[i].metadata.managedFields[0].time;
            var divideDiaHora = date.split("T");
            var dia = divideDiaHora[0].split("-");
            var divideHoraZ = divideDiaHora[1].split("Z");
            var horas = divideHoraZ[0].split(":");
            //var hour = res[1].split("Z")
            //console.log(res);

            //console.log(hour);

            var data = new Date(dia[0],dia[1]-1,dia[2],horas[0],horas[1],horas[2],0);

            var hoje = new Date().getTime();
            var segundosNamespace = data.getTime();

            var diferenca = hoje-data;
            diferenca = (diferenca / (1000*60*60)) - 1


            //vidaNamespace = vidaNamespace / 36000;
            this.pods[i].metadata.managedFields[0].time = diferenca.toFixed(1);
          }
        });
    },
    deletePod(pod){
      axios.delete(this.url + "/api/v1/namespaces/"+this.$store.state.namespace+"/pods/" + pod ).then(response=>{
        this.$toasted.success('Pod ' + pod + ' eliminated !');
        this.getPods();
      })
    },
    createPod() {
      axios
        .post(this.url + "/api/v1/namespaces/"+this.$store.state.namespace+"/pods", {
          kind: "Pod",
          apiVersion: "v1",
          metadata: {
            name: this.pod.name,
            namespace: this.$store.state.namespace,
            labels: {
              name:  "nginx4"
            }
          },
          spec: {
            containers: [
              {
                name: "nginx",
                image: "nginx",
                ports: [{ containerPort: 80 }],
                resources: {
                  limits: {
                    memory: "128Mi",
                    cpu: "500m"
                  }
                }
              }
            ]
          }
        })
        .then(response => {

          this.$toasted.show("Pod Created");
          this.getPods();
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
       this.getPods();
    },
    detail(pod) {
      this.podDetailsMetadata = pod.metadata;
      this.podDetailsSpec = pod.spec;
      this.podDetailsStatus = pod.status;

    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getPods();
    this.getNamespaces()
  }
};
</script>
