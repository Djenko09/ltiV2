<template>
<div>
  <div>
    <h1>Key Pairs Details</h1>
  </div>
  <table class="table table-striped">

    <thead class="thead-dark">
      <tr>
        <th>Name</th>
        <th>ID</th>
        <th>Public Key</th>
        <th>Fingerprint</th>
        <th>User ID</th>
        <th>Created at</th>
      </tr>
    </thead>

    <tbody
    v-for="keypair in keypair"
    :key="keypair.id"
    >
    <tr>
      <td>{{ keypair.name }}</td>
      <td>{{ keypair.id }}</td>
      <td>{{ keypair.public_key }}</td>
      <td>{{ keypair.fingerprint }}</td>
      <td>{{ keypair.user_id }}</td>
      <td>{{ keypair.created_at }}</td>
    </tr>
  </tbody>
  </table>

</div>
</template>

<script>
export default {

  data: function(){
    return{
      url: process.env.MIX_URL,
      keypair:[],
      file:'',
    }
  },
  methods:{
    getKeyPairDetail: function(){
      axios.get(this.url + "/compute/v2.1/os-keypairs/Key_SSH",{
         headers: {'x-auth-token': this.$store.state.token}
       }).then(response=>{
           this.keypair = response.data.keypair;
           console.log(keypair);
         })
    },
    exit(){
      this.$emit('exit-images');
    }
  },
  mounted(){
    this.getKeyPairDetail();
    this.getProjects();
  }

}
</script>

<style lang="css" scoped>
</style>