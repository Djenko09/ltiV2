require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import store from "./vuex.js";

import loginComponent from "./components/loginComponent";
import homeComponent from "./components/homeComponent.vue";
import instanciasComponent from "./components/instanciasComponent.vue";
import dashboardComponent from "./components/dashboard.vue";

const home = Vue.component('home', homeComponent);
const login = Vue.component('login', loginComponent);
const instancias = Vue.component('instancias', instanciasComponent);
const dashboard = Vue.component('dashboard', dashboardComponent);




const routes = [
    { path: '/', component: homeComponent },
    { path: '/login', component: login, name: "login" },
    { path: '/instancias', component: instancias, name: "instancias"},
    { path: '/home', component: dashboard, name: "dashboard"},

];

const router = new VueRouter({
    routes,


});


new Vue({
    el: "#app",
    router,
    store

});
