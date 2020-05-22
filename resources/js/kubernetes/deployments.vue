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
            <h4 class="modal-title">Create Deployment from namespace: <b>{{this.$store.state.namespace}}</b></h4>
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
              <label for="label">Label</label>
              <input type="text" class="form-control" v-model="deployment.label">
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
            >Create Deployment <i class="fa fa-plus-circle"></i></button>
          </div>
        </div>
      </div>
      <div style="margin-top:10px" class="card">
        <div class="card-header bg-primary text-white">
          <div>
            Deployments list from namespace:
            <b class="text-dark">{{this.$store.state.namespace}}</b>
          </div>
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
                </td>
              </tr>
            </tbody>
          </table>
          <!-- FIM tabela que lista os deployments -->
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
        replicas: "",
        label:null,
      },
      namespaces: []
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
          namespace : this.$store.state.namespace,
          labels: {
            app:  this.deployment.label
          }
        },
        spec: {
          replicas: replica,
          selector: {
            matchLabels: {
              app:  this.deployment.name
            }

          },
          template: {
            metadata: {
              labels: {
                app: this.deployment.name
              }
            },
            spec: {
              containers: [
                {
                  name: this.deployment.name,
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
