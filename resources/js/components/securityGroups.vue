<template>
<div>
  <!-- MODAL DAS REGRAS -->
  <div class="modal fade bd-example-modal-xl" id="myModalManageSecurity">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">

        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Manage Security Group Rules ({{securityGroupId}})</h4>
          <button type="button" class="close" data-dismiss="modal">&times;</button>
        </div><br>
        <div class=""><br>
          <button class="btn-create btn btn-outline-dark" data-toggle="modal" data-target="#createModal"></i>Create</button>
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
                type="button"class="btn btn-sm btn-danger" v-on:click="deleteSecurityGroupRule(securityGroupRule.id)">Delete Rule</button>
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
  <!-- MODAL CRIAR REGRA -->
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
            <option value="customTCP">Custom TCP Rule</option>
            <option value="customUDP">Custom UDP Rule</option>
            <option value="customICMP">Custom ICMP Rule</option>
            <option value="icmp">All ICMP</option>
            <option value="tcp">All TCP</option>
            <option value="udp">All UDP</option>
            <option value="dns">DNS</option>
            <option value="http">HTTP</option>
            <option value="https">HTTPS</option>
            <option value="imap">IMAP</option>
            <option value="imaps">IMAPS</option>
            <option value="ldap">LDAP</option>
            <option value="mysql">MYSQL</option>
            <option value="pop3">POP3</option>
            <option value="pop3s">POP3S</option>
            <option value="smtp">SMTP</option>
            <option value="smtps">SMTPS</option>
            <option value="ssh">SSH</option>
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
          <div v-if="securityGroupRule.rule === 'customTCP' || securityGroupRule.rule === 'customUDP'" class="form-group">  <!-- CHANGE port -->
            <label>Open Port</label>
            <select @change="onChangePort($event)" class="form-control" v-model="securityGroupRule.port">
              <option value="port">Port</option>
              <option value="portRange">Port Range</option>
              <option value="all">All ports</option>
            </select>
          </div>
          <div v-if="securityGroupRule.rule === 'customICMP'"class="form-group">  <!-- CHANGE port -->
            <label>Type (-1 - 255)</label><br>
            <input type="text" name="" v-model="securityGroupRule.port_range_min">
          </div>
          <div v-if="securityGroupRule.rule === 'customICMP'"class="form-group">  <!-- CHANGE port -->
            <label>Code (-1 - 255)</label><br>
            <input type="text" name="" v-model="securityGroupRule.port_range_min">
          </div>
          <div v-if="securityGroupRule.port === 'port' && (securityGroupRule.rule === 'customTCP' || securityGroupRule.rule === 'customUDP')" class="form-group">  <!-- Ports hidden/available -->
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
            <select class="form-control" v-model="securityGroupRule.remote_group_id">
              <option v-for="securityGroupOption in securityGroupsOptions" :key="securityGroupOption.name" :value="securityGroupOption.id">{{securityGroupOption.name}}</option>
            </select>
            <label for="etherType">EtherType</label>
            <select class="form-control" v-model="securityGroupRule.ethertype">
              <option value="ipv4">IPv4</option>
              <option value="ipv6">IPv6</option>
            </select>
          </div>
          <div v-if="securityGroupRule.remote === 'cidr'" class="form-group">
            <label for="CIDR">CIDR</label><br>
            <input type="text" name="CIDR" palceholder="0.0.0.0/0" v-model="securityGroupRule.remote_ip_prefix">
          </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-danger" data-dismiss="modal" v-on:click="createSecurityGroupRule()">Create Rule</button>
      </div>
    </div>
  </div>
</div>
<!-- MODAL CRIAR SECURITY GROUP -->
<div class="modal" id="modalSecurityGroup">
  <div class="modal-dialog">
    <div class="modal-content">

      <!-- Modal Header -->
      <div class="modal-header">
        <h4 class="modal-title">Create Security Group</h4>
        <button type="button" class="close" data-dismiss="modal">&times;</button>
      </div>

      <!-- Modal body -->
      <div class="modal-body">
        <div class="form-group">
          <label for="nameSecurityGroup">Name *</label>
          <input type="text" class="form-control"  placeholder="A name for the server Group" name="name" v-model="securityGroup.name"></input>
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea name="name" rows="4" cols="45" v-model="securityGroup.description"></textarea>
        </div>
      </div>

      <!-- Modal footer -->
      <div class="modal-footer">
        <button type="button" class="btn btn-warning" data-dismiss="modal" v-on:click="createSecurityGroup()">Create Security Group</button>
      </div>

    </div>
  </div>
</div>
  <div><br>
    <h1>Security Groups</h1>
  </div><br>
    <button type="button" class="btn btn-outline-dark" data-toggle="modal" data-target="#modalSecurityGroup" v-on:click="createSecurityGroup()">Create Security Group</button><br><br>
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
        class="btn btn-sm btn-danger"
        v-on:click="deleteSecurityGroup(securityGroup.id)"
        >Delete</button>
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
    securityGroup:{
      name:null,
      description:null,
      stateful:true,
    },
    securityGroupsOptions:[],
    securityGroupRules:[],
    securityGroupId:null,
    securityGroupRule:{
      remote_group_id:null,
      direction:null,
      protocol:"any",
      ethertype:"ipv4",
      port_range_max:null,
      port_range_min:null,
      security_group_id:null,
      remote_ip_prefix:null,
      description:"",
      rule:null, /* variaveis a para nao enviar daqui para baixo */
      remote:"cidr",
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
      this.securityGroupsOptions = response.data.security_groups;
      console.log(this.securityGroups)
    })
  },
  deleteSecurityGroup(securityGroup){
    axios.delete(this.url + ":9696/v2.0/security-groups/"+ securityGroup,{
        headers: {"x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.$toasted.success("Security group deleted with success!");
      this.getSecurityGroups();
    }).catch(error=>{
      if(error.response.status == 409){
        this.$toasted.error("Can't delete! Security group in use!")
      }
    });
  },
  deleteSecurityGroupRule(securityGroupRuleId){
    axios.delete(this.url + ":9696/v2.0/security-group-rules/"+ securityGroupRuleId,{
        headers: {"x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.$toasted.success("Security group rule deleted with success!");
      this.getSecurityGroupRules(this.securityGroupId);
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
          remote_ip_prefix:this.securityGroupRule.remote_ip_prefix,
          remote_group_id:this.securityGroupRule.remote_group_id,
          security_group_id:this.securityGroupId
        }
    },
    {
      headers : {
        'X-Auth-Token': this.$store.state.token
        }
    }
  ).then(response=>{
    this.$toasted.success('Rule created with success');
    this.getSecurityGroupRules(this.securityGroupId);
    this.securityGroupRule.length = 0;
  })
},
createSecurityGroup(){
  axios.post(this.url + ":9696/v2.0/security-groups",
  {
      security_group:{
        name: this.securityGroup.name,
        description: this.securityGroup.description,
        stateful: this.securityGroup.stateful
      },
  },
  {
    headers : {
      'X-Auth-Token': this.$store.state.token
      }
  }
  ).then(response=>{
    this.getSecurityGroups();
    this.$toasted.success("Security Group created!")
  })
},
  onChangeRule(event){
    this.securityGroupRule.rule = event.target.value;
    if(this.securityGroupRule.rule == 'customTCP'){
      this.securityGroupRule.protocol = 'tcp';
    }else if(this.securityGroupRule.rule == 'customUDP'){
      this.securityGroupRule.protocol = 'udp';
    }else if(this.securityGroupRule.rule == 'customICMP'){
      this.securityGroupRule.protocol = 'icmp';
    }else if(this.securityGroupRule.rule == 'icmp'){
      this.securityGroupRule.protocol = 'icmp';
    }else if(this.securityGroupRule.rule == 'dns'){
      this.securityGroupRule.protocol = 'udp'
      this.securityGroupRule.port_range_min = 53;
      this.securityGroupRule.port_range_max = 53;
    }else if(this.securityGroupRule.rule == 'http'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 80;
      this.securityGroupRule.port_range_max = 80;
    }else if(this.securityGroupRule.rule == 'https'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 443;
      this.securityGroupRule.port_range_max = 443;
    }else if(this.securityGroupRule.rule == 'imap'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 220;
      this.securityGroupRule.port_range_max = 220;
    }else if(this.securityGroupRule.rule == 'imaps'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 993;
      this.securityGroupRule.port_range_max = 993;
    }else if(this.securityGroupRule.rule == 'ldap'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 389;
      this.securityGroupRule.port_range_max = 389;
    }else if(this.securityGroupRule.rule == 'mysql'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 3306;
      this.securityGroupRule.port_range_max = 3306;
    }else if(this.securityGroupRule.rule == 'pop3'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 110;
      this.securityGroupRule.port_range_max = 110;
    }else if(this.securityGroupRule.rule == 'pop3s'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 995;
      this.securityGroupRule.port_range_max = 995;
    }else if(this.securityGroupRule.rule == 'smtp'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 336;
      this.securityGroupRule.port_range_max = 336;
    }else if(this.securityGroupRule.rule == 'smtps'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 465;
      this.securityGroupRule.port_range_max = 465;
    }else if(this.securityGroupRule.rule == 'ssh'){
      this.securityGroupRule.protocol = 'tcp'
      this.securityGroupRule.port_range_min = 22;
      this.securityGroupRule.port_range_max = 22;
    }
  },
  onChangeRemote(event){
    this.securityGroupRule.remote = event.target.value;s
  },
  onChangePort(event){
    this.securityGroupRule.port = event.target.value;

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
