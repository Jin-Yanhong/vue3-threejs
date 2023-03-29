import { createApp } from 'vue';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import router from './router/index';
import App from './App.vue';

import 'normalize.css';
import '@/assets/style/reset.less'; // css reset
import 'element-plus/dist/index.css'; // ElementPlus style
import '@/assets/style/global.less';

const app = createApp(App);

const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(ElementPlus);

app.mount('#app');

