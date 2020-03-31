require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import Toasted from 'vue-toasted';
Vue.use(Toasted, {
    theme: "bubble",
    position: "bottom-center",
    duration: 5000,
    type: 'success'
});

import store from "./vuex.js";

import loginComponent from "./components/loginComponent";
import homeComponent from "./components/homeComponent.vue";
import instanciasComponent from "./components/instanciasComponent.vue";
import dashboardComponent from "./components/dashboard.vue";
import newInstanceComponent from "./components/newInstance.vue";
import LogoutComponent from "./components/logout.vue";



const home = Vue.component('home', homeComponent);
const login = Vue.component('login', loginComponent);
const logout = Vue.component('logout', LogoutComponent);
const instancias = Vue.component('instancias', instanciasComponent);
const dashboard = Vue.component('dashboard', dashboardComponent);
const newInstance = Vue.component('newInstance', newInstanceComponent);




const routes = [
    { path: '/', component: homeComponent },
    { path: '/login', component: login, name: "login" },
    { path: '/instancias', component: instancias, name: "instancias"},
    { path: '/home', component: dashboard, name: "dashboard"},
    { path: '/newInstance', component: newInstance, name: "newInstance"},

];

const router = new VueRouter({
    routes,


});


new Vue({
    el: "#app",
    router,
    store

});
