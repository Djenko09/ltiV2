<template >
  <div>

    <div style="margin-top:50px" class="card">
      <div class="card-header bg-primary text-white ">
        List of Namespaces
      </div>
      <div class="card-body">
        <table class="table table-hover">
          <thead class="thead-dark" >
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Age</th>
              <!--<th>Options</th>-->
            </tr>
          </thead>
          <tbody v-for="namespace in namespaces.items" :key="namespace.metadata.name">
            <tr>
              <td>{{ namespace.metadata.name }}</td>
              <td>{{ namespace.status.phase}}</td>
              <!--<td>
                <button
                  type="button"
                  class="btn btn-sm btn-danger"
                  v-on:click="deleteContainer(container)"
                >Delete</button>
              </td>-->
              <td>{{namespace.metadata.managedFields[0].time}} Hours</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data:function(){
    return{
      url : process.env.MIX_URL,
      namespaces:[],
      namespacesItems:[],
    }
  },

  methods:{
    getNamespaces(){
      axios.get(this.url + "/api/v1/namespaces").then(response=>{
        this.namespaces = response.data;
        this.namespacesItems = response.data.items;

        var arrayLength = this.namespacesItems.length;
        for(var i = 0; i<arrayLength; i++){
          console.log(this.namespacesItems[i].metadata.managedFields[0].time);
          var date = this.namespacesItems[i].metadata.managedFields[0].time;
          var divideDiaHora = date.split("T");
          var dia = divideDiaHora[0].split("-");
          var divideHoraZ = divideDiaHora[1].split("Z");
          var horas = divideHoraZ[0].split(":");
          //var hour = res[1].split("Z")
          //console.log(res);
          console.log(horas);
          //console.log(hour);

          var data = new Date(dia[0],dia[1]-1,dia[2],horas[0],horas[1],horas[2],0);
          console.log(data);
          var hoje = new Date().getTime();
          var segundosNamespace = data.getTime();

          var diferenca = hoje-data;
          diferenca = (diferenca / (1000*60*60))
          console.log(diferenca);

          //vidaNamespace = vidaNamespace / 36000;
          this.namespacesItems[i].metadata.managedFields[0].time = diferenca.toFixed(1);
        }
      //  console.log(this.namespaces.items[0].metadata.managedFields[0].time);
      })
    },
    createNamespace(){
      axios.post(this.url + "/")
    }
  },

  mounted(){
    this.getNamespaces();
  }

}
</script>

<style lang="css" scoped>
</style>
