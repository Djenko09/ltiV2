<template>
  <div>
    <div v-if="this.$store.state.token" class="jumbotron">
    <!--  <a class="btn btn-primary"  v-on:click.prevent="getProjects()">getProjects</a>-->
      <div style="background-color:yellow" class="dropdown">
        <button class="dropbtn">Projects</button>
        <div class="dropdown-content">
          <router-link to="/changeProject">{{project1}}</router-link>
          <!--<a v-on:click="loginProject(project1)">{{project1}}</a>-->
          <a href="#">{{project2}}</a>
          <a href="#">{{project3}}</a>
        </div>
      </div>
       <button type="submit" class="btn btn-warning" v-on:click="createInstance()">Create Instance</button>
       <button type="submit" class="btn btn-warning" v-on:click="getInstances()">Instances</button>
    </div>
    <instancias @exit-instance="exitInstances" v-if="btnInstances"></instancias>
  </div>
</template>

<script type="text/javascript">
export default {
  data: function() {
    return {
      url: process.env.MIX_URL,
      project1:null,
      project2:null,
      project3:null,
      instances: [],
      images: [],
      btnInstances:null,
      flavors: []
    };
  },
  methods: {
    getProjects(){
      axios.get(this.url + '/identity/v3/auth/projects',{
        headers: {'x-auth-token': this.$store.state.token}
      }).then(response=>{
        this.project1 = response.data.projects[0].name;
        this.project2 = response.data.projects[1].name;
        this.project3 = response.data.projects[2].name;
        console.log(this.project1);
      })
    },
    createInstance: function() {
      this.$router.push("/newInstance");
    },
    getInstances(){
      this.btnInstances = 1;
    },
    exitInstances(){
      this.btnInstances = null;
    },
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
              name:project
            }
          }
        }
      }).then(response=>{
        console.log(project);
        this.$store.commit("clearToken");
        this.user = response.data.token.user;
        this.user.token = response.headers['x-subject-token'];
        this.$store.commit("setToken", this.user.token); //guarda token
        this.$toasted.info("Changed to "+this.proj_name);
        this.$router.push("/home");
      });
    },
  },
  mounted() {
    //console.log(this.project1)
    this.getProjects();

    //this.getInstances();
    //this.getFlavors();
    //this.getImages();
    console.log(this.$store.state.user);
  }
};
</script>

<style media="screen">
/* Dropdown Button */
.dropbtn {
background-color: #4CAF50;
color: white;
padding: 16px;
font-size: 16px;
border: none;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
position: relative;
display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
display: none;
position: absolute;
background-color: #f1f1f1;
min-width: 160px;
box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
color: black;
padding: 12px 16px;
text-decoration: none;
display: block;
}

Change color of dropdown links on hover */
.dropdown-content a:hover {background-color: #ddd;}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: block;}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {background-color: #3e8e41;}
</style>
