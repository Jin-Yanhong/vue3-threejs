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
        show: true,
    },
    children: [
        {
            path: '1',
            name: '01-basic-mesh-material',
            meta: {
                title: '01-basic-mesh-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/01-basic-mesh-material.vue'),
        },
        {
            path: '2',
            name: '02-depth-material',
            meta: {
                title: '02-depth-material TODO',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/02-depth-material.vue'),
        },
        {
            path: '3',
            name: '03-combined-material',
            meta: {
                title: '03-combined-material  TODO',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/03-combined-material.vue'),
        },
        {
            path: '4',
            name: '04-mesh-normal-material',
            meta: {
                title: '04-mesh-normal-material  TODO',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/04-mesh-normal-material.vue'),
        },
        {
            path: '5',
            name: '05-mesh-face-material',
            meta: {
                title: '05-mesh-face-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/05-mesh-face-material.vue'),
        },
        {
            path: '6',
            name: '06-mesh-lambert-material',
            meta: {
                title: '06-mesh-lambert-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/06-mesh-lambert-material.vue'),
        },
        {
            path: '7',
            name: '07-mesh-phong-material',
            meta: {
                title: '07-mesh-phong-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/07-mesh-phong-material.vue'),
        },
        {
            path: '8',
            name: '08-mesh-toon-material',
            meta: {
                title: '08-mesh-toon-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/08-mesh-toon-material.vue'),
        },
        {
            path: '9',
            name: '09-mesh-standard-material',
            meta: {
                title: '09-mesh-standard-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/09-mesh-standard-material.vue'),
        },
        {
            path: '10',
            name: '10-mesh-physical-material',
            meta: {
                title: '10-mesh-physical-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/10-mesh-physical-material.vue'),
        },
        {
            path: '11',
            name: '11-shader-material',
            meta: {
                title: '11-shader-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/11-shader-material.vue'),
        },
        {
            path: '12',
            name: '12-line-material',
            meta: {
                title: '12-line-material',
                icon: 'Document',
                cache: true,
                show: true,
            },
            component: () => import('@/views/chapter-04/12-line-material.vue'),
        },
    ],
};

export default chapter04;
