import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vuetify from 'vuetify'
import store from './store'

import defaultLayout from './layout/defaultLayout.vue'
import MainPage from './view/main'
import Login from './view/login.vue'
import Join from './view/join.vue'
import Find from './view/find.vue'

import Trip from './view/trip.vue';

import qnaMain from './view/qnaMain.vue'
import qnaWrite from './view/qnaWrite.vue'
import qnaContent from './view/qnaContent'

const routes = [
    {
        path: '/',
        name: 'defaultLayout',
        component: defaultLayout,
        children: [
            {
                path: '/',
                component: MainPage,
            },
        {
            path: '/login',
            component: Login,
        }
        ,
        {
            path: '/join',
            component: Join,
        },
        {
            path: '/find',
            component: Find,
        },
        {
            path:'/trip/:name/:id',
            component: Trip
        },
        {
            path: '/qnamain',
            component: qnaMain,
        },
        {
            path: '/qnawrite',
            component: qnaWrite,
        },
        {
            path: '/qnamain/qnacontent',
            component:qnaContent,
        },
       
    ]}]


window.Kakao.init('79eb0be4a08b223b4a5553fe99835470');

const router = createRouter({
    history: createWebHistory(),
    routes
});

const app = createApp(App)
app.use(router);
app.use(store);
app.use(VueSweetalert2);
app.use(Vuetify);
app.mount('#app')