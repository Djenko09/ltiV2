<template>
  <div>
  <br>
  <h3>Server Groups</h3>
  <div >
    <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModal">Create Security Group</button>
  </div>
  <!-- The Modal For Create Security Group -->
  <div class="modal" id="myModal">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Create Security Group</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>

        <!-- Modal body -->
        <div class="modal-body">
          <div class="form-group">
            <label for="nameServerGroup">Name *</label>
            <input type="text" class="form-control"  placeholder="A name for the server Group" name="name" v-model="serversGroup.name"></input>
          </div>
          <div class="form-group">
            <label for="policy">Policy</label>
             <select class="form-control text-capitalize" v-model="serversGroup.policy">
              <option v-model="serversGroup.policy">anti-affinity</option>
              <option v-model="serversGroup.policy">affinity</option>
              <option v-model="serversGroup.policy">soft-anti-affinity </option>
              <option v-model="serversGroup.policy">soft-affinity </option>
            </select>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="createServerGroup()" >Create</button>
        </div>

      </div>
    </div>
  </div>
  <br>
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
  </table>
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
    getServerGroups(){
      axios.get(this.url +"/compute/v2.1/os-server-groups",{
        headers: {'x-auth-token': this.$store.state.token}
      }).then(response=>{
        this.servers= response.data.server_groups;
        console.log(this.servers)
      })
    },
    deleteServerGroup(serverGroup){
      axios.delete(this.url + "/compute/v2.1/os-server-groups/"+ serverGroup.id,{
        headers: {'x-auth-token': this.$store.state.token}
      }).then(response=>{
         this.$toasted.error("Server Group "+ serverGroup.name +" deleted with success!");
         this.getServerGroups();
      })
    },
    createServerGroup(){
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
      })
    }
  },
  mounted(){
    this.getServerGroups();
  }

}


</script>

<style lang="css" scoped>
</style>
