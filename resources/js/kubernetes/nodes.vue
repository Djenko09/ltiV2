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
            </tr>
          </thead>
          <tbody v-for="node in nodes">
            <tr>
              <td>{{node.metadata.name}}</td>
              <td>{{node.metadata.labels.app}}</td>
              <td> xd </td>
              <td>{{node.status.nodeInfo.operatingSystem}}</td>
              
              <td>{{node.status.nodeInfo.osImage}}</td>
              
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
        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getNodes();
  }
};
</script>
