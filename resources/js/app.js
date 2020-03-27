require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import homeComponent from "./components/homeComponent";
import tokenComponent from "./components/token.vue";

const home = Vue.component('home', homeComponent);
const token = Vue.component('token', tokenComponent);

import loginComponent from "./components/loginComponent";
const login = Vue.component('login', loginComponent);

const routes = [
    { path: '/', component: homeComponent },
    { path: '/login', component: login, name: "login" },
    { path: '/token', component: token, name: "token"},

];

const router = new VueRouter({
    routes,

});


 new Vue({
    el: "#app",
    router

});
