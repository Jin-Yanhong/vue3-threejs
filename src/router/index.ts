import NProgress from 'nprogress';
import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

import 'nprogress/nprogress.css';

import chapter01 from './modules/chapter01';
import chapter02 from './modules/chapter02';
import chapter03 from './modules/chapter03';

export const routes: Array<RouteRecordRaw> = [
    chapter01,
    chapter02,
    chapter03,
    // 匹配不到页面返回 dashboard
    {
        path: '/:pathMatch(.*)*',
        name: 'redirect',
        redirect: '/chapter-01/2',
        meta: {
            show: false
        }
    }
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes
});

router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized, next) => {
    NProgress.start();
    next();
    NProgress.done();
});

router.afterEach((to: RouteLocationNormalized) => {
    NProgress.done();
    document.title = 'Vue3 💕 Three.js' + ' | ' + to.meta?.title;
});
export default router;
