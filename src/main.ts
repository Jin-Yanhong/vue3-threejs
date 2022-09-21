import ElementPlus from 'element-plus';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import 'element-plus/dist/index.css';
import 'normalize.css';
import './style/global.scss';

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.mount('#app');
