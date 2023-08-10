import './assets/main.css';

import { ComponentPublicInstance, createApp } from 'vue';

// @ts-ignore
import App from './App.vue';

import { VERSION } from '@/meta';
import { createNotify } from '@/notification';
import router from '@/router';
import VueFeather from 'vue-feather';

const app = createApp(App);

app.use(router);
app.mount('#app');
app.component(VueFeather.name, VueFeather);
app.config.errorHandler = (err: any, _: ComponentPublicInstance | null, info: string) => {
    createNotify({
        type: 'error',
        title: '唔..发生了一点错误',
        message: `${info} \n${String(err)}`,
        duration: -1
    });
};
console.log(`iPanel WebConsole@${VERSION} is loaded. For more infomation, please see https://github.com/Zaitonn/iPanel or https://ipanel.serein.cc/ . Copyright © 2022 Zaitonn. All Rights Reserved.`);