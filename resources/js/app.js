require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
Vue.use(VueRouter);

import homeComponent from "./components/homeComponent";
const home = Vue.component('home', homeComponent);

 new Vue({
    el: "#app",

});