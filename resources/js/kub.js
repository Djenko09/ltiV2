require('./bootstrap');
window.Vue = require('vue');

//Trabalho laboratorial 2
import chooseAppComponent from "./components/chooseApp.vue";
import kubernetsHomeComponent from "./components/kubernetsHome.vue";

const chooseApp = Vue.component('chooseApp', chooseAppComponent);
const kubernetsHome = Vue.component('kubernetsHome', kubernetsHomeComponent);

const routes = [
    { path: '/', component: chooseApp },  //alterado para TL2
    { path: '/login', component: login, name: "login" },
    { path: '/instances', component: instancias, name: "instancias"},
    { path: '/home', component: dashboard, name: "dashboard"},
    { path: '/volumes', component: volumes, name: "volumes"},
    { path: '/logout', component: logout, name:"logout"},
    { path: '/images', component: images, name:"images"},
    { path: '/keyPairs', component: keyPairs, name:"keyPairs"},
    { path: '/changeProj',  props: true, component: changeProj, name:"changeProj"},
    { path: '/serverGroup', component: serverGroup, name:"serverGroup"},
    { path: '/projects', component: projects, name:"projects"},
    { path: '/networks', component: networks, name:"networks"},
    { path: '/floatingIPs', component: floatingIPs, name:"floatingIPs"},
    { path: '/routers', component: routers, name:"routers"},
    { path: '/securityGroups', component: securityGroups, name:"securityGroups"},
    { path: '/flavors', component: flavors, name:"flavors"},
    { path: '/containers', component: containers, name:"containers"}, //parte 2 projeto

     //Trabalho laboratorial 2
    { path: '/chooseApp', component: chooseApp, name:"chooseApp"},
    { path: '/kubernetsHome', component: kubernetsHome, name:"kubernetsHome"}


];


const router = new VueRouter({
    routes,


});


new Vue({
    el: "#kub",
    router,
    store,
    created() {
        this.$store.commit("loadTokenAndUserFromSession");

    },
    methods: {
      show(){
        $('#sidebar').toggleClass('active');
      }
},
  components:{
    PulseLoader
  }
});
