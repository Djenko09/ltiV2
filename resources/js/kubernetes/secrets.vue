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
    <div style="margin-top:50px" class="card shadow">
       <div class="card-header bg-primary text-white">
          <div>Secrets List</div>
      </div>
      <div class="card-body">
        <table v-if="secrets.length" class="table table-hover shadow">
          <thead class="thead-dark">
            <tr>
              <th>Name</th>
              <th>Namespace</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-for="secret in secrets">
            <tr>
              <td>{{secret.metadata.name}}</td>
              <td>{{secret.metadata.namespace}}</td>
              <td>
                <button type="button" name="button" data-toggle="modal" data-target="#myModalDetail" v-on:click="details(secret)"class="btn btn-secondary"><i class="fa fa-info-circle" aria-hidden="true"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-else class="jumbotron shadow">
          <h2 class="text-center">Nothing to show. Namespace {{this.$store.state.namespace}} has no secrets</h2>
        </div>
        <div class="modal" id="myModalDetail" role="dialog">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <!-- Modal Header -->
              <div class="modal-header">
                <h4 class="modal-title">Secret {{this.secretDetailsMetadata.name}}</h4>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
              </div>
              <div class="modal-body">

                <div class="container">
                  <label for="nameKeyPair">Id:</label>
                  <div for="nameKeyPair" class="form-control">{{this.secretDetailsMetadata.uid}}</div>
                </div>

                <div style="margin-top:25px" class="container">
                  <label for="nameKeyPair">Token:</label>
                  <div for="nameKeyPair" class="form-control">{{this.secretDetailsData.token}}</div>
                </div>

                <div style="margin-top:25px" class="container">
                  <label for="nameKeyPair">Ca.crt: </label>
                  <div for="nameKeyPair" class="form-control">{{this.secretDetailsData["ca.crt"]}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- FIM tabela que lista os deployments -->
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
      namespaces:[],
      secrets:[],
      secretDetailsMetadata:[],
      secretDetailsData:[]
    }
  },
  methods:{

  getSecrets(){
    axios.get(this.url + '/api/v1/namespaces/'+ this.$store.state.namespace + '/secrets').then(response=>{
      this.secrets = response.data.items;

    })
  },
  details(secret){
    this.secretDetailsMetadata = secret.metadata;
    this.secretDetailsData = secret.data;
  },

  getNamespaces() {
    axios.get(this.url + "/api/v1/namespaces").then(response => {
      this.namespaces = response.data.items;
    });
  },
  changeNameSpace(namespace){
     this.$store.commit("setNameSpace", namespace);
     this.$toasted.info('Changed to namespace: '+ namespace);
     this.getSecrets();
  },
  },
  mounted(){
    this.getNamespaces();
    this.getSecrets();
  }
}
</script>

<style lang="css" scoped>
</style>
