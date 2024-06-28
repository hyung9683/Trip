import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import Vuetify from 'vuetify'
import store from './store'

import defaultLayout from './layout/defaultLayout.vue'
import MyPageLayout from './layout/mypageLayout'

import MainPage from './view/main'
import Login from './view/login.vue'
import Join from './view/join.vue'
import Find from './view/find.vue'

import MyPage from './mypage/mypage.vue'
import QnaPage from './mypage/qnapage.vue'
import ContentPage from './mypage/contentpage.vue'
import LikePage from './mypage/likepage.vue'
import ReviewPage from './mypage/reviewpage.vue'
import MyPageUpdate from './mypage/mypageupdate.vue'
import Pass from './mypage/passwd.vue'

import Trip from './view/trip.vue';
import Fes from './view/festival.vue';

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
            {
                path: '/fes/:name/:id',
                component:Fes,
            }
       
    ]
},
    {
    
    path: '/mypage/',
    name: 'mypagelayout',
    component: MyPageLayout,
    children: [
        {
            path: '',
            component: MyPage,
        },
        {
            path: 'likepage',
            component: LikePage,
        },
        {
            path: 'reviewpage',
            component: ReviewPage,
        },
        {
            path: 'contentpage',
            component: ContentPage,
        },
        {
            path: 'qnapage',
            component: QnaPage,
        },
        {
            path: 'update',
            component: MyPageUpdate,
        },
        {
            path: 'passwd',
            component: Pass,
        }
    ]}
    
]


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