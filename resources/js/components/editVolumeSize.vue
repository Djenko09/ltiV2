<template>
  <div class="jumbotron jumbotron-fluid bg-info">
    <h2>Edit Size: {{ volume.name }}</h2>
    
   <div class="form-group">
      <label for="name">New Size(> than actual size)</label>
      <input type="text" class="form-control" v-model="volume.size" id="size"  />
    </div>

  
    <div class="form-group">
      <a class="btn btn-success" v-on:click.prevent="saveSize(volume)">Save</a>
      <a class="btn btn-danger" v-on:click.prevent="cancelEdit()">Cancel</a>
    </div>
  </div>
</template>

<script type="text/javascript">
module.exports = {
  props: ["volume"],

  data: function() {
    return {
      url: process.env.MIX_URL,
    };
  },

  methods: {
    saveSize: function(volume) {
          axios
        .post(this.url + "/volume/v3/"+this.$store.state.project +"/volumes/" + volume.id + "/action",
          {
            "os-extend": {
              new_size: volume.size,
              

            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": this.$store.state.token
            }
          }) .then(response => {
            console.log(response);
            this.$emit("save-edit");
          })
         
    },
    cancelEdit: function() {
      this.$emit("edit-canceled");
    },
  
  },
  
};
</script>