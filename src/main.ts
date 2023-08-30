import { createApp } from "vue";
import { createPinia } from "pinia";

// @ts-expect-error
import App from "./App.vue";
import router from "./router";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { useStyleStore } from "@/style";

import "./css/main.css";

/* 初始化 Pinia */
const pinia = createPinia();

/* 初始化 Pinia stores */
useServiceStore(pinia);
useConnectionStore(pinia);
const styleStore = useStyleStore(pinia);

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");

if (
    (!localStorage["ipanel.darkMode"] &&
        window.matchMedia("(prefers-color-scheme: dark)").matches) ||
    localStorage["ipanel.darkMode"] === "1"
) {
    styleStore.setDarkMode(true);
}
