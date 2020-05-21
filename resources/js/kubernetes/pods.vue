<template>
  <div>
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalContainers"
      >Create Pod</button>
    </div>
    <div class="modal" id="myModalContainers">
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
            </tr>
          </thead>
          <tbody v-for="pod in pods">
            <tr>
              <td>{{pod.metadata.name}}</td>
              <td>{{pod.spec.nodeName}}</td>
              <td>{{pod.status.phase}}</td>
              <td v-for="res in pod.status.containerStatuses">{{res.restartCount}}</td>
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
        });
    },
    createPod() {
      axios
        .post(this.url + "/api/v1/namespaces/default/pods", {
          kind: "Pod",
          apiVersion: "v1",
          metadata: {
            name: this.pod.name,
            namespace: this.pod.name,
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
