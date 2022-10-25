import Layout from '@/layout/index.vue';
import {RouteRecordRaw} from 'vue-router';

const chapter01: RouteRecordRaw = {
    path: '/chapter-01',
    name: 'chapter-01',
    component: Layout,
    meta: {
        title: 'Chapter - 01',
        icon: 'Folder',
        cache: true,
        show: true
    },
    children: [
        {
            path: '2',
            name: '02-first-scene',
            meta: {
                title: '02-first-scene',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-01/02-first-scene.vue')
        },
        {
            path: '3',
            name: '03-materials-light',
            meta: {
                title: '03-materials-light',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-01/03-materials-light.vue')
        },
        {
            path: '4',
            name: '04-materials-light-animation',
            meta: {
                title: '04-materials-light-animation',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-01/04-materials-light-animation.vue')
        },
        {
            path: '5',
            name: '05-control-gui',
            meta: {
                title: '05-control-gui',
                icon: 'Document',
                cache: true,
                show: true
            },
            component: () => import('@/views/chapter-01/05-control-gui.vue')
        }
    ]
};

export default chapter01;
