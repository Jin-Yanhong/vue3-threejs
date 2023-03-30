import useUserStore from '@/store/user';
import NProgress from 'nprogress';
import { ElMessage } from 'element-plus';
import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { chapter01 } from './modules/chapter01';
import { chapter02 } from './modules/chapter02';
import { chapter03 } from './modules/chapter03';
import { chapter04 } from './modules/chapter04';
import settings from '@/settings';
import 'nprogress/nprogress.css';

const appName = settings.appConfig.name;
const whiteList = ['/login'];

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录',
            cache: true,
            show: false,
        },
        component: () => import('@/views/Login/index.vue'),
    },
    {
        path: '/',
        name: 'dashboard',
        redirect: '/chapter-01/2',
    },
    ...chapter01,
    ...chapter02,
    ...chapter03,
    ...chapter04,
    {
        path: '/redirect',
        component: () => import('@/views/Redirect/index.vue'),
    },
    {
        path: '/404',
        component: () => import('@/views/ErrorPage/4xx.vue'),
    },
    {
        path: '/:pathMatch(.*)*',
        redirect: '/404',
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    NProgress.start();
    if (useUserStore().getToken) {
        if (to.path === '/login') {
            next({ path: '/' });
            NProgress.done();
        } else {
            try {
                next();
            } catch (err: any) {
                useUserStore().handleLogout();
                ElMessage.error(err.message);
                next('/login');
                NProgress.done();
            }
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next(`/login?redirect=${to.path}`);
            NProgress.done();
        }
    }
});

router.afterEach((to: RouteLocationNormalized) => {
    NProgress.done();
    document.title = `${appName} - ${to.meta?.title}`;
});

export default router;
