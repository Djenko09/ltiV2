require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import homeComponent from "./components/homeComponent";
const home = Vue.component('home', homeComponent);

import loginComponent from "./components/loginComponent";
const login = Vue.component('login', loginComponent);

const routes = [
    { path: '/', component: homeComponent },
    { path: '/login', component: login, name: "login" }

];

const router = new VueRouter({
    routes,

});


 new Vue({
    el: "#app",
    router

});