<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { connect, disconnect } from "@/service/webSocket";
import { getWebGlobalConfig } from "@/utils/configManager";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import { reactive } from "vue";

const serviceStore = useServiceStore();
const connectionStore = useConnectionStore();

if (connectionStore.state != 1 && connectionStore.state != 3) {
    serviceStore.$reset();
    disconnect();
}

const form = reactive({
    address: serviceStore.address,
    account: serviceStore.account,
    password: serviceStore.password,
    rememberPassword: serviceStore.rememberPassword,
    autoReconnect: serviceStore.autoReconnect,
});

const submit = () => {
    serviceStore.input(form);
    serviceStore.save();
    connect();
};

const config = getWebGlobalConfig();
</script>

<template>
    <CardBox
        is-form
        @submit.prevent="submit"
        class="w-11/12 md:w-7/12 lg:w-6/12 xl:w-4/12 shadow-2xl"
    >
        <div class="text-2xl font-semibold mb-3">连接你的iPanel Host</div>
        <FormField
            label="地址"
            help="WebSocket连接地址"
            v-if="!config.lockWebSocket"
        >
            <FormControl
                v-model="form.address"
                :icon="mdiAccount"
                placeholder="ws://www.example.com:1145/ws"
                name="address"
                autocomplete="url"
            />
        </FormField>

        <FormField
            label="帐号"
            help="你可以可在iPanel Host控制台通过命令'user add'创建"
        >
            <FormControl
                v-model="form.account"
                :icon="mdiAccount"
                name="login"
                autocomplete="username"
            />
        </FormField>

        <FormField label="密码" help="此用户帐号对应的密码">
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
                        type="submit"
                        color="info"
                        label="登录"
                        :disabled="connectionStore.state === 1"
                    />
                    <div
                        class="text-sm text-gray-400 dark:text-gray-600 flex items-center"
                    >
                        <span v-if="connectionStore.isReconnecting">
                            正在重连中
                        </span>
                        <span v-else-if="connectionStore.hasVerified">
                            你已经登录了
                        </span>
                        <span v-else-if="connectionStore.state === 1">
                            正在等待验证
                        </span>
                        <span v-else-if="connectionStore.state !== 3">
                            连接中
                        </span>
                    </div>
                </BaseButtons>

                <div class="text-sm ml-4">
                    <a
                        href="https://ipanel.serein.cc/docs/guide/webConsole/intro"
                        target="_blank"
                        class="hover:text-blue-600 hover:dark:text-blue-400"
                    >
                        登录时出现问题？
                    </a>
                </div>
            </div>
            <NotificationBar
                color="danger"
                class="mt-4"
                v-if="connectionStore.errorMsg"
            >
                {{ connectionStore.errorMsg }}
            </NotificationBar>
        </template>
    </CardBox>
</template>
