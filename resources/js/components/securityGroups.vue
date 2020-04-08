<template>
<div>
  <div><br>
    <h1>Security Groups</h1>
  </div><br>
  <table class="table table-hover">

    <thead>
      <tr>
        <th>Name</th>
        <th>Security Group ID</th>
        <th>Description</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody
    v-for="securityGroup in securityGroups"
    :key="securityGroup.tenant_id"
    >
    <tr>
      <td>{{ securityGroup.name }}</td>
      <td>{{ securityGroup.id }}</td>
      <td>{{ securityGroup.description}}</td>
      <td>
        <button
        type="button"
        class="btn btn-sm btn-outline-dark"
        v-on:click="deleteImage(image.id)"
        >Manage Rules</button>
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
    url:process.env.MIX_URL,
    securityGroups:[],
  }
},
methods:{
  getSecurityGroups(){
    axios.get(this.url +":9696/v2.0/security-groups",{
      headers: {"x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.securityGroups = response.data.security_groups;
    })
  }
},
mounted(){
  this.getSecurityGroups();
}

}

</script>

<style lang="css" scoped>
</style>
