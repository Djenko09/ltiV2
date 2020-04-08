<template>
<div>

  <br>
    <div>
      <h1>Networks</h1>
    </div>
    <br>
    <div>
      <button type="submit" class="btn btn-outline-dark" data-toggle="modal" data-target="#myModalNetworks">Create Network</button>
    </div>
      <br>
      <div class="modal" id="myModalNetworks">
        <div class="modal-dialog">
          <div class="modal-content">

            <!-- Modal Header -->
            <div class="modal-header">
              <h4 class="modal-title">Create Network</h4>
              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>

             <!-- Modal body -->
            <div class="modal-body">
              <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" v-model="network.name" id="name" placeholder="eg: my network" />
              </div>

            <br>
              <h3> Subnet </h3>
              <div class="form-group">
                <label for="name">Subnet Name</label>
                <input type="text" class="form-control" v-model="network.sub_name" id="sub_name" placeholder="eg: my subnet" />
              </div>

                <div class="form-group">
                <label for="flavor">Network</label>
                <select class="form-control" id="network_id" name="network_id" v-model="network.network_id">
                  <option value selected>Choose a network for your subnet</option>
                  <option
                    v-for="network_id in networks"
                    :key="network_id.id"
                    v-bind:value="network_id.id"
                  >{{ network_id.name}}</option>
                </select>
              </div>

              <div class="form-group">
                <label for="name">Subnet Address</label>
                <input type="text" class="form-control" v-model="network.address" id="address" placeholder="eg: 192.168.1.0/24" />
              </div>
              
             <!-- <div class="form-group">
                <label for="version">IP version (IPv4 or IPv6)</label>
                <select class="form-control" id="version" name="version" v-model="network.version">
                  <option value selected>4</option>
                  <option> 6</option>
                </select>
              </div> -->

               <div class="form-group">
                <label for="name">Gateway IP</label>
                <input type="text" class="form-control" v-model="network.gatewayIP" id="address" placeholder="eg: 192.168.1.254" />
              </div>
            
            
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
      network:{
          name: "",
          network_id: "",
          sub_name: "",
          address: "",
          version: 0,
          gatewayIP: ""
      }
    
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
     createNetwork(){
         axios
         .post(this.url + ":9696/v2.0/networks", 
         {
            network: {
                name: this.network.name
               
                }
         },
          {
           headers: { "x-auth-token": this.$store.state.token }
         })

         axios
         .post(this.url + ":9696/v2.0/subnets", 
        {
            subnet: {
                 name: this.network.sub_name,
                 ip_version: 4, // this.network.version,
                 network_id: this.network.network_id,
                 cidr: this.network.address,
                 gateway_ip: this.network.gatewayIP
        }
},
          {
           headers: { "x-auth-token": this.$store.state.token }
         })
         
     }
 

    
  },

  mounted() {
   
    this.getNetworks();
  }
}
</script>
