<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { clearOutputsMap } from "@/service/serverControler";
import { getSettings, saveSettings } from "@/utils/settingsManager";
import { mdiCog, mdiGithub, mdiTrashCan } from "@mdi/js";
import { reactive, watch } from "vue";

const size = localStorage["ipanel.outputs"]
    ? new Blob([localStorage["ipanel.outputs"]]).size
    : 0;

function clearLocalStorage() {
    if (confirm("确定要删除所有缓存吗")) {
        localStorage.clear();
    }
}

const settings = reactive(getSettings());

watch(
    () => settings,
    () => saveSettings(settings),
    { deep: true }
);
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiCog" title="设置" main />
            <CardBox class="my-3">
                <div class="text-xl font-bold mb-5">通用实例设置</div>

                <FormField help="关闭后控制台将去除所有颜色">
                    <FormCheckRadio
                        type="switch"
                        name="colorfulOutput"
                        v-model="settings.colorfulOutput"
                        label="彩色输出"
                        :input-value="true"
                    />
                </FormField>

                <FormField help="推荐开启，关闭后关闭网页不能恢复控制台输出">
                    <FormCheckRadio
                        type="switch"
                        name="saveOutput"
                        v-model="settings.saveOutput"
                        label="保存输出"
                        :input-value="true"
                    />
                </FormField>
                <FormField label="每个实例最大输出缓存行数" help="默认值: 500">
                    <FormControl
                        type="number"
                        autocomplete="off"
                        min="0"
                        v-model="settings.maxCacheLines"
                    />
                </FormField>

                <div class="flex items-center">
                    <BaseButton
                        label="清除输出缓存"
                        color="lightdark"
                        :icon="mdiTrashCan"
                        @click="clearOutputsMap"
                    />
                    <span
                        class="text-gray-500 dark:text-slate-400 mx-1 flex text-xs"
                    >
                        目前输出的缓存大小约为{{ (size / 1024).toFixed(2) }}KB
                    </span>
                </div>
            </CardBox>

            <CardBox class="my-3">
                <div class="text-xl font-bold mb-5">网页设置</div>
                <FormField
                    help="❗ 此操作将丢失登录信息、清除所有输出缓存与命令历史记录并重置主题"
                >
                    <BaseButton
                        label="清除所有缓存"
                        color="danger"
                        :icon="mdiTrashCan"
                        @click="clearLocalStorage"
                    />
                </FormField>
            </CardBox>

            <CardBox class="my-3">
                <div class="text-xl font-bold mb-5">版权信息</div>
                <FormField
                    help="如果这个软件对你有帮助的话，不妨点个Star支持一下"
                >
                    <BaseButtons>
                        <BaseButton
                            href="https://github.com/iPanelDev/WebConsole"
                            target="_blank"
                            :icon="mdiGithub"
                            label="网页控制台"
                            color="contrast"
                            rounded-full
                            small
                        />
                        <BaseButton
                            href="https://github.com/iPanelDev/iPanel-Host"
                            target="_blank"
                            :icon="mdiGithub"
                            label="后端"
                            color="contrast"
                            rounded-full
                            small
                        />
                    </BaseButtons>
                </FormField>
                <div class="my-3">
                    此网页采用
                    <a
                        href="https://github.com/iPanelDev/WebConsole/blob/main/LICENSE"
                        target="_blank"
                        class="underline"
                    >
                        MIT许可证
                    </a>
                    发布。
                    <pre>©2023, iPanelDev</pre>
                </div>
            </CardBox>
        </SectionMain>
    </LayoutAuthenticated>
</template>
