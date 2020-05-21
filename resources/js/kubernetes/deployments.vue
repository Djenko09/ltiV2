<template>
  <div>
    <br>
    <div>
      <h1>Deployments</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalDeployment"
      >Create Deployment</button>
    </div>
    <br />
    <!-- Fomulario para criar volume -->
    <div class="modal" id="myModalDeployment">
      <div class="modal-dialog">
        <div class="modal-content">
          <!-- Modal Header -->
          <div class="modal-header">
            <h4 class="modal-title">Create Deployments</h4>
            <button type="button" class="close" data-dismiss="modal">&times;</button>
          </div>

          <!-- Modal body -->
          <div class="modal-body">
            <div class="form-group">
              <label for="name">Name *</label>
              <input type="text" class="form-control" v-model="deployment.name" id="name" />
            </div>

            <div class="form-group">
              <label for="size">Size (GB)*</label>
              <input type="text" class="form-control" v-model="deployment" id="size" />
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

     <!--tabela que lista os deployments -->
    <table class="table table-hover">
      <thead>
        <tr>
          <th>Name</th>
          <th>Labels</th>
          <th>Pods</th>
          <th>Images</th>
         
          
        </tr>
      </thead>
      <tbody v-for="deployment in deployments" >
        <tr>
          <td>{{deployment.metadata.name}}</td>
          <td > {{deployment.metadata.labels.app}} </td>
          <td>PERCEBERRRRRRR </td>
          <td >{{deployment.spec.template.spec.containers[0].image}}</td>
          
          
        </tr>
      </tbody>
    </table>  <!-- FIM tabela que lista os deployments -->

  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      deployments: [],
      deployment: {
      
      },
    
    };
  },
  methods: {
    getDeployments() {   //função para obter os deployments
      axios
        .get(
        this.url+"/apis/apps/v1/namespaces/default/deployments")

        .then(response => {
         console.log(response.data);
          this.deployments = response.data.items;
        });
    },
 
  },
  mounted() { //a pagina ao ser carregada executa as seguintes funcoes
    this.getDeployments();
    
  }
};
</script>
