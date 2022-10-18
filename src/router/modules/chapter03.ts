import Layout from '@/layout/index.vue';
import { RouteRecordRaw } from 'vue-router';

const chapter03: RouteRecordRaw = {
    path: '/chapter-03',
    name: 'chapter-03',
    component: Layout,
    meta: {
        title: 'Chapter - 03',
        icon: 'Folder',
        cache: true,
        show: true,
    },
    children: [
        {
            path: '1',
            name: '01-ambient-light',
            meta: {
                title: '01-ambient-light',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-03/01-ambient-light.vue'),
        },
    ],
};

export default chapter03;
