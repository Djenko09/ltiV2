<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <div class="col-auto mr-auto">
          <div style="margin-top:10px;margin-left:5px;"class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text" for="inputGroupSelect01"><i class="fa fa-cubes" aria-hidden="true"></i></label>
            </div>
            <select class="custom-select" id="inputGroupSelect01">
              <option selected>Select Namespace</option>
              <option v-for="namespace in namespaces" :value="namespace.metadata.name" v-on:click="changeNameSpace(namespace.metadata.name)">{{namespace.metadata.name}}</option>
            </select>
          </div>
      </div>
      <ul class="navbar-nav ml-auto mt-2 mt-lg-0">
        <li style="color:#fff;margin-top:8px;margin-right:5px;">
          <i class="fa fa-cubes" aria-hidden="true"></i> {{this.$store.state.namespace}}
        </li>
        <li class="nav-item active">
          <router-link class="nav-link" to="/"><i class="fa fa-sign-out" aria-hidden="true"></i>
            Exit</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="container-fluid">
    <div style="margin-top:50px" class="card">
      <div class="row">
        <div class="col-md-4">
          <button
            style="margin-top:10px;margin-left:10px;margin-bottom:10px"
            type="submit"
            class="btn btn-outline-dark"
            data-toggle="modal"
            data-target="#myModalService"
          >Create Endpoint <i class="fa fa-plus-circle"></i></button>
        </div>
      </div>
    </div>
    <div style="margin-top:10px" class="card">
        <div class="card-header bg-primary text-white">
          <div>Endpoints available</div>
      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Namespace</th>
              <th>Domain</th>
            </tr>
          </thead>
          <tbody v-for="endpoint in endpoints">
            <tr>
              <td>{{endpoint.metadata.name}}</td>
              <td>{{endpoint.metadata.namespace}}</td>
              <td>{{endpoint.metadata.selfLink}}</td>
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
      url: process.env.MIX_URL,
      endpoints:[],
      namespaces: [],

    }
  },
  methods:{
    getEndpoints(){
      axios.get(this.url + "/api/v1/endpoints").then(response=>{
        this.endpoints = response.data.items;
        console.log(this.endpoints);
      })
    },
    getNamespaces() {
    axios.get(this.url + "/api/v1/namespaces").then(response => {
      this.namespaces = response.data.items;
    });
  },
  changeNameSpace(namespace){
     this.$store.commit("setNameSpace", namespace);
     this.getServices();
  },
  },
  mounted(){
    this.getNamespaces();
    this.getEndpoints();
  }
}
</script>

<style lang="css" scoped>
</style>
