<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
        <li style="color:#fff;margin-top:8px;margin-right:5px;">
          <i class="fa fa-cubes" aria-hidden="true"></i>
          {{this.$store.state.namespace}}
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
            Exit
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="container-fluid">
    <div style="margin-top:10px" class="card">
        <div class="card-header bg-primary text-white">
          <div>Services list</div>
      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Manager</th>
            </tr>
          </thead>
          <tbody v-for="role in clusterRoles">
            <tr>
              <td>{{role.metadata.name}}</td>
              <td>{{role.metadata.managedFields[0].manager}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data:function(){
    return{
      url:process.env.MIX_URL,
      clusterRoles:[],

    }
  },
  methods:{
    getClusterRoles(){
      axios.get(this.url + "/apis/rbac.authorization.k8s.io/v1/clusterroles").then(response=>{
        this.clusterRoles = response.data.items;
      })
    },
  },
  mounted(){
    this.getClusterRoles();
  }
}
</script>

<style lang="css" scoped>
</style>
