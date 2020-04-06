<template>
<div>

  <br>
    <div>
      <h1>Projects</h1>
    </div>
    <br>
  
    
      <table class="table table-hover">

        <thead>
          <tr>
            <th>Name</th>
            <th>Desription</th>
            <th>Project ID</th>
            <th> Domain Name </th>
            <th> Enabled </th>
             <th> Actions </th>

          </tr>
        </thead>

        <tbody
        v-for="project in projects"
        :key="project.id"
        >
        <tr>
          <td>{{ project.name}}</td>
          <td>{{ project.description}}</td>
          <td >{{project.id}} </td>
          <td>{{ project.domain_id}}</td>
          <td v-if="project.enabled == 0"> NO</td>
          <td v-else> YES </td>
    

          <td v-if="active_prj != project.id">
              <button type="submit" class="btn btn-outline-dark" v-on:click="changeProject(project)">Define as Active Project</button>
           
          </td>

        </tr>
      </tbody>
    </table>
</div>
</template>

<script type="text/javascript">

import InstanceEdit from "./editInstance.vue";

export default {
  data: function() {

    return{
      url: process.env.MIX_URL,
      projects: [],
      active_prj : this.$store.state.project,
      user:{
        token: null
      },
    
    
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
        });
    },
     changeProject(project) {
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
                  password: "paulo"
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
          this.$toasted.success("Changed to project " + project.name);
          this.$router.push("/home");
          console.log("SUCESS");
        });
    },
      

  },
  mounted() {
    this.getProjects();
  }
}
</script>
