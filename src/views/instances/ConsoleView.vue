<script setup lang="ts">
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";
import { useServiceStore } from "@/service/store";

import BaseButton from "@/components/BaseButton.vue";
import CardBox from "@/components/CardBox.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import Console from "@/components/Console.vue";
import FormControl from "@/components/FormControl.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import {
    clearInputHistory,
    clearOutputsMap,
    input,
    inputHistory,
    inputHistoryRef,
    kill,
    start,
    stop,
} from "@/service/serverControler";
import {
    mdiArrowUp,
    mdiConsole,
    mdiFullscreen,
    mdiFullscreenExit,
    mdiPause,
    mdiPlay,
    mdiStop,
    mdiTrashCan,
} from "@mdi/js";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const instanceId = useRoute().params["instanceId"] as string;

const serviceStore = useServiceStore();

const datas = computed(() => serviceStore.outputs.get(instanceId) || []);

const status = computed(
    () => serviceStore.instances.get(instanceId)?.shortInfo.server_status
);

const inputRef = ref("");
const isModalActive = ref(false);
const sectionElRef = ref<{ el: HTMLElement }>();
const inputElRef = ref<{ inputEl: HTMLElement }>();

const isFullscreen = ref(false);

function requestFullscreen() {
    sectionElRef.value.el?.requestFullscreen();
}

function exitFullscreen() {
    document.exitFullscreen();
}

document.onfullscreenchange = () =>
    (isFullscreen.value = document.fullscreenElement !== null);

/**
 * 命令历史记录下标
 */
const index = ref(-1);

/**
 * 更新下标
 * @param change
 */
function updateIndex(change: number = 1) {
    index.value += change;

    if (index.value > inputHistory.length) index.value = inputHistory.length;
    else if (index.value <= -1) index.value = -1;

    inputRef.value = inputHistory[index.value] || "";
}

/**
 * 发送命令
 */
function send() {
    if (!status.value) return;

    index.value = 0;
    input(inputRef.value);
    inputRef.value = "";
    inputElRef.value.inputEl.focus();
}
</script>
<template>
    <LayoutOfInstance>
        <CardBoxModal
            v-model="isModalActive"
            title="确定要强制结束进程吗"
            button-label="确认"
            has-cancel
            @confirm="kill"
        >
            此操作可能导致存档损坏等问题
        </CardBoxModal>
        <SectionMain ref="sectionElRef" class="bg-gray-50 dark:bg-slate-800">
            <SectionTitleLineWithButton :icon="mdiConsole" title="控制台" main>
                <div class="flex">
                    <BaseButton
                        class="mr-3"
                        :icon="mdiTrashCan"
                        color="whiteDark"
                        title="清屏"
                        @click="() => clearOutputsMap(instanceId)"
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
                <Console :datas="datas" />
            </CardBox>

            <div class="flex mb-3">
                <FormControl
                    ref="inputElRef"
                    class="w-full mr-5"
                    v-model="inputRef"
                    inputmode="text"
                    autocomplete="none"
                    placeholder="在此输入命令..."
                    title="你可以使用上下键切换历史输入"
                    @keyup.enter.stop="send"
                    @keyup.up="updateIndex(1)"
                    @keyup.down="updateIndex(-1)"
                />
                <BaseButton
                    :icon="mdiArrowUp"
                    color="lightDark"
                    outline
                    @click="send"
                />
            </div>

            <div class="mb-3 md:flex w-full">
                <CardBox is-hoverable class="md:mr-4 m-2 md:w-min select-none">
                    <BaseButton
                        class="w-full"
                        :icon="mdiPlay"
                        color="contrast"
                        outline
                        label="启动"
                        :disabled="status"
                        @click="start"
                    />
                    <BaseButton
                        class="w-full my-3"
                        :icon="mdiPause"
                        outline
                        color="contrast"
                        label="停止"
                        :disabled="!status"
                        @click="stop"
                    />
                    <BaseButton
                        class="w-full"
                        :icon="mdiStop"
                        outline
                        color="danger"
                        label="强制结束"
                        :disabled="!status"
                        @click="() => (isModalActive = true)"
                    />
                </CardBox>

                <CardBox is-hoverable class="w-full m-2">
                    <h1 class="text-lg flex items-center mb-3 justify-between">
                        输入历史
                        <BaseButton
                            :icon="mdiTrashCan"
                            color="whiteDark"
                            title="清空历史"
                            @click="clearInputHistory"
                        />
                    </h1>
                    <div>
                        <span
                            v-for="line in inputHistoryRef || []"
                            class="p-1.5 mx-1 break-all hover:bg-gray-100 hover:dark:bg-slate-800 rounded cursor-point select-all inline-block"
                            @click="inputRef = line"
                        >
                            {{ line }}
                        </span>
                    </div>
                </CardBox>
            </div>
        </SectionMain>
    </LayoutOfInstance>
</template>
