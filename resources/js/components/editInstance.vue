<template>
  <div class="jumbotron jumbotron-fluid bg-info">
    <h2>Edit instance: {{ instance.name }}</h2>
    
   <div class="form-group">
      <label for="name">Instance Name</label>
      <input type="text" class="form-control" v-model="instance.name" id="name" />
    </div>

  
    <div class="form-group">
      <a class="btn btn-success" v-on:click.prevent="saveInstance(instance)">Save</a>
      <a class="btn btn-danger" v-on:click.prevent="cancelEdit()">Cancel</a>
    </div>
  </div>
</template>

<script type="text/javascript">
module.exports = {
  props: ["instance"],

  data: function() {
    return {
      url: process.env.MIX_URL,
    };
  },

  methods: {
    saveInstance: function(instance) {
      axios
        .put(this.url + "/compute/v2.1/servers/" + instance.id,
          {
            server: {
              name: instance.name,

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
        .catch(error => {
          console.error(error);
        });
    },
    cancelEdit: function() {
      this.$emit("edit-canceled");
    },
  
  },
  
};
</script>