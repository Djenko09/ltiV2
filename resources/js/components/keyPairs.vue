<template>
<div>
  <div>
    <h1>Key Pairs</h1>
  </div>
  <div class="form-group">
    <label>Key Pairs
    <input type="file" class="form-control" id="file" ref="file" v-on:change="handleFileUpload()" placeholder="Upload Image" >
    </label>
    <button v-on:click="createKeyPair()">Create Key Pair</button>
  </div>
  <div class="modal" id="myModals">
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

            <div class="container">
                <label for="idKeyPair">ID:</label>
                <div for="idKeyPair" class="form-control">{{keypairAMostar.id}}</div>
            </div>

            <div class="container">
                <label for="public_keyKeyPair">Public Key:</label>
                <a for="public_keyKeyPair" class="text-break form-control">{{keypairAMostar.public_key}}</a>
            </div>

            <div class="container">
                <label for="fingerprintKeyPair">Fingerprint:</label>
                <div for="fingerprintKeyPair" class="form-control">{{keypairAMostar.fingerprint}}</div>
            </div>

            <div class="container">
                <label for="user_idKeyPair">User ID:</label>
                <div for="user_idKeyPair" class="form-control">{{keypairAMostar.user_id}}</div>
            </div>

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
        data-toggle="modal" data-target="#myModals"
        v-on:click="keyPairsDetail(keypairs.keypair)"
        >Details</button>
        <button
        type="button"
        class="btn btn-sm btn-danger"
        >Delete Key Pair</button>
      </td>
    </tr>
    <detailKeyPairs
            :keypairs="selectedkeyPairsDetail"
            @edit-canceled="cancelkeyPairsDetail"
            v-if="selectedkeyPairsDetail && selectedkeyPairsDetail === keypairs"
          ></detailKeyPairs>
  </tbody>
  </table>
  </div>

</div>
</template>

<script type="text/javascript">

import KeyPairsDetails from "./keyPairsDetail.vue";

export default {

  data: function(){
    return{
      url: process.env.MIX_URL,
      keypairs:[],
      keypairAMostar:[],
      file:'',
      selectedkeyPairsDetail: null,
      
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
      let formData = new FormData();
      formData.append('file',this.file);
      axios.post(this.url + "/image/v2/images",
      {
        container_format:"bare",
        disk_format:"raw",
        name:"xp",
        id:"b2173dd3-7ad6-4362-baa6-a68bce3567cb"
      },{
        headers : {"x-auth-token": this.$store.state.token}
      }).then(response=>{
        console.log('Success');
      }).catch(error=>{
        console.log('Error');
      })
    },
    keyPairsDetail: function(keypair) {
      axios.get(this.url + "/compute/v2.1/os-keypairs/" + keypair.name,{
         headers: {
             'x-auth-token': this.$store.state.token,
             'x-openstack-nova-api-version': '2.2'
             }
       }).then(response=>{
           this.keypairAMostar = response.data.keypair;
         })
    },
    exit(){
      this.$emit('exit-images');
    }
  },
  components: {
    detailKeyPairs: KeyPairsDetails

  },
  mounted(){
    this.getKeyPairs();
  }

}
</script>

<style lang="css" scoped>
</style>
