<template>
  <div>
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
      pod: {}
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
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getPods();
  }
};
</script>
