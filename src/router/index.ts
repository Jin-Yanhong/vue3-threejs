import AppMain from '@/layout/components/AppMain.vue';
import NProgress from 'nprogress';
import { createRouter, createWebHashHistory, RouteLocationNormalized, RouteRecordRaw } from 'vue-router';

import 'nprogress/nprogress.css';

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/Introduction',
        name: 'Introduction',
        component: () => import('@/views/Introduction.vue'),
        meta: {
            title: 'Introduction',
            cache: true,
            show: false,
        },
    },
    {
        path: '/chapter-01',
        name: 'Views',
        component: AppMain,
        meta: {
            title: 'Chapter - 01',
            index: 'Odometer',
            cache: true,
            show: true,
        },
        children: [
            {
                path: '1',
                name: 'chapter-01-1',
                meta: {
                    title: '起个标题',
                    icon: 'PieChart',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-01/1.vue'),
            },
        ],
    },

    // 匹配不到页面返回 dashboard
    {
        path: '/:pathMatch(.*)*',
        name: 'redirect',
        redirect: '/Introduction',
        meta: {
            show: false,
        },
    },
];

const router = createRouter({
    history: createWebHashHistory(process.env.BASE_URL),
    routes,
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
