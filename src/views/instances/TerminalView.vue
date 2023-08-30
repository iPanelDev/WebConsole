<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import Console from "@/components/Console.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";
import { useServiceStore } from "@/service/store";
import {
    mdiAlertCircle,
    mdiConsoleLine,
    mdiFullscreen,
    mdiFullscreenExit,
    mdiTrashCan,
} from "@mdi/js";
import { ref } from "vue";

const serviceStore = useServiceStore();

const isFullscreen = ref(false);
const sectionElRef = ref<{ el: HTMLElement }>();

function requestFullscreen() {
    sectionElRef.value.el?.requestFullscreen();
}

function exitFullscreen() {
    document.exitFullscreen();
}

document.onfullscreenchange = () =>
    (isFullscreen.value = document.fullscreenElement !== null);
</script>

<template>
    <LayoutOfInstance>
        <SectionMain ref="sectionElRef" class="bg-gray-50 dark:bg-slate-800">
            <NotificationBar
                color="danger"
                :icon="mdiAlertCircle"
                v-if="serviceStore.currentUser?.level != 3"
            >
                <b>权限不足</b>
                你没有权限使用这个页面
            </NotificationBar>
            <SectionTitleLineWithButton
                :icon="mdiConsoleLine"
                title="系统终端"
                main
            >
                <div class="flex">
                    <BaseButton
                        class="mr-3"
                        :icon="mdiTrashCan"
                        color="whiteDark"
                        title="清屏"
                    />
                    <BaseButton
                        v-if="isFullscreen"
                        :icon="mdiFullscreenExit"
                        color="whiteDark"
                        @click="exitFullscreen"
                        title="全屏"
                    />
                    <BaseButton
                        v-else
                        :icon="mdiFullscreen"
                        color="whiteDark"
                        @click="requestFullscreen"
                        title="退出全屏"
                    />
                </div>
            </SectionTitleLineWithButton>
            <CardBox has-component-layout class="overflow-hidden mb-5">
                <Console :datas="[]" />
            </CardBox>
        </SectionMain>
    </LayoutOfInstance>
</template>
