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
    </div>

    <div>
      <h1>Instances</h1>
    </div>
    <div>
      <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Flavor ID</th>
            <th>Image</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody v-for="instance in instances" :key="instance.id">
          <tr>
            <td>{{ instance.name }}</td>
            <td>{{ instance.status }}</td>
            <td>
              <div v-for="flavor in flavors" :key="flavor.id">
                <a v-if="flavor.id === instance.flavor.id">{{flavor.name}}</a>
              </div>
            </td>

            <div v-for="image in images" :key="image.id">
              <td v-if="image.id === instance.image.id">{{image.name}}</td>
            </div>

            <td>
              <!--<button
                type="button"
                class="btn btn-sm btn-primary"
                v-on:click="movementDetails(movement)"
              >Details</button>-->
              <button
                type="button"
                class="btn btn-sm btn-danger"
                v-on:click="deleteInstance(instance.id)"
              >Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
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
    getInstances() {
      axios
        .get(this.url + "/compute/v2.1/servers/detail", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.instances = response.data.servers;
          console.log(this.instances);
        });
    },
    getImages: function() {
      axios
        .get(this.url + "/image/v2/images", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.images = response.data.images;
          console.log(images);
        });
    },
    getFlavors: function() {
      axios
        .get(this.url + "/compute/v2.1/flavors", {
          headers: { "x-auth-token": this.$store.state.token }
        })

        .then(response => {
          this.flavors = response.data.flavors;
          console.log(images);
        });
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
    revokeOldToken(){
      this.$store.commit("clearToken");
    },
    deleteInstance: function(instance) {
      axios.delete(this.url + "/compute/v2.1/servers/" + instance, {
        headers: { "x-auth-token": this.$store.state.token }
      });

      this.$toasted.show("Instance Deleted With Success");
    }
  },
  mounted() {
    this.getProjects();
    this.getInstances();
    this.getFlavors();
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
