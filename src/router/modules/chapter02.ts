import Layout from '@/layout/index.vue';
import { RouteRecordRaw } from 'vue-router';

const chapter02: RouteRecordRaw = {
    path: '/chapter-02',
    name: 'chapter-02',
    component: Layout,
    meta: {
        title: 'Chapter - 02',
        icon: 'Folder',
        cache: true,
        show: true,
    },
    children: [
        {
            path: '',
            name: '01-basic-scene',
            meta: {
                title: '01-basic-scene',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-02/01-basic-scene.vue'),
        },
        {
            path: '2',
            name: '02-foggy-scene',
            meta: {
                title: '02-foggy-scene',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-02/02-foggy-scene.vue'),
        },
        {
            path: '3',
            name: '03-forced-materials',
            meta: {
                title: '03-forced-materials',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-02/03-forced-materials.vue'),
        },
        {
            path: '4',
            name: '04-geometries',
            meta: {
                title: '04-geometries',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-02/04-geometries.vue'),
        },
        {
            path: '5',
            name: '05-custom-geometry',
            meta: {
                title: '05-custom-geometry',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-02/05-custom-geometry.vue'),
        },
    ],
};

export default chapter02;
