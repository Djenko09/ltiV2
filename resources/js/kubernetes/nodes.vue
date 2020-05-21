<template>
  <div>
    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white">List of Nodes</div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Ready</th>
              <th>Opertating System</th>
              <th>osImage</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody v-for="node in nodes">
            <tr>
              <td>{{node.metadata.name}}</td>
              <td>{{node.metadata.labels.app}}</td>
              <td> xd </td>
              <td>{{node.status.nodeInfo.operatingSystem}}</td>

              <td>{{node.status.nodeInfo.osImage}}</td>
              <td>{{node.metadata.managedFields[0].time}} Hours</td>
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
      nodes: [],
      nodes: {}
    };
  },
  methods: {
    getNodes() {
      //função para obter os nodes
      axios
        .get(this.url + "/api/v1/nodes")

        .then(response => {
          console.log(response.data);
          this.nodes = response.data.items;

          var arrayLength = this.nodes.length;
          for(var i = 0; i<arrayLength; i++){

            var date = this.nodes[i].metadata.managedFields[0].time;
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
            this.nodes[i].metadata.managedFields[0].time = diferenca.toFixed(1);
          }

        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getNodes();
  }
};
</script>
