import { createApp } from "vue";
import { createPinia } from "pinia";

// @ts-expect-error
import App from "./App.vue";
import router from "./router";
import { useServiceStore } from "@/service/store";
import { useStyleStore } from "@/style";

import "./css/main.css";

/* Init Pinia */
const pinia = createPinia();

/* Init Pinia stores */
useServiceStore(pinia);
const styleStore = useStyleStore(pinia);

/* Create Vue app */
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
