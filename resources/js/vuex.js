import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
    key: 'vuex',
    storage: window.localStorage
});

export default  new Vuex.Store({

    state: {
        token: "",
        user: null,
       // password: "",

    },

    getters: {
        isAuthenticated: state => !state.token,
        authStatus: state => state.status,
      },

    mutations: {
        clearUserAndToken: (state) => {
            state.user = null;
            state.token = "";
            window.localStorage.removeItem('user');
            window.localStorage.removeItem('token');
            axios.defaults.headers.common.Authorization = undefined;


        },
        setToken: (state, token) => {
            state.token = token;
            window.localStorage.setItem('token', token);
            axios.defaults.headers.common.Authorization = "Bearer " + token;
        },
        /*
        setPassword: (state, password) => {
            state.password = password;
            window.localStorage.setItem('password', password);
          
        },*/
        clearUser: state => {
            state.user = null;
            localStorage.removeItem("user");
        },
        clearToken: (state) => {
            state.token = "";
            window.localStorage.removeItem('token');
            axios.defaults.headers.common.Authorization = undefined;
        },

        setUser: (state, user) => {
            state.user = user;
            window.localStorage.setItem('user', JSON.stringify(user));

        },
        loadTokenAndUserFromSession: state => {
            state.token = "";
            state.user = null;
            let token = localStorage.getItem("token");
            let user = localStorage.getItem("user");
            if (token) {
                state.token = token;
                axios.defaults.headers.common.Authorization = "Bearer " + token;
            } else {
                axios.defaults.headers.common.Authorization = undefined;
            }
            if (user) {
                state.user = JSON.parse(user);
            }
        },
    }
});
