<template>
<div>
  <div>
    <h3>
      <b>Flavors</b>
    </h3>
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Vcpus</th>
            <th>Ram</th>
            <th>Total Disk</th>
            <th>Public</th>
          </tr>
        </thead>

        <tbody v-for="flavor in flavors" :key="flavor.id">
          <tr>
            <td>{{flavor.name}}</td>
            <td>{{flavor.vcpus}}</td>
            <td>{{flavor.ram}}</td>
            <td>{{flavor.disk}}</td>
            <td>{{flavor["os-flavor-access:is_public"]}}</td>-->
          </tr>
        </tbody>
      </table>
  </div>
</div>
</template>

<script>
export default {
  data: function(){
    return {
      url : process.env.MIX_URL,
      flavors:[],
    }
  },
  methods:{
    getFlavors: function() {
      axios
        .get(this.url + "/compute/v2.1/flavors/detail", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.flavors = response.data.flavors;
        });
    },
  },
  mounted(){
    this.getFlavors();
  }
}
</script>

<style lang="css" scoped>
</style>
