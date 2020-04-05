ogin<template>
  <div class="container login-container">
            <div class="row">
                <div class="col-md-12 login-form-1">
                  <div>
                       <img class="center" v-bind:src="'/images/logologin.png'" width=100 height=200/>
                   </div>
                   <br>
                   <br>
                   <br>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Your Email *"   v-model="credentials.name" />
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" placeholder="Your Password *" v-model="credentials.password" />
                        </div>
                        <div class="form-group">
                            <input type="submit" class="btnSubmit" value="Login" v-on:click.prevent="login()"/>
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
      project:{

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
                scope: {
                  project: {
                    domain: {
                      id: "default"
                    },
                    name: "demo"

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
          console.log(response.data.token.project);
          this.user = response.data.token.user;
          this.user.token = response.headers["x-subject-token"];
          this.project = response.data.token.project;

          console.log(this.user.token);
          this.$store.commit("setToken", this.user.token); //guarda token
          this.$store.commit("setProject", this.project); //guarda id do project para depois usar a criar volume

          this.$router.push("/home");
        })
        .then(response => {
          this.$store.commit("setUser", this.user);

          //this.$router.push("/instancias");
        })
        .catch(error => {
          this.message = "Invalid Credentials";
          this.showMessage = true;
          console.log(error);
        });
    },
    mounted() {}
  }
};
</script>
<style media="screen">
.login-container{
  margin-top: 5%;
  margin-bottom: 5%;
}
.login-logo{
  position: relative;
  margin-left: -41.5%;
}
.login-logo img{
  position: absolute;
  width: 20%;
  margin-top: 19%;
  background: #282726;
  border-radius: 4.5rem;
  padding: 5%;
}
.login-form-1{
  padding: 9%;
  background:#ffffff;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 9px 26px 0 rgba(0, 0, 0, 0.19);
}
.login-form-1 h3{
  text-align: center;
  margin-bottom:12%;
  color:#000000;
}
.btnSubmit{
  font-weight: 600;
  width: 50%;
  color: #ffffff;
  background-color: #c41616;
  border: none;
  border-radius: 1.5rem;
  padding:2%;
}
.btnForgetPwd{
  color: #fff;
  font-weight: 600;
  text-decoration: none;
}
.btnForgetPwd:hover{
  text-decoration:none;
  color:#fff;
}
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 50%;
}
</style>
