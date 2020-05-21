<template>
  <div>
    <br>
    <div>
      <h1>Pods</h1>
    </div>
    <br />
    <div>
      <button
        type="submit"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target="#myModalPod"
      >Create Pod</button>
    </div>
    <br />
    <!-- Fomulario para criar volume -->
    <div class="modal" id="myModalPod">
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
              <label for="name">Name *</label>
              <input type="text" class="form-control" v-model="pod.name" id="name" />
            </div>

            <div class="form-group">
              <label for="size">Size (GB)*</label>
              <input type="text" class="form-control" v-model="pod" id="size" />
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
          <th>Node</th>
          <th>Status</th>
          <th>Restarts</th>
         
          
        </tr>
      </thead>
      <tbody v-for="pod in pods" >
        <tr>
          <td>{{pod.metadata.name}}</td>
          <td> {{pod.spec.nodeName}} </td>
          <td>{{pod.status.phase}}</td>
          <td v-for="res in pod.status.containerStatuses">{{res.restartCount}}</td>
          <td> </td>
           <td> </td>
          <td> </td>
          
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
      pods: [],
      pod: {
      
      },
    
    };
  },
  methods: {
    getPods() {   //função para obter os pods
      axios
        .get(
        this.url+"/api/v1/namespaces/default/pods")

        .then(response => {
         console.log(response.data);
          this.pods = response.data.items;
        });
    },
 
  },
  mounted() { //a pagina ao ser carregada executa as seguintes funcoes
    this.getPods();
    
  }
};
</script>
