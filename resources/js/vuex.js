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
        password: null,
        project:null,
        projectName:null,
        projectNames:[],

        //TL 2
        namespace: null
    },

    app: {
      name:null,
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
        setApp:(app, appName)=>{
          app.name = appName
          window.localStorage.setItem('appName', appName);

        },
        setToken: (state, token) => {
            state.token = token;
            window.localStorage.setItem('token', token);
            axios.defaults.headers.common.Authorization = token;
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
        setPassword: (state, password) => {
          state.password = password;
          window.localStorage.setItem('password', password);
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
        //TL2
        setNameSpace: (state, namespace) => {
            state.namespace = namespace;
            window.localStorage.setItem('namespace', namespace);

        },
        clearNameSpace: state => {
            state.namespace = null;
            localStorage.removeItem("namespace");
        },
        loadTokenAndUserFromSession: state => {
            state.token = "";
            state.user = null;
            state.project = null
            state.namespace = null
            let token = localStorage.getItem("token");
            let user = localStorage.getItem("user");
            let project = localStorage.getItem("project");
            let namespace = localStorage.getItem("namespace");
            if (token) {
                state.token = token;
                axios.defaults.headers.common.Authorization = token;
            } else {
                axios.defaults.headers.common.Authorization = undefined;
            }
            if (user) {
                state.user = JSON.parse(user);
            }
            if(project){
                state.project = project;
            }
            if(namespace){
                state.namespace = namespace;
            }

        },
    }
});
