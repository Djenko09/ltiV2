require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import store from "./vuex.js";

import homeComponent from "./components/homeComponent";
import instanciasComponent from "./components/instanciasComponent.vue";

const home = Vue.component('home', homeComponent);
const token = Vue.component('instancias', instanciasComponent);

import loginComponent from "./components/loginComponent";
const login = Vue.component('login', loginComponent);

const routes = [
    { path: '/', component: homeComponent },
    { path: '/login', component: login, name: "login" },
    { path: '/instancias', component: token, name: "instancias"},

];

const router = new VueRouter({
    routes,
   

});


new Vue({
    el: "#app",
    router,
    store

});
