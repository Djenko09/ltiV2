<template>
<div>
  <div>
    <h1>Key Pairs</h1>
  </div>
  <br>
  <div>
      <button type="submit" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModalCreateKeyPairs">Create Key Pair</button>
  </div>
  <br>

  <!-- Detalhes das Key Pairs -->
  <div class="modal" id="myModalKeyPairsDetail">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Key Pair Detail</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
            <div class="container">
                <label for="nameKeyPair">Name:</label>
                <div for="nameKeyPair" class="form-control">{{keypairAMostar.name}}</div>
            </div>
            <br>
            <div class="container">
                <label for="idKeyPair">ID:</label>
                <div for="idKeyPair" class="form-control">{{keypairAMostar.id}}</div>
            </div>
            <br>
            <div class="container">
                <label for="public_keyKeyPair">Public Key:</label>
                <a for="public_keyKeyPair" class="text-break form-control">{{keypairAMostar.public_key}}</a>
            </div>
            <br>
            <div class="container">
                <label for="fingerprintKeyPair">Fingerprint:</label>
                <div for="fingerprintKeyPair" class="form-control">{{keypairAMostar.fingerprint}}</div>
            </div>
            <br>
            <div class="container">
                <label for="user_idKeyPair">User ID:</label>
                <div for="user_idKeyPair" class="form-control">{{keypairAMostar.user_id}}</div>
            </div>
            <br>
            <div class="container">
                <label for="created_atKeyPair">Created At:</label>
                <div for="created_atKeyPair" class="form-control">{{keypairAMostar.created_at | formatDate}}</div>
            </div>
        </div>
        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-dismiss="modal" >Close</button>
        </div>
      </div>
    </div>
  </div>
  <!-- FIM - Detalhes das Key Pairs -->

  <!-- Criar Key Pairs -->
  <div class="modal" id="myModalCreateKeyPairs">
    <div class="modal-dialog">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Create Key Pair</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div>
        <!-- Modal body -->
        <div class="modal-body">
            <div class="container">
                <label for="nameKeyPair">Name:</label>
                <input type="text" class="form-control" v-model="newKeypair.name" id="name" />
            </div>
            <br>

            <div class="form-group container">
                <label for="keyPairType">Type:</label>
                  <select class="form-control text-capitalize" v-model="newKeypair.type">
                    <option value="ssh">SSH Key</option>
                    <option value="x509">X509 Certificate</option>
                  </select>
              </div>
        </div>
        <!-- Modal footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="createKeyPair()">Create Key Pair</button>
        </div>
      </div>
    </div>
  </div>
  <!-- FIM - Criar Key Pairs -->

  <div class="container-fluid">
  <table class="table table-hover">

    <thead>
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Options</th>
      </tr>
    </thead>

    <tbody
    v-for="keypairs in keypairs"
    :key="keypairs.id"
    >
    <tr>
      <td>{{ keypairs.keypair.name }}</td>
      <td>{{ keypairs.keypair.type }}</td>
      <td>
        <button
        type="button"
        class="btn btn-sm btn-success"
        data-toggle="modal" data-target="#myModalKeyPairsDetail"
        v-on:click="keyPairsDetail(keypairs.keypair)"
        >Details</button>
        <button
        type="button"
        class="btn btn-sm btn-danger"
        v-on:click="keyPairsDelete(keypairs.keypair)"
        >Delete Key Pair</button>
      </td>
    </tr>
  </tbody>
  </table>
  </div>

</div>
</template>

<script type="text/javascript">


export default {

  data: function(){
    return{
      url: process.env.MIX_URL,
      keypairs:[],
      newKeypair: {
        name: "",
        type: ""
      },
      keypairAMostar:[],
      file:'',
    }
  },
  methods:{
    getKeyPairs: function(){
      axios.get(this.url + "/compute/v2.1/os-keypairs",{
         headers: {
             'x-auth-token': this.$store.state.token,
             'x-openstack-nova-api-version': '2.2'
             }
       }).then(response=>{
           this.keypairs = response.data.keypairs;
           console.log(this.keypairs);
         })
    },
    createKeyPair(){
      axios.post(
           this.url + "/compute/v2.1/os-keypairs",
           {
             keypair: {
              name: this.newKeypair.name,
              type: this.newKeypair.type
             }
           },
           {
             headers: {
               "Content-Type": "application/json",
               "x-auth-token": this.$store.state.token,
               "x-openstack-nova-api-version": "2.2"
             }
           }
         )
         .then(response => {
           console.log(response);
           this.$router.push("/keypairs");
           this.getKeyPairs();
           this.$toasted.show("Key Pair Created");
         }).catch(error=>{
        console.log('Error');
      });
    },  
    keyPairsDetail: function(keypair) {
      axios.get(this.url + "/compute/v2.1/os-keypairs/" + keypair.name,{
         headers: {
             'x-auth-token': this.$store.state.token,
             'x-openstack-nova-api-version': '2.2'
             }
       }).then(response=>{
           this.keypairAMostar = response.data.keypair;
         }).catch(error=>{
        console.log('Error');
      });
    },
    keyPairsDelete: function(keypair) {
      axios.delete(this.url + "/compute/v2.1/os-keypairs/" + keypair.name,{
         headers: {
             'x-auth-token': this.$store.state.token
             }
       }).then(response=>{
           this.$router.push("/keypairs");
           this.getKeyPairs();
           this.$toasted.show("Key Pair Deleted");
         }).catch(error=>{
        console.log('Error');
      });
    },
    exit(){
      this.$emit('exit-images');
    }
  },
  components: {

  },
  mounted(){
    this.getKeyPairs();
  }

}
</script>

<style lang="css" scoped>
</style>
