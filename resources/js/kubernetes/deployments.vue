<template>
  <div>
    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white">List of Deployments</div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Pods</th>
              <th>Images</th>
            </tr>
          </thead>
          <tbody v-for="deployment in deployments">
            <tr>
              <td>{{deployment.metadata.name}}</td>
              <td>{{deployment.metadata.labels.app}}</td>
              <td>PERCEBERRRRRRR</td>
              <td>{{deployment.spec.template.spec.containers[0].image}}</td>
            </tr>
          </tbody>
        </table>
        <!-- FIM tabela que lista os deployments -->
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
      deployment: {}
    };
  },
  methods: {
    getDeployments() {
      //função para obter os deployments
      axios
        .get(this.url + "/apis/apps/v1/namespaces/default/deployments")

        .then(response => {
          console.log(response.data);
          this.deployments = response.data.items;
        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getDeployments();
  }
};
</script>
