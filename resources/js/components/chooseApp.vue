<template>
  <div class="container login-container">

            <div class="row">
                <div class="col login-form-1">

                        <div class="row">
                            <div class="col"><img class="center" v-bind:src="'/images/logologin.png'" width=100 height=200/></div>
                            <div class="col"><img class="center" v-bind:src="'/images/kubernets.png'" width=300 height=200/></div>
                        </div>
                  
                   <br>
                   <br>
                   <br>
                   <!-- formulario para LOG IN -->
                    
                      
                         <div class="form-group row">
                             
                             <div class="col" align="center"><input type="submit" class="btnSubmit" value="Go to Openstack" v-on:click.prevent="toOpenstack()"/></div>
                          
                             <div class="col" align="center"><input type="submit" class="btnSubmit" value="Go to Kubernets" style="background-color: blue" v-on:click.prevent="toKubernets()"/></div>
                           
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
    toOpenstack() {  //funcao para ir para o openstack
          this.$router.push("/login");
    },
    toKubernets() {  //funcao para ir para o openstack
          this.$router.push("/kubernetsHome");
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
