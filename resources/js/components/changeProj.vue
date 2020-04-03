<template>

</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      project_name:"",
    };
  },
  methods: {
    loginProject(project) {
      axios
        .post(this.url + "/identity/v3/auth/tokens", {
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
            scope: {
              project: {
                domain: {
                  id: "default"
                },
                name: project
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
          this.$store.commit("setProject", project.id); //guarda id do projecto
          this.$toasted.info("Changed to project " + project.name);
          this.$router.push("/home");
        });
    },

  },
  mounted() {
    this.loginProject(ProjectName.name);
  }
};
</script>
