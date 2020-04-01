<template>
  <div>

    <div class="starter-template jumbotron bg-info">
      <strong>{{ message }}</strong>
      <div class="container">
        <h2>Login</h2>
        <div class="form-group">
          <label for="inputName">Username</label>
          <input
            type="text"
            class="form-control"
            v-model="credentials.name"
            name="email"
            id="inputEmail"
            placeholder="Your username"
          />
        </div>
        <div class="form-group">
          <label for="inputPassword">Password</label>
          <input
            type="password"
            class="form-control"
            v-model="credentials.password"
            name="password"
            id="inputPassword"
          />
        </div>
        <div class="form-group" text-align="center">
          <a class="btn btn-primary" v-on:click.prevent="login()">Login</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {

  data: function() {
    return {
      user: {
        token: null
      },
      credentials: {
        name: null,
        password: null
      },
      header: new XMLHttpRequest(),
      url: process.env.MIX_URL,
      showMessage: false,
      message: ""
    };
  },
  methods: {
    login() {
      axios
        .post(
          this.url + "/identity/v3/auth/tokens",
          {
            auth: {
              identity: {
                methods: ["password"],
                password: {
                  user: {
                    name: this.credentials.name,
                    domain: {
                      name: "Default"
                    },
                    password: this.credentials.password
                  }
                }
              },
              scope:{
                project:{
                  domain:{
                    id: "default"
                  },
                  name: "admin"
                }
              }
            }
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          console.log(response);
          this.user = response.data.token.user;
          this.user.token = response.headers['x-subject-token'];
          console.log(this.user.token);
          this.$store.commit("setToken", this.user.token); //guarda token
          this.$router.push("/home");
        })
          .then(response => {
          this.$store.commit("setUser",  this.user);


          //this.$router.push("/instancias");
        })
        .catch(error => {
          this.message = "Invalid Credentials";
          this.showMessage = true;
          console.log(error);
        });
    },
    mounted() {

    }
  }
};
</script>
