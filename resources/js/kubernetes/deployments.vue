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
              <th>Age</th>
            </tr>
          </thead>
          <tbody v-for="deployment in deployments">
            <tr>
              <td>{{deployment.metadata.name}}</td>
              <td>{{deployment.metadata.labels.app}}</td>
              <td>PERCEBERRRRRRR</td>
              <td>{{deployment.spec.template.spec.containers[0].image}}</td>
              <td>{{deployment.metadata.managedFields[0].time}}</td>
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

          var arrayLength = this.deployments.length;
          for(var i = 0; i<arrayLength; i++){

            var date = this.deployments[i].metadata.managedFields[0].time;
            var divideDiaHora = date.split("T");
            var dia = divideDiaHora[0].split("-");
            var divideHoraZ = divideDiaHora[1].split("Z");
            var horas = divideHoraZ[0].split(":");
            //var hour = res[1].split("Z")
            //console.log(res);

            //console.log(hour);

            var data = new Date(dia[0],dia[1]-1,dia[2],horas[0],horas[1],horas[2],0);

            var hoje = new Date().getTime();

            var diferenca = hoje-data;
            diferenca = (diferenca / (1000*60*60)) - 1


            //vidaNamespace = vidaNamespace / 36000;
            this.deployments[i].metadata.managedFields[0].time = diferenca.toFixed(1);
          }
        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getDeployments();
  }
};
</script>
