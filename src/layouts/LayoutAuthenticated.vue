<script setup lang="ts">
import AsideMenu from "@/components/AsideMenu.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import FooterBar from "@/components/FooterBar.vue";
import LoginLayer from "@/components/LoginLayer.vue";
import NavBar from "@/components/NavBar.vue";
import NavBarItemPlain from "@/components/NavBarItemPlain.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import adminSidebar from "@/menus/adminSidebar";
import commonSidebar from "@/menus/commonSidebar";
import navbar from "@/menus/navbar";
import { logout } from "@/service";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { useStyleStore } from "@/style";
import { mdiAlert, mdiBackburger, mdiForwardburger, mdiMenu } from "@mdi/js";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const layoutAsidePadding = "xl:pl-60";

const styleStore = useStyleStore();
const connectionStore = useConnectionStore();

const router = useRouter();

const isAsideMobileExpanded = ref(false);
const isAsideLgActive = ref(false);

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
    useServiceStore().currentUser?.level === 3
        ? [].concat(commonSidebar, adminSidebar)
        : commonSidebar
);
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
        class="pt-14 min-h-screen w-full transition-position lg:w-auto"
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
            @menu-click="menuClick"
            @aside-lg-close-click="isAsideLgActive = false"
        />
        <NotificationBar
            v-if="connectionStore.state !== 1 && connectionStore.hasVerified"
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
            >
                重新登录
            </router-link>
            后重试
        </NotificationBar>
        <slot />
        <FooterBar />
    </div>
</template>
