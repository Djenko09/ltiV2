<template>
  <div>
    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white">List of Services</div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Labels</th>
              <th>Cluster IP</th>
              <th>Internal endpoints</th>
              <th>External endpoints</th>
              <th>Age</th>
            </tr>
          </thead>
          <tbody v-for="service in services">
            <tr>
              <td>{{service.metadata.name}}</td>
              <td>{{service.metadata.labels}}</td>
              <td>{{service.spec.clusterIP}}</td>
              <td v-if="service.spec.ports[0].nodePort">
                {{service.metadata.name}}: {{service.spec.ports[0].port}}\{{service.spec.ports[0].protocol}} |
                {{service.metadata.name}}: {{service.spec.ports[0].nodePort}}\{{service.spec.ports[0].protocol}}
              </td>

              <td
                v-if="!service.spec.ports[0].nodePort"
              >{{service.metadata.name}}: {{service.spec.ports[0].port}}\{{service.spec.ports[0].protocol}}</td>
            </tr>
          </tbody>
        </table>
        <!-- FIM tabela que lista os pods -->
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      services: [],
      service: {}
    };
  },
  methods: {
    getServices() {
      //função para obter os pods
      axios
        .get(this.url + "/api/v1/namespaces/default/services")

        .then(response => {
          console.log(response.data);
          this.services = response.data.items;
        });
    }
  },
  mounted() {
    //a pagina ao ser carregada executa as seguintes funcoes
    this.getServices();
  }
};
</script>
