<template>
  <div>
    <div v-if="this.$store.state.token" class="jumbotron">
      <!--  <a class="btn btn-primary"  v-on:click.prevent="getProjects()">getProjects</a>-->
      <h1>Hey pandeleiros!</h1>
      <h2 style="text-align:right"> Se quiserem mudar de proj é ali em cima ^^^</h2>
      <h3>:DDDDDDDD</h3>
    <!--  <h5>Projects</h5>
      <select>
        <option
          v-for="project in projects"
          :key="project.id"
          v-on:click="loginProject(project)"
        >{{project.name}}</option>
      </select>-->

    </div>
    <!--
    <instancias @exit-instance="exitInstances" v-if="btnInstances"></instancias>
    <images @exit-images="exitImages" v-if="btnImages"></images>
    <volumes @exit-volumes="exitVolumes" v-if="btnVolumes"></volumes>-->
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
      btnImages:null,
      btnVolumes: null,
      flavors: [],
      project_id: "",
      project_name:""
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
          this.$store.commit("setProjectNames", this.projects);
          console.log(this.$store.state.projectNames);
        });
    },
    createInstance: function() {
      this.$router.push("/newInstance");
    },
    exitInstances() {
      this.btnInstances = null;
    },
     getProjectID() {
      axios
        .get(this.url + "/identity/v3/auth/tokens", {
          headers: {
            "x-auth-token": this.$store.state.token,
            "x-subject-token": this.$store.state.token
          }
        })
        .then(response => {
          this.project_id = response.data.token.project.id;
          this.project_name = response.data.token.project.name;
          this.$store.commit("setProject", this.project_id);
          this.$store.commit("setProjectName", this.project_name);
          console.log(this.project_id);
        });
    },
    /*loginProject(project) {
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
                name: project.name
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
    },*/
    getInstances() {
      this.btnInstances = 1;
    },
    createVolume() {
      this.$router.push("/newVolume");
    },
    revokeOldToken() {
      this.$store.commit("clearToken");
    },
    deleteInstance: function(instance) {
      axios.delete(this.url + "/compute/v2.1/servers/" + instance, {
        headers: { "x-auth-token": this.$store.state.token }
      });

      this.$toasted.show("Instance Deleted With Success");
    },
    getImages: function(){
      axios.get(this.url + "/image/v2/images",{
         headers: {'x-auth-token': this.$store.state.token} })

         .then(response=>{
           this.images = response.data.images;
           console.log(images);
         })
    },
    getInstances(){
      this.btnImages = null;
      this.btnInstances = 1;
    },
    getImagesV2(){
      this.btnInstances = null;
      this.btnImages = 1;
    },
    getVolumes(){
      this.btnInstances = null;
      this.btnVolumes = 1;
    },
    exitInstances(){
      this.btnInstances = null;
    },
    exitImages(){
      this.btnImages = null;
    },
    exitVolumes(){
      this.btnVolumes = null;
    },
  },
  mounted() {
    this.getProjects();
    this.getProjectID();
    //this.getFlavors();
    this.getImages();
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
