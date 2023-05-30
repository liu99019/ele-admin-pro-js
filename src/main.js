import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import App from './App.vue';
import store from './store';
import router from './router';
import permission from './utils/permission';
import i18n from './i18n';
import './styles/index.less';
import 'element-plus/theme-chalk/index.css'
const app = createApp(App);

app.use(store);
app.use(router);
app.use(permission);
app.use(i18n);
app.use(ElementPlus)

app.mount('#app');
