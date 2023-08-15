<script setup lang="ts">
import { mdiClose } from "@mdi/js";
import { useStyleStore } from "@/style";
import AsideMenuList from "@/components/AsideMenuList.vue";
import AsideMenuItem from "@/components/AsideMenuItem.vue";
import BaseIcon from "@/components/BaseIcon.vue";

defineProps({
    menu: {
        type: Array,
        required: true,
    },
    bottomItem: {
        type: Object,
    },
});

const emit = defineEmits(["menu-click", "aside-lg-close-click"]);

const styleStore = useStyleStore();

const menuClick = (event, item) => {
    emit("menu-click", event, item);
};

const asideLgCloseClick = (event) => {
    emit("aside-lg-close-click", event);
};
</script>

<template>
    <aside
        id="aside"
        class="lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position"
    >
        <div
            :class="styleStore.asideStyle"
            class="shadow lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900 bg-slate-50"
        >
            <div
                :class="styleStore.asideBrandStyle"
                class="flex flex-row h-14 items-center justify-between dark:bg-slate-900"
            >
                <div class="flex-1 xl:pl-0 flex justify-center">
                    <img
                        src="/src/assets/icon.png"
                        class="inline mr-3 select-none"
                        style="image-rendering: pixelated"
                    />
                    <b class="font-black break-keep">iPanel 网页控制台</b>
                </div>
                <button
                    class="hidden lg:inline-block xl:hidden p-3"
                    @click.prevent="asideLgCloseClick"
                >
                    <BaseIcon :path="mdiClose" />
                </button>
            </div>
            <div
                :class="
                    styleStore.darkMode
                        ? 'aside-scrollbars-[slate]'
                        : styleStore.asideScrollbarsStyle
                "
                class="flex-1 overflow-y-auto overflow-x-hidden"
            >
                <AsideMenuList :menu="menu" @menu-click="menuClick" />
            </div>

            <ul>
                <AsideMenuItem
                    v-if="bottomItem && Object.keys(bottomItem).length"
                    :item="bottomItem"
                    @menu-click="menuClick"
                />
            </ul>
        </div>
    </aside>
</template>
