import Layout from '@/layout/index.vue';
import { RouteRecordRaw } from 'vue-router';

const chapter04: RouteRecordRaw = {
    path: '/chapter-04',
    name: 'chapter-04',
    component: Layout,
    meta: {
        title: 'Chapter - 04',
        icon: 'Folder',
        cache: true,
        show: true
    },
    children: [
        {
            path: '1',
            name: '01-basic-mesh-material',
            meta: {
                title: '01-basic-mesh-material',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-04/01-basic-mesh-material.vue')
        },
        {
            path: '2',
            name: '02-depth-material',
            meta: {
                title: '02-depth-material TODO',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-04/02-depth-material.vue')
        },
        {
            path: '3',
            name: '03-combined-material',
            meta: {
                title: '03-combined-material  TODO',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-04/03-combined-material.vue')
        },
        {
            path: '4',
            name: '04-mesh-normal-material',
            meta: {
                title: '04-mesh-normal-material  TODO',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-04/04-mesh-normal-material.vue')
        },
        {
            path: '5',
            name: '05-mesh-face-material',
            meta: {
                title: '05-mesh-face-material',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-04/05-mesh-face-material.vue')
        }
    ]
};

export default chapter04;
