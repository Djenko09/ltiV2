<template>
  <div>
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalPod"
      >Create Pod</button>
    </div>
    <div class="modal" id="myModalPod">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Pods</h4>
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




            <!-- Modal footer -->
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
    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white">List of Pods</div>

      <div class="card-body">
        <table class="table table-hover">
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
              <td>{{pod.spec.nodeName}}</td>
              <td>{{pod.status.phase}}</td>
              <td v-for="res in pod.status.containerStatuses">{{res.restartCount}}</td>
              <td>{{pod.metadata.managedFields[0].time}} Hours</td>
              <td>
                <button type="button" name="button" class="btn btn-danger" v-on:click="deletePod(pod.metadata.name)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
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

      }
    };
  },
  methods: {
    getPods() {
      //função para obter os pods
      axios
        .get(this.url + "/api/v1/namespaces/default/pods")

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
      axios.delete(this.url + "/api/v1/namespaces/default/pods/" + pod ).then(response=>{
        this.$toasted.success('Pod ' + pod + ' eliminated !');
        this.getPods();
      })
    },
    createPod() {
      axios
        .post(this.url + "/api/v1/namespaces/default/pods", {
          kind: "Pod",
          apiVersion: "v1",
          metadata: {
            name: this.pod.name,
            namespace: "default",
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
          console.log(response.data);
          this.$toasted.show("Pod Created");
          this.getPods();
        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getPods();
  }
};
</script>
