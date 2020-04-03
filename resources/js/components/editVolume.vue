<template>
  <div class="jumbotron jumbotron-fluid bg-info">
    <h2>Edit Volume: {{ volume.name }}</h2>
    
   <div class="form-group">
      <label for="name">Volume Name</label>
      <input type="text" class="form-control" v-model="volume.name" id="name" />
    </div>

    <div class="form-group">
      <label for="name">Description</label>
      <input type="text" class="form-control" v-model="volume.description" id="description" />
    </div>
  
    <div class="form-group">
      <a class="btn btn-success" v-on:click.prevent="saveVolume(volume)">Save</a>
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
    saveVolume: function(volume) {
      axios
        .put(this.url + "/volume/v3/"+this.$store.state.project +"/volumes/" + volume.id,
          {
            volume: {
              name: volume.name,
              description: volume.description

            }
          },
          {
            headers: {
              "Content-Type": "application/json",
               "x-auth-token": this.$store.state.token
            }
          }
        )
        .then(response => {
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