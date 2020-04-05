require('./bootstrap');
//import 'bootstrap';

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    theme: "bubble",
    position: "top-right",
    duration: 5000,
    type: 'success'
});

import store from "./vuex.js";

import loginComponent from "./components/loginComponentBackuo.vue";
import homeComponent from "./components/homeComponent.vue";
import instanciasComponent from "./components/instancias.vue";
import dashboardComponent from "./components/dashboard.vue";
import newInstanceComponent from "./components/newInstance.vue";
import logoutComponent from "./components/logout.vue";
import newVolumeComponent from "./components/newVolume.vue";
import imagesComponent from "./components/images.vue";
import volumesComponent from "./components/volumes.vue";
import keyPairsComponent from "./components/keyPairs.vue";
import keyPairsDetailComponent from "./components/keyPairsDetail.vue";
import changeProjComponent from "./components/changeProj.vue";
import serverGroupComponent from "./components/serverGroups.vue";
import newServerGroupComponent from "./components/createServerGroup.vue";


const home = Vue.component('home', homeComponent);
const login = Vue.component('login', loginComponent);
const logout = Vue.component('logout', logoutComponent);
const instancias = Vue.component('instancias', instanciasComponent);
const dashboard = Vue.component('dashboard', dashboardComponent);
const newInstance = Vue.component('newInstance', newInstanceComponent);
const newVolume = Vue.component('newVolume', newVolumeComponent);
const images = Vue.component('images', imagesComponent);
const volumes = Vue.component('volumes', volumesComponent);
const keyPairs = Vue.component('keyPairs', keyPairsComponent);
const keyPairsDetail = Vue.component('keyPairsDetail', keyPairsDetailComponent);
const changeProj = Vue.component('changeProj', changeProjComponent);
const serverGroup = Vue.component('serverGroup', serverGroupComponent);
const newServerGroup = Vue.component('newServerGroup', newServerGroupComponent);




const routes = [
    { path: '/', component: homeComponent },
    { path: '/login', component: login, name: "login" },
    { path: '/instances', component: instancias, name: "instancias"},
    { path: '/home', component: dashboard, name: "dashboard"},
    { path: '/newInstance', component: newInstance, name: "newInstance"},
    { path: '/volumes', component: volumes, name: "volumes"},
    { path: '/logout', component: logout, name:"logout"},
    { path: '/newVolume', component: newVolume, name:"newVolume"},
    { path: '/images', component: images, name:"images"},
    { path: '/keyPairs', component: keyPairs, name:"keyPairs"},
    { path: '/keyPairsDetail', component: keyPairsDetail, name:"keyPairsDetail"},
    { path: '/changeProj',  props: true, component: changeProj, name:"changeProj"},
    { path: '/serverGroup', component: serverGroup, name:"serverGroup"},
    { path: '/createServerGroup', component: newServerGroup, name:"newServerGroup"},


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
      },
}
});
