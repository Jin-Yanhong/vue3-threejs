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
      path: '2',
      name: '01-basic-scene',
      meta: {
        title: '01-basic-scene',
        icon: 'Document',
        cache: true,
        show: true,
      },
      component: () => import('@/views/chapter-02/01-basic-scene.vue'),
    },
  ],
};

export default chapter02;
