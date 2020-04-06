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
        project:null,
        projectName:null,
        projectNames:[],
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

        setProject: (state, project) => {
            state.project = project;
            window.localStorage.setItem('project', project);

        },
        setProjectName: (state, projectName) => {
            state.projectName = projectName;
            window.localStorage.setItem('projectName', projectName);

        },
        setProjectNames: (state, projectNames) => {
            state.projectNames = projectNames;
            window.localStorage.setItem('projectNames', projectNames);

        },
        clearProject: state => {
            state.project = null;
            localStorage.removeItem("project");
        },
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
            state.project = null
            let token = localStorage.getItem("token");
            let user = localStorage.getItem("user");
            let project = localStorage.getItem("project");
            if (token) {
                state.token = token;
                axios.defaults.headers.common.Authorization = "Bearer " + token;
            } else {
                axios.defaults.headers.common.Authorization = undefined;
            }
            if (user) {
                state.user = JSON.parse(user);
            }
            if(project){
                state.project = project;
            }

        },
    }
});
