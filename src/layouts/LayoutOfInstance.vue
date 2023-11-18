<script setup lang="ts">
import AsideMenu from "@/components/AsideMenu.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import FooterBar from "@/components/FooterBar.vue";
import LoginLayer from "@/components/LoginLayer.vue";
import NavBar from "@/components/NavBar.vue";
import NavBarItemPlain from "@/components/NavBarItemPlain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import instanceSidebar from "@/menus/instanceSidebar";
import navbar from "@/menus/navbar";
import { createNotify } from "@/notification";
import {
    callWhenLogined,
    logout,
    subscirbe,
    updateInstancesInfo,
} from "@/service";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { State } from "@/service/types";
import { useStyleStore } from "@/style";
import {
    mdiAlert,
    mdiArrowLeft,
    mdiBackburger,
    mdiConsoleLine,
    mdiFile,
    mdiForwardburger,
    mdiMenu,
} from "@mdi/js";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const layoutAsidePadding = "xl:pl-60";

const styleStore = useStyleStore();
const connectionStore = useConnectionStore();

const router = useRouter();

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

const backToOverview = {
    label: "返回总览",
    icon: mdiArrowLeft,
    color: "info",
    isLogout: true,
    to: "/overview",
};

router.beforeEach(() => {
    isAsideMobileExpanded.value = false;
    isAsideLgActive.value = false;
});

const menuClick = (event, item) => {
    if (item.isToggleLightDark) {
        styleStore.setDarkMode();
    } else if (item.isLogout) {
        logout();
    }
};

const siderbar = computed(() =>
    useServiceStore().currentUser?.level === 2
        ? instanceSidebar.concat([
              {
                  to: "./terminal",
                  label: "系统终端",
                  icon: mdiConsoleLine,
              },
          ])
        : useServiceStore().currentUser?.level === 3
        ? instanceSidebar.concat([
              {
                  to: "./filesManager",
                  label: "文件管理",
                  icon: mdiFile,
              },
              {
                  to: "./terminal",
                  label: "系统终端",
                  icon: mdiConsoleLine,
              },
          ])
        : instanceSidebar
);

const online = ref(true);
const instanceId = useRoute().params["instanceId"] as string;
const timer = setInterval(update, 5000);

subscirbe(instanceId);
callWhenLogined(() => subscirbe(instanceId));
callWhenLogined(update);
onMounted(update);
onBeforeUnmount(() => clearInterval(timer));

async function update() {
    const state = await updateInstancesInfo(instanceId);
    if (typeof state !== "boolean") {
        return;
    }
    if (state && !online.value) {
        createNotify({ title: "实例已恢复", type: "success" });
    }
    online.value = state;
}
</script>

<template>
    <LoginLayer />
    <div
        :class="[
            layoutAsidePadding,
            {
                'ml-60 lg:ml-0': isAsideMobileExpanded,
                'overflow-hidden lg:overflow-visible': isAsideMobileExpanded,
            },
        ]"
        class="pt-14 min-h-screen w-full transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100"
    >
        <NavBar
            :menu="navbar"
            :class="[
                layoutAsidePadding,
                { 'ml-60 lg:ml-0': isAsideMobileExpanded },
            ]"
            @menu-click="menuClick"
        >
            <NavBarItemPlain
                display="flex lg:hidden"
                @click.prevent="isAsideMobileExpanded = !isAsideMobileExpanded"
            >
                <BaseIcon
                    :path="
                        isAsideMobileExpanded ? mdiBackburger : mdiForwardburger
                    "
                    size="24"
                />
            </NavBarItemPlain>
            <NavBarItemPlain
                display="hidden lg:flex xl:hidden"
                @click.prevent="isAsideLgActive = true"
            >
                <BaseIcon :path="mdiMenu" size="24" />
            </NavBarItemPlain>
        </NavBar>
        <AsideMenu
            :is-aside-mobile-expanded="isAsideMobileExpanded"
            :is-aside-lg-active="isAsideLgActive"
            :menu="siderbar"
            :bottom-item="backToOverview"
            @aside-lg-close-click="isAsideLgActive = false"
        />
        <NotificationBar
            v-if="!/^[a-z0-9]{32}$/.test(instanceId)"
            color="warning"
            :icon="mdiAlert"
            class="m-6"
        >
            <b>当前页面路径异常</b>
            请尝试
            <router-link to="/overview" replace> 重新选择实例 </router-link>
        </NotificationBar>
        <NotificationBar
            v-else-if="connectionStore.state !== State.logined"
            color="warning"
            :icon="mdiAlert"
            class="m-6"
        >
            <b>连接异常</b>
            请尝试
            <router-link
                :to="{
                    name: 'login',
                    query: { redirect: $route.fullPath },
                }"
                replace
            >
                重新登录
            </router-link>
            后重试
        </NotificationBar>

        <NotificationBar
            v-else-if="!online"
            color="warning"
            :icon="mdiAlert"
            class="m-6"
        >
            <b>实例信息获取异常</b>
            此实例可能已经断开或不存在
        </NotificationBar>
        <slot />
        <FooterBar />
    </div>
</template>
