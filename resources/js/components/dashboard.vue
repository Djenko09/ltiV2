<template>
  <div>
    <div v-if="this.$store.state.token" class="jumbotron">
      <!--  <a class="btn btn-primary"  v-on:click.prevent="getProjects()">getProjects</a>-->

      <h5>Projects</h5>

         <select>
          <option v-for="project in projects" :key="project.id" v-on:click="loginProject(project)">
                {{project.name}}
          </option>
        </select>


      <button type="submit" class="btn btn-warning" v-on:click="createInstance()">Create Instance</button>
      <button type="submit" class="btn btn-warning" v-on:click="createVolume()">Create Volume</button>
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
      projects: [],
      instances: [],
      images: [],
      btnInstances:null,
      flavors: []
    };
  },
  methods: {
    getProjects() {
      axios
        .get(this.url + "/identity/v3/auth/projects", {
          headers: { "x-auth-token": this.$store.state.token }
        })
        .then(response => {
          this.projects = response.data.projects;
          console.log(this.projects);
        });
    },
     createInstance: function() {
      this.$router.push("/newInstance");
    },
    exitInstances(){
     this.btnInstances = null;
   },
    loginProject(project){
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
              name: project.name
            }
          }
        }
      }).then(response=>{
        this.$store.commit("clearToken");
        this.user = response.data.token.user;
        this.user.token = response.headers['x-subject-token'];
        this.$store.commit("setToken", this.user.token); //guarda token
        this.$toasted.info("Changed to project "+ project.name);
        this.$router.push("/home");
        this.getInstances();
      });
    },
    getInstances(){
     this.btnInstances = 1;
   },
    revokeOldToken(){
      this.$store.commit("clearToken");
    },
  },
  mounted() {
    this.getProjects();
  }
};
</script>

<style media="screen">
/* Dropdown Button */
.dropbtn {
  background-color: #4caf50;
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
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

Change color of dropdown links on hover */ .dropdown-content a:hover {
  background-color: #ddd;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
}

/* Change the background color of the dropdown button when the dropdown content is shown */
.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>
