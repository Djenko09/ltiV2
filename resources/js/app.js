require('./bootstrap');
//import 'bootstrap';

window.Vue = require('vue');

import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter);

//import k8s from '@kubernetes/client-node';
//Vue.use(k8s);
//const k8s = require('@kubernetes/client-node');

import moment from 'moment';

Vue.filter('formatDate', function(value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm:ss')
  }
});


import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    theme: "bubble",
    position: "top-right",
    duration: 5000,
    type: 'success'
});

import store from "./vuex.js";

import gpsComponent from "./components/gps.vue";
import loginComponent from "./components/loginComponent.vue";
import homeComponent from "./components/homeComponent.vue";
import instanciasComponent from "./components/instancias.vue";
import dashboardComponent from "./components/dashboard.vue";
import logoutComponent from "./components/logout.vue";
import imagesComponent from "./components/images.vue";
import volumesComponent from "./components/volumes.vue";
import keyPairsComponent from "./components/keyPairs.vue";
import changeProjComponent from "./components/changeProj.vue";
import serverGroupComponent from "./components/serverGroups.vue";
import projectsComponent from "./components/projects.vue";
import networksComponent from "./components/networks.vue";
import floatingIPsComponent from "./components/floatingIPs.vue";
import routersComponent from "./components/routers.vue";
import securityGroupsComponent from "./components/securityGroups.vue";
import flavorsComponent from "./components/flavors.vue";
import containersComponent from "./components/containers.vue";  //parte 2 projeto TL1

//Trabalho laboratorial 2
import chooseAppComponent from "./components/chooseApp.vue";
import kubernetsHomeComponent from "./kubernetes/kubernetsHome.vue";

const gps = Vue.component('gps', gpsComponent);
const home = Vue.component('home', homeComponent);
const login = Vue.component('login', loginComponent);
const logout = Vue.component('logout', logoutComponent);
const instancias = Vue.component('instancias', instanciasComponent);
const dashboard = Vue.component('dashboard', dashboardComponent);
const images = Vue.component('images', imagesComponent);
const volumes = Vue.component('volumes', volumesComponent);
const keyPairs = Vue.component('keyPairs', keyPairsComponent);
const changeProj = Vue.component('changeProj', changeProjComponent);
const serverGroup = Vue.component('serverGroup', serverGroupComponent);
const projects = Vue.component('projects', projectsComponent);
const networks = Vue.component('networks', networksComponent);
const floatingIPs = Vue.component('floatingIPs', floatingIPsComponent);
const routers = Vue.component('routers', routersComponent);
const securityGroups = Vue.component('securityGroups', securityGroupsComponent);
const flavors = Vue.component('flavors', flavorsComponent);
const containers = Vue.component('containers', containersComponent); //parte 2 projeto
//const teste = Vue.component('teste', testeComponent);


//Trabalho laboratorial 2
const chooseApp = Vue.component('chooseApp', chooseAppComponent);
const kubernetsHome = Vue.component('kubernetsHome', kubernetsHomeComponent);

//kubernetes
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
    el: "#app",
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
