<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import { defaultIcons } from "@/notification";
import { jumpToOverview, prepareToLogin } from "@/service";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { State } from "@/service/types";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import { reactive } from "vue";

const serviceStore = useServiceStore();
const connectionStore = useConnectionStore();

const form = reactive({
    userName: serviceStore.userName,
    password: serviceStore.password,
    rememberPassword: serviceStore.rememberPassword,
    autoReconnect: serviceStore.autoReconnect,
});

const submit = () => {
    serviceStore.update(form);
    serviceStore.save();
    prepareToLogin();
};
</script>

<template>
    <CardBox
        is-form
        @submit.prevent="submit"
        class="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl"
    >
        <div class="text-2xl font-semibold mb-3">连接你的iPanel</div>

        <FormField
            label="用户名"
            help="你可以可在iPanel后端控制台通过命令'user create'创建"
        >
            <FormControl
                v-model="form.userName"
                :icon="mdiAccount"
                name="login"
                autocomplete="username"
            />
        </FormField>

        <FormField label="密码" help="此用户对应的密码">
            <FormControl
                v-model="form.password"
                :icon="mdiAsterisk"
                type="password"
                name="password"
                autocomplete="current-password"
            />
        </FormField>

        <FormCheckRadio
            class="mr-4"
            v-model="form.rememberPassword"
            name="remember"
            label="记住密码"
            :input-value="true"
        />

        <FormCheckRadio
            v-model="form.autoReconnect"
            name="autoReconnect"
            label="自动重连"
            :input-value="true"
        />

        <template #footer>
            <div class="flex items-center">
                <BaseButtons>
                    <BaseButton
                        v-if="connectionStore.state === State.logined"
                        color="info"
                        label="跳转到总览页面"
                        @click="jumpToOverview"
                    >
                    </BaseButton>
                    <BaseButton
                        type="submit"
                        color="info"
                        label="登录"
                        v-else
                    />
                    <div
                        class="text-sm text-gray-400 dark:text-gray-600 flex items-center"
                    >
                        <span
                            v-if="connectionStore.state === State.reconnecting"
                        >
                            正在重连中
                        </span>
                        <span
                            v-else-if="connectionStore.state === State.logined"
                        >
                            你已经登录了
                        </span>
                    </div>
                </BaseButtons>
            </div>
            <NotificationBar
                :icon="defaultIcons[connectionStore.noticeType] || ''"
                :color="connectionStore.noticeType"
                class="mt-4"
                v-if="connectionStore.notice"
            >
                <div class="mr-2 flex flex-col">
                    <div>
                        <b>连接时出现问题</b>
                    </div>
                    <div>{{ connectionStore.notice }}</div>
                </div>
            </NotificationBar>
        </template>
    </CardBox>
</template>
