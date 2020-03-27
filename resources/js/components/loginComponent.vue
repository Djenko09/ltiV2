<template>
  <div>
    <h1 class="card-title mb-4 mt-1 jumbotron ">isto é o login</h1>


        <div class="starter-template jumbotron bg-info">
          <strong>{{ message }}</strong>
          <div class="container">
            <h2>Login</h2>
              <div class="form-group">
                <label for="inputName">Username</label>
                <input
                type="text"
                class="form-control"
                v-model="user.name"
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
                v-model="user.password"
                name="password"
                id="inputPassword"
                />
              </div>
              <div class="form-group" text-align="center" >
                <a class="btn btn-primary" v-on:click.prevent="login(user)">Login</a>
              </div>
            </div>
        </div>


  </div>
</template>

<script type="text/javascript">

export default {

  data: function() {
    return{
      //tokens:'',
      user:{
        name:null,
        password:null,
      },
      url: process.env.MIX_URL,
      showMessage: false,
      message: ""
      };
    },
    methods: {
        login(){
          axios.post(this.url+'/identity/v3/auth/tokens', {
            auth:{
              identity:{
                methods:[
                  "password"
                ],
               password:{
                 user:{
                   name:this.user.name,
                   domain: {
                     name: "default"
                   },
                   password:this.user.password
                 }
               }
             }
           }
          }).then(response=>{
            this.$router.push("/token");
          }).catch(error =>{
            this.message = "Invalid Credentials";
            this.showMessage = true;
            console.log(error);
          })

    },
    mounted() {
      console.log(tokens)
    }
  }
}
</script>
