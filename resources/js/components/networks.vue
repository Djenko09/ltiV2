<template>
<div>

  <br>
    <div>
      <h1>Networks</h1>
    </div>
    <br>
    <div>
      <button type="submit" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModalInstances">Create Network</button>
    </div>
      <br>
      <div class="modal" id="myModalInstances">
        <div class="modal-dialog">
          <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Create Network</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

          

            <!-- Modal footer -->
            <div class="modal-footer">
              <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="createNetwork()" >Create</button>
            </div>

          </div>
        </div>
      </div>
      <table class="table table-hover">

        <thead>
          <tr>
            <th>Name</th>
            <th>Subnets Associated</th>
            <th> Shared</th>
            <th> Status </th>
            <th> Admin State </th>
            <th> Availability Zones</th>

          </tr>
        </thead>

        <tbody
        v-for="network in networks"
        :key="network.id"
        >
        <tr>
          <td >{{ network.name}}</td>
          <td> </td>
        <td v-if="network.shared == 0" > NO </td>
          <td v-else> Yes </td>
          <td class="bg-danger" v-if="network.status === 'ERROR'"> {{network.status}}</td>
          <td class="bg-success" v-if="network.status === 'ACTIVE'"> {{network.status}}</td>
          <td v-if="network.admin_state_up == 1"> UP </td>
          <td v-else> DOWN </td>
          <td v-for="zone in network.availability_zones" :key="zone"> {{zone}}</td>
        
        

        </tr>
       
      </tbody>
    </table>
</div>
</template>

<script type="text/javascript">


export default {
  data: function() {

    return{
      url: process.env.MIX_URL,
      networks: [],
    
      };
    },
    methods: {
   
     getNetworks: function() {
       axios
         .get(this.url + ":9696/v2.0/networks", {
           headers: { "x-auth-token": this.$store.state.token }
         })
         .then(response => {
           this.networks = response.data.networks;
           console.log(this.networks);
         });
     },
 

    
  },

  mounted() {
   
    this.getNetworks();
  }
}
</script>
