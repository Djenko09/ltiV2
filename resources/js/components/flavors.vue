<template>
<div>
  <div>
    <br>
    <div>
      <h1>
        Flavors
      </h1>
    </div><br>
    <div>
      <button
        type="button"
        class="btn btn-outline-dark"
        data-toggle="modal"
        data-target=".bd-example-modal-lg"
      >New Flavor</button>
    </div><br>
    </div>
    <!-- formulario para criar imagem -->
      <div class="modal fade bd-example-modal-lg" id="myModalImages">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <!-- Modal Header -->
            <div class="modal-header">
              <h3 class="modal-title">Create a new flavor</h3><br>

              <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div><br>
            <!-- Modal body -->
            <div class="modal-body">
                <div class="form-group">
                  <label for="name">Name *</label>
                  <input required type="text" class="form-control" placeholder="A name for the flavor" name="name" v-model="flavor.name"/>
                </div>
                <div class="form-group">
                  <label for="ram">RAM (MB) *</label>
                  <input required type="text" class="form-control" name="ram" v-model="flavor.ram"/>
                </div>
                <div class="form-group">
                  <label for="vpcus">Vcpus *</label>
                  <input required type="text" class="form-control" v-model="flavor.vcpus"/>
                </div>
                <div class="form-group">
                  <label for="name">Disk (GB) *</label>
                  <input required type="text" class="form-control" v-model="flavor.disk"/>
                </div>
                <div class="form-group">
                  <label for="Visibility">Visibility</label>
                  <select class="form-control" name="visibility" v-model="flavor.visibility">
                    <option value=true>Public</option>
                    <option value=false>Private</option>
                  </select>
                </div>
            </div>
            <!-- Modal footer -->
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-warning"
                data-dismiss="modal" :class="{ disabled: isDisabled }" :disabled="isDisabled"
                v-on:click="createFlavor()"
              >Create</button>     <!-- [FIM] Formulario para criar rede -->
            </div>
          </div>
        </div>
      </div><!-- FIM formulario para criar imagem -->
      <table class="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Vcpus</th>
            <th>Ram</th>
            <th>Total Disk</th>
            <th>Public</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody v-for="flavor in flavors" :key="flavor.id">
          <tr>
            <td>{{flavor.name}}</td>
            <td>{{flavor.vcpus}}</td>
            <td>{{flavor.ram}}</td>
            <td>{{flavor.disk}}</td>
            <td>{{flavor["os-flavor-access:is_public"]}}</td>
            <td>
              <button type="button" class="btn btn-danger" v-on:click="deleteFlavor(flavor.id)">Delete Flavor</button>
            </td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
export default {
  data: function(){
    return {
      url : process.env.MIX_URL,
      flavors:[],
      flavor:{
        name:"",
        ram:"",
        vcpus:"",
        disk:"",
        visibility:true
      }
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
    createFlavor(){
      axios.post(this.url+"/compute/v2.1/flavors",
    {
      flavor:{
        name: this.flavor.name,
        ram: this.flavor.ram,
        disk: this.flavor.disk,
        vcpus: this.flavor.vcpus,
        is_public: this.visbility
      }
    },
    {
      headers: { "x-auth-token": this.$store.state.token}
    }
  ).then(response =>{
    this.getFlavors();
    this.$toasted.success('Flavor Created');
  }).catch(error =>{
    this.$toasted.error('Flavor not created! Error occured')
  });
},
  deleteFlavor(flavor){
    axios.delete(this.url + "/compute/v2.1/flavors/" + flavor,{
        headers: { "x-auth-token": this.$store.state.token}
    }).then(response=>{
      this.$toasted.success("Flavor Deleted!");
      this.getFlavors();
    }).catch(error =>{
      this.$toasted.error("Error deleting flavor!")
    })
  }
  },
  computed:{
    isDisabled () {
      if (this.flavor.name && this.flavor.ram && this.flavor.disk && this.flavor.vcpus) {
        return false;
      } else {
        return true;
      }
    }
  },
  mounted(){
    this.getFlavors();
  }
}
</script>

<style lang="css" scoped>
</style>
