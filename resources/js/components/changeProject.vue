<template>

</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      proj_name: "alt_demo"
    };
  },
  methods: {
    loginProject(){
      axios.post(this.url + "/identity/v3/auth/tokens",{
        auth: {
          identity: {
            methods: ["password"],
            password: {
              user: {
                name: this.$store.state.user.name,
                domain: {
                  name: "Default"
                },
                password: "devstack"
              }
            }
          },
          scope:{
            project:{
              domain:{
                id: "default"
              },
              name: this.proj_name
            }
          }
        }
      }).then(response=>{
        this.$store.commit("clearToken");
        this.user = response.data.token.user;
        this.user.token = response.headers['x-subject-token'];
        this.$store.commit("setToken", this.user.token); //guarda token
        this.$toasted.info("Changed to "+this.proj_name);
        this.$router.push("/home");
      });
    },
    revokeOldToken(){
      this.$store.commit("clearToken");
    },
  },
  mounted() {
    this.loginProject();
    console.log("project changed");
  }
};
</script>
