<template>
  <div>
  <br>
  <h1>Server Groups</h1>
  <br>
  <div >
    <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModal">Create Server Group</button>
  </div>
    <!-- formulario para criar server group-->
  <div class="modal" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Create Server Group</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="form-group">
            <label for="nameServerGroup">Name *</label>
            <input type="text" class="form-control"  placeholder="A name for the server Group" name="name" v-model="serversGroup.name"/>
          </div>
          <div class="form-group">
            <label for="policy">Policy *</label>
             <select class="form-control text-capitalize" v-model="serversGroup.policy">
              <option>anti-affinity</option>
              <option >affinity</option>
              <option>soft-anti-affinity </option>
              <option>soft-affinity </option>
            </select>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" :class="{ disabled: isDisabled }" :disabled="isDisabled" data-dismiss="modal" v-on:click="createServerGroup()" >Create</button>
        </div>

      </div>
    </div>
  </div>
  <!-- FIM formulario para criar server group-->
  <br>

   <!--  tabela que lista os server groups -->
  <table class="table table-hover">

    <thead>
      <tr>
        <th>Name</th>
        <th>Id</th>
        <th>Policy</th>
        <th>Rules</th>
        <th> Options </th>
      </tr>
    </thead>

    <tbody
    v-for="serverGroup in servers"
    :key="serverGroup.id"
    >
    <tr>
      <td>{{serverGroup.name}}</td>
      <td>{{serverGroup.id}}</td>
      <td>{{serverGroup.policy}}</td>
      <td>{{serverGroup.rules}}</td>
      <td>
       <button type="button" class="btn btn-sm btn-danger" v-on:click="deleteServerGroup(serverGroup)">Delete Server Group</button>
      </td>
    </tr>
    </tbody>
  </table>   <!-- FIM tabela que lista os server groups -->
</div>

</template>

<script>
export default {

  data: function(){
    return{
      servers:[],
      url: process.env.MIX_URL,
      serversGroup:{
        name:null,
        policy:null
      }
  }
},
  methods:{
    getServerGroups(){   //funcão que obtem os server groups
      axios.get(this.url +"/compute/v2.1/os-server-groups",{
        headers: {'x-auth-token': this.$store.state.token}
      }).then(response=>{
        this.servers= response.data.server_groups;
      })
    },
    deleteServerGroup(serverGroup){  //eliminar server group
      axios.delete(this.url + "/compute/v2.1/os-server-groups/"+ serverGroup.id,{
        headers: {'x-auth-token': this.$store.state.token}
      }).then(response=>{
         this.$toasted.error("Server Group "+ serverGroup.name +" deleted with success!");
         this.getServerGroups();
      }).catch(error =>{
        this.$toasted.error("Server Group not deleted! An error Ocurred");
      });
    },
    createServerGroup(){ //funcao que cria server group
      axios.post(this.url + "/compute/v2.1/os-server-groups",
        {
          server_group:{
            name: this.serversGroup.name,
            policies: [this.serversGroup.policy]
          }
        },
        {
          headers : {'x-auth-token': this.$store.state.token}
      }).then(response =>{
        this.$toasted.success("Server Group created with success!");
        this.getServerGroups();
      }).catch(error =>{
        this.$toasted.error("Server Group not created! An error Ocurred");
      });
    }
  },
  computed:{
    isDisabled () {
      if (this.serversGroup.name && this.serversGroup.policy) {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted(){ //a pagina ao ser carregada executa as seguintes funcoes
    this.getServerGroups();
  }

}


</script>

<style lang="css" scoped>
</style>
