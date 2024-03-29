import { RouteRecordRaw } from 'vue-router';

export const chapter03: Array<RouteRecordRaw> = [
    {
        path: '/chapter-03',
        name: 'chapter-03',
        component: () => import('@/layout/index.vue'),
        redirect: '/chapter-03/1',
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
            {
                path: '2',
                name: '02-spot-light',
                meta: {
                    title: '02-spot-light',
                    icon: 'Document',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-03/02-spot-light.vue'),
            },
            {
                path: '3',
                name: '03-point-light',
                meta: {
                    title: '03-point-light',
                    icon: 'Document',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-03/03-point-light.vue'),
            },
            {
                path: '4',
                name: '04-directional-light',
                meta: {
                    title: '04-directional-light',
                    icon: 'Document',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-03/04-directional-light.vue'),
            },
            {
                path: '5',
                name: '05-hemisphere-light',
                meta: {
                    title: '05-hemisphere-light',
                    icon: 'Document',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-03/05-hemisphere-light.vue'),
            },
            {
                path: '6',
                name: '06-area-light',
                meta: {
                    title: '06-area-light TODO',
                    icon: 'Document',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-03/06-area-light.vue'),
            },
            {
                path: '7',
                name: '07-lensflares',
                meta: {
                    title: '07-lensflares TODO',
                    icon: 'Document',
                    cache: true,
                    show: true,
                },
                component: () => import('@/views/chapter-03/07-lensflares.vue'),
            },
        ],
    },
];
