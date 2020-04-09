<template>
<div>
  <div class="modal fade bd-example-modal-xl" id="myModalManageSecurity">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Manage Security Group Rules ({{securityGroupId}})</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div><br>
        <div class=""><br>
          <button class="btn-create btn btn-outline-dark" data-toggle="modal" data-target="#createModal"><i class="far fa-plus-square"></i>Create</button>
        </div>


        <!-- Modal body -->
        <div class="modal-body">
          <table class="table table-hover">

            <thead>
              <tr>
                <th>Direction</th>
                <th>Ether Type</th>
                <th>Ip Protocol</th>
                <th>Port Range</th>
                <th>Remote Ip Prefix</th>
                <th>Remote Security Group</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody
            v-for="securityGroupRule in securityGroupRules"
            :key="securityGroupRule.id"
            >
            <tr>
              <td>{{ securityGroupRule.direction }}</td>
              <td>{{ securityGroupRule.ethertype }}</td>
              <td v-if="securityGroupRule.protocol === null">Any</td>
              <td v-else>{{ securityGroupRule.protocol }}</td>
              <td v-if="securityGroupRule.port_range_max === null && securityGroupRule.port_range_min === null">Any</td>
              <td v-else>{{securityGroupRule.port_range_min}} - {{securityGroupRule.port_range_max}}</td>
              <td class="text-center" v-if="securityGroupRule.remote_ip_prefix === null">-----</td>
              <td v-else>{{ securityGroupRule.remote_ip_prefix}}</td>
              <td>{{ securityGroupRule.security_group_id}}</td>
              <td class="text-center"v-if="securityGroupRule.description === null">-----</td>
              <td v-else>{{ securityGroupRule.description}}</td>
              <td>
                <button
                type="button"class="btn btn-sm btn-danger" v-on:click="deleteImage(image.id)">Delete Rule</button>
              </td>
            </tr>
          </tbody>
          </table>
        </div>
        <!-- Modal footer -->
        <div class="modal-footer">
          <input type="submit" class="btn btn-warning" data-dismiss="modal" data-target=".bd-example-modal-xl" value="Close">
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade bd-example-modal-xl" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModal" aria-hidden="true">
  <div class="modal-dialog modal-xl" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="createModal">Create new rule</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label for="policy">Rule</label>
           <select @change="onChangeRule($event)" class="form-control text-capitalize" v-model="securityGroupRule.rule"> <!-- CHANGE rule-->
            <option value selected>Choose a rule</option>
            <option value="custom">Custom TCP Rule</option>
            <option value="custom">Custom UDP Rule</option>
            <option value="custom">Custom ICMP Rule</option>
            <option value="icmp">All ICMP</option>
            <option value="tcp">All TCP</option>
            <option value="udp">All UDP</option>
            <option value="udp">DNS</option>
            <option value="tcp">HTTP</option>
            <option value="tcp">HTTPS</option>
            <option value="tcp">IMAP</option>
            <option value="tcp">IMAPS</option>
            <option value="tcp">LDAP</option>
            <option value="tcp">MYSQL</option>
            <option value="tcp">POP3</option>
            <option value="tcp">POP3S</option>
            <option value="tcp">RDP</option>
            <option value="tcp">SMTP</option>
            <option value="tcp">SMTPS</option>
            <option value="tcp">SSH</option>
          </select>
        </div>
          <div class="form-group">
            <label for="description">Description:</label><br>
            <textarea id="w3mission" rows="4" cols="50" v-model="securityGroupRule.description"></textarea>
          </div>
          <div class="form-group">
            <label for="">Direction:</label>
            <select class="form-control" v-model="securityGroupRule.direction">
              <option value="ingress">Ingress</option>
              <option value="egress">Egress</option>
            </select>
          </div>
          <div v-if="securityGroupRule.rule === 'custom'"class="form-group">  <!-- CHANGE port -->
            <label>Open Port</label>
            <select @change="onChangePort($event)" class="form-control" v-model="securityGroupRule.port">
              <option value="port">Port</option>
              <option value="portRange">Port Range</option>
              <option value="all">All ports</option>
            </select>
          </div>
          <div v-if="securityGroupRule.port === 'port' && securityGroupRule.rule === 'custom'" class="form-group">  <!-- Ports hidden/available -->
            <label type="text" readonly class="form-control-plaintext">Port:</label>
            <input @change="onChangePortV2($event)" type="text" v-model="securityGroupRule.portSelected">
          </div>
          <div v-if="securityGroupRule.port === 'portRange'" class="form-group">  <!-- Ports hidden/available -->
            <label type="text" readonly class="form-control-plaintext">From Port</label>
            <input class="form-group" type="text" v-model="securityGroupRule.port_range_min">
            <label type="text" readonly class="form-control-plaintext">To Port</label>
            <input type="text" v-model="securityGroupRule.port_range_max">
          </div>
          <div class="form-group">    <!-- CHANGE remote-->
            <label>Remote</label>
            <select @change="onChangeRemote($event)" class="form-control" v-model="securityGroupRule.remote" >
              <option value="cidr">CIDR</option>
              <option value="secur">Security Group</option>
            </select>
          </div>
          <div v-if="securityGroupRule.remote === 'secur'" class="form-group">
            <label for="securityGroup">Security Group</label>
            <select class="form-control" v-model="securityGroupRule.security_group_id">
              <option v-for="securityGroup in securityGroups" :key="securityGroup.id" value="option"></option>
            </select>
            <label for="etherType">EtherType</label>
            <select class="form-control" v-model="securityGroupRule.ethertype">
              <option value="ipv4">IPv4</option>
              <option value="ipv6">IPv6</option>
            </select>
          </div>
          <div class="form-group">
            <label for="CIDR">CIDR</label>
            <input type="text" name="CIDR" palceholder="0.0.0.0/0"v-model="securityGroupRule.remote_ip_prefix">
          </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-warning" v-on:click="createSecurityGroupRule()">Save changes</button>
      </div>
    </div>
  </div>
</div>
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
    :key="securityGroup.project_id"
    >
    <tr>
      <td>{{ securityGroup.name }}</td>
      <td>{{ securityGroup.id }}</td>
      <td>{{ securityGroup.description }}</td>
      <td>
        <button
        type="button"
        class="btn btn-sm btn-outline-dark" data-toggle="modal" data-target=".bd-example-modal-xl"
        v-on:click="getSecurityGroupRules(securityGroup.id)"
        >Manage Rules</button>
        <button
        type="button"
        class="btn btn-sm btn-warning"
        v-on:click="deleteSecurityGroup(securityGroup.security_group_id)"
        >Delete Rule</button>
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
    securityGroupRules:[],
    securityGroupId:null,
    securityGroupRule:{
      remote_group_id:"",
      direction:"",
      protocol:"any",
      ethertype:"ipv4",
      port_range_max:null,
      port_range_min:null,
      security_group_id:null,
      remote_ip_prefix:"",
      description:"",
      rule:"", /* variaveis a para nao enviar daqui para baixo */
      remote:"",
      port:"port",
      portSelected:""
    },
  }
},
computed:{
  inputOptions(){
    return this.securityGroupRule.rule
  },

},
methods:{
  getSecurityGroups(){
    axios.get(this.url +":9696/v2.0/security-groups",{
      headers: {"x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.securityGroups = response.data.security_groups;
      console.log(this.securityGroups)
    })
  },
  deleteSecurityGroup(securityGroup){
    axios.delete(this.url + ":9696/v2.0/security-groups/"+ securityGroup,{
        headers: {"x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.getSecurityGroups();
      this.$toasted.success("Security group deleted with success!");
    }).catch(error=>{
      if(error.response.status == 409){
        this.$toasted.error("Can't delete! Security group in use!")
      }
    });
  },
  getSecurityGroupRules(securityGroupId){
    axios.get(this.url + ":9696/v2.0/security-groups/"+securityGroupId,{
        headers: {"x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.securityGroupId = securityGroupId
      this.securityGroupRules = response.data.security_group.security_group_rules;
      console.log(this.securityGroupRules);
    })
  },
  createSecurityGroupRule(){
    axios.post(this.url + ":9696/v2.0/security-group-rules",
    {
        security_group_rule:{
          direction:this.securityGroupRule.direction,
          description:this.securityGroupRule.description,
          port_range_min:this.securityGroupRule.port_range_min,
          ethertype:this.securityGroupRule.ethertype,
          port_range_max:this.securityGroupRule.port_range_max,
          protocol:this.securityGroupRule.protocol,
          security_group_id:this.securityGroupId
        }
    },
    {
      headers : {
        'X-Auth-Token': this.$store.state.token
        }
    }
  )
},
  onChangeRule(event){
    this.securityGroupRule.rule = event.target.value;
    if(this.securityGroupRule.rule == 'tcp'){
      this.securityGroupRule.protocol = 'tcp';
    }else if(this.securityGroupRule.rule == 'udp'){
      this.securityGroupRule.protocol = 'udp';
    }
  },
  onChangeRemote(event){
    this.securityGroupRule.remote = event.target.value;s
  },
  onChangePort(event){
    this.securityGroupRule.port = event.target.value;
    if(this.securityGroupRule.port === 'all'){
      this.securityGroupRule.port_range_max = 65535;
      this.securityGroupRule.port_range_min = 0;
    }

  },
  onChangePortV2(event){
    this.securityGroupRule.port_range_max = event.target.value;
    this.securityGroupRule.port_range_min = event.target.value;
    console.log("RANGE MAX : " + this.securityGroupRule.port_range_max)
    console.log("RANGE MIN : " + this.securityGroupRule.port_range_min)
  }


},
mounted(){
  this.getSecurityGroups();
}

}

</script>

<style lang="css" scoped>

.btn-create{
  position: relative;
  left: 1000px
}
.far{
  width: 1px;
  height: 1px;
}

</style>
