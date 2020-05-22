<template>
  <div>
    <div>
      <button
        style="margin-top:50px;margin-left:10px"
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalPod"
      >Create Deployment</button>
    </div>
    <div class="modal" id="myModalPod">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Deployment for namespace: <b>{{this.$store.state.namespace}}</b></h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name</label>
              <input
                type="text"
                class="form-control"
                v-model="deployment.name"
                id="name"
                placeholder="Insert name "
              />
            </div>

            <div class="form-group">
              <label for="image">Image</label>
              <input
                type="text"
                class="form-control"
                v-model="deployment.image"
                id="image"
                placeholder="Insert image "
              />
            </div>

            <div class="form-group">
              <label for="replicas">replicas</label>
              <input
                type="number"
                class="form-control"
                v-model="deployment.replicas"
                id="replicas"
                placeholder="Insert name "
              />
            </div>

            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal"
                v-on:click="createDeployment()"
              >Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white">
        <div>
          Deployments List of namespace:
          <b class="text-dark">{{this.$store.state.namespace}}</b>
        </div>
        <a class="text-dark">Change Namespace</a>
        <select>
          <option
            v-for="namespace in namespaces"
            :value="namespace.metadata.name"
            v-on:click="changeNameSpace(namespace.metadata.name)"
          >{{namespace.metadata.name}}</option>
        </select>
      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Pods</th>
              <th>Images</th>
              <th>Age</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody v-for="deployment in deployments" :key="deployment.metadata.name">
            <tr>
              <td>{{deployment.metadata.name}}</td>
              <td>{{deployment.metadata.labels.app}}</td>
              <td v-if="!deployment.status.readyReplicas">0/{{deployment.status.replicas}}</td>
              <td
                v-if="deployment.status.readyReplicas"
              >{{deployment.status.readyReplicas}}/{{deployment.status.replicas}}</td>
              <td>{{deployment.spec.template.spec.containers[0].image}}</td>
              <td>{{deployment.metadata.managedFields[0].time}} Hours</td>
              <td>
                <button
                  type="button"
                  name="button"
                  class="btn btn-danger"
                  v-on:click="deleteDeployment(deployment.metadata.name)"
                >Delete</button>
                <button
                  type="button"
                  name="button"
                  class="btn btn-primary"
                  v-on:click="editDeployment(deployment.metadata.name)"
                >Edit</button>
                   <button type="button" name="button" class="btn btn-secondary" data-toggle="modal"
        data-target="#myModalDetail" v-on:click="detail(deployment)">Details</button>
              </td
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
            <h4 class="modal-title">Details </h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>
           <div class="modal-body">
            <b>Name:</b>  {{this.deploymentDetailsMetadata.name}}<br>
            <b>uid:</b>  {{this.deploymentDetailsMetadata.uid}}<br>
           
           

            
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
      deployments: [],
      deployment: {
        image: "",
        name: "",
        replicas: ""
      },
      namespaces: [],

      //detail
      deploymentDetailsMetadata: [],
      deploymentDetailsSpec: [],
      deploymentDetailsStatus:[]
    };
  },
  methods: {
    getDeployments() {
      //função para obter os deployments
      axios
        .get(
          this.url +
            "/apis/apps/v1/namespaces/" +
            this.$store.state.namespace +
            "/deployments"
        )

        .then(response => {
          console.log(response.data);
          this.deployments = response.data.items;

          var arrayLength = this.deployments.length;
          for (var i = 0; i < arrayLength; i++) {
            var date = this.deployments[i].metadata.managedFields[0].time;
            var divideDiaHora = date.split("T");
            var dia = divideDiaHora[0].split("-");
            var divideHoraZ = divideDiaHora[1].split("Z");
            var horas = divideHoraZ[0].split(":");
            //var hour = res[1].split("Z")
            //console.log(res);

            //console.log(hour);

            var data = new Date(
              dia[0],
              dia[1] - 1,
              dia[2],
              horas[0],
              horas[1],
              horas[2],
              0
            );

            var hoje = new Date().getTime();

            var diferenca = hoje - data;
            diferenca = diferenca / (1000 * 60 * 60) - 1;

            //vidaNamespace = vidaNamespace / 36000;
            this.deployments[
              i
            ].metadata.managedFields[0].time = diferenca.toFixed(1);
          }
        });
    },
    createDeployment() {
      var replica = this.deployment.replicas >>> 0;
      axios
        .post(this.url + "/apis/apps/v1/namespaces/"+this.$store.state.namespace+"/deployments", {
          kind: "Deployment",
          apiVersion: "apps/v1",
          metadata: {
            name: this.deployment.name,
            labels: {
              app: "nginx"
            }

          },
          spec: {
            replicas: replica,
            selector: {
              matchLabels: {
                app: "nginx"
              }
            },
            managedFields: [
              {
                manager: "kubectl",
                image: this.deployment.image,
                ports: [
                  {
                    containerPort: 80
                  }
                ],
                resources: {
                  limits: {
                    memory: "128Mi",
                    cpu: "500m"
                  }
                }
              }
            ],
            spec: {
              replicas: replica,
              selector: {
                matchLabels: {
                  app: "nginx"
                }
              },
              spec: {
                containers: [
                  {
                    name: "ngnix",
                    image: this.deployment.image,
                    resources: {}
                  }
                ]
              }
            }
          }
        })
        .then(response => {
          console.log(response.data);
          this.$toasted.show("Deployment Created");
          this.getDeployments();
        });
    },
    deleteDeployment(deployment) {
      axios
        .delete(
          this.url +
            "/apis/apps/v1/namespaces/default/deployments/" +
            deployment
        )
        .then(response => {
          console.log(response.data);
          this.getDeployments();
          this.$toasted.success("Deployment " + deployment + " eliminated !");
        });
    },
    getNamespaces() {
      axios.get(this.url + "/api/v1/namespaces").then(response => {
        this.namespaces = response.data.items;
      });
    },
    changeNameSpace(namespace) {
      this.$store.commit("setNameSpace", namespace);
      this.getDeployments();
    },
    detail(deployment) {
      this.deploymentDetailsMetadata = deployment.metadata;
       this.deploymentDetailsSpec = deployment.spec;
       this.deploymentDetailsStatus = deployment.status;

    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    console.log(this.$store.state);
    this.getDeployments();
    this.getNamespaces();
  }
};
</script>
