<template>
  <p>{{projectName}}</p>
</template>

<script type="text/javascript">
export default {
  props:['projectName'],
  data: function() {
    return {
      url: process.env.MIX_URL,
      project_name: null,
      user:{
        token: null
      },
      project:{

      },
    }
  },
  methods: {
    loginProject() {
      axios
        .post(this.url + "/identity/v3/auth/tokens", {  //funcao para mudar de projeto
          auth: {
            identity: {
              methods: ["password"],
              password: {
                user: {
                  name: this.$store.state.user.name, //nome guardado vuex
                  domain: {
                    name: "Default"
                  },
                  password: "devstack"
                }
              }
            },
            scope: {
              project: {
                domain: {
                  id: "default"
                },
                name: this.projectName
              }
            }
          }
        })
        .then(response => {
          this.$store.commit("clearToken");
          this.$store.commit("clearProject");
          this.user = response.data.token.user;
          this.user.token = response.headers["x-subject-token"];
          this.$store.commit("setToken", this.user.token); //guarda token
          this.$store.commit("setProject", this.project); //guarda id do projecto
          this.$toasted.success("Changed to project " + this.projectName);
          this.$router.push("/home");
          console.log("SUCESS")
        });
    },

  },
  mounted() {
    this.loginProject();
  }
};
</script>
