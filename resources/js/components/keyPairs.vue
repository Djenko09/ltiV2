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
  <table class="table table-striped">

    <thead class="thead-dark">
      <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Public Key</th>
        <th>Fingerprint</th>
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
      <td>{{ keypairs.keypair.public_key}}</td>
      <td>{{ keypairs.keypair.fingerprint}}</td>
      <td>
        <button
        type="button"
        class="btn btn-sm btn-success"
        v-on:click="keyPairsDetail(keypairs)"
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
</template>

<script type="text/javascript">

import KeyPairsDetails from "./keyPairsDetail.vue";

export default {

  data: function(){
    return{
      url: process.env.MIX_URL,
      keypairs:[],
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
           console.log(keypairs);
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
    keyPairsDetail: function(keypairs) {
        this.$router.push("/keyPairsDetail");
        this.selectedkeyPairsDetail = keypairs;
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
    this.getProjects();
  }

}
</script>

<style lang="css" scoped>
</style>