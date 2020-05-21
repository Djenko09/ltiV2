<template>
  <div>
    <br>
    <div>
      <h1>Services</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalDeployment"
      >Create Service</button>
    </div>
    <br />
    <!-- Fomulario para criar volume -->
    <div class="modal" id="myModalDeployment">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Service</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" class="form-control" v-model="service.name" id="name" />
            </div>

            <div class="form-group">
              <label for="size">Size (GB)*</label>
              <input type="text" class="form-control" v-model="service" id="size" />
            </div>

           
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

       <!-- FIM Fomulario para criar volume -->
    </div>

     <!--tabela que lista os volumes -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Labels</th>
          <th>Cluster IP</th>
          <th>Internal endpoints</th>
          <th>External endpoints</th>
          <th>Age</th>
         
         
          
        </tr>
      </thead>
      <tbody v-for="service in services" >
        <tr>
          <td>{{service.metadata.name}}</td>
          <td > {{service.metadata.labels}} </td>
          <td>{{service.spec.clusterIP}} </td>
          <td v-if="service.spec.ports[0].nodePort">{{service.metadata.name}}: {{service.spec.ports[0].port}}\{{service.spec.ports[0].protocol}} |   
                {{service.metadata.name}}: {{service.spec.ports[0].nodePort}}\{{service.spec.ports[0].protocol}}</td>
          
         <td v-if="!service.spec.ports[0].nodePort"> {{service.metadata.name}}: {{service.spec.ports[0].port}}\{{service.spec.ports[0].protocol}}  </td>
          
         
          
          
        </tr>
      </tbody>
    </table>  <!-- FIM tabela que lista os pods -->

  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      services: [],
      service: {
      
      },
    
    };
  },
  methods: {
    getServices() {   //função para obter os pods
      axios
        .get(
        this.url+"/api/v1/namespaces/default/services")

        .then(response => {
         console.log(response.data);
          this.services = response.data.items;
        
        });
    },
 
  },
  mounted() { //a pagina ao ser carregada executa as seguintes funcoes
    this.getServices();
    
  }
};
</script>
