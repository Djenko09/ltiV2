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
              <th>Age</th>
            </tr>
          </thead>
          <tbody v-for="pod in pods">
            <tr>
              <td>{{pod.metadata.name}}</td>
              <td>{{pod.spec.nodeName}}</td>
              <td>{{pod.status.phase}}</td>
              <td v-for="res in pod.status.containerStatuses">{{res.restartCount}}</td>
              <td>{{pod.metadata.managedFields[0].time}}</td>
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
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getPods();
  }
};
</script>
