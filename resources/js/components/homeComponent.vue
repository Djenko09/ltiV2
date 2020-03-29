<template>
  <div>

    <div v-if="!this.$store.state.token" class="starter-template jumbotron bg-info">
      <h1 class="text-center" style="background-color:yellow">Welcome to Openstack</h1>
    </div>

  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,

    };
  },
  methods: {

  },
  mounted() {

  }
};
</script>
