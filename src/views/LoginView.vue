<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { useServiceStore } from "@/service/store";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import { reactive } from "vue";
import { disconnect, readyState } from "@/service/webSocket";

const serviceStore = useServiceStore();

if (readyState.value != 1) {
    serviceStore.$reset();
    serviceStore.restore();
    disconnect();
}

const form = reactive({
    address: serviceStore.address,
    account: serviceStore.account,
    password: serviceStore.password,
    rememberPassword: true,
});

const submit = () => {
    serviceStore.setUser(form);
    serviceStore.save();
    serviceStore.login();
};
</script>

<template>
    <LayoutGuest>
        <SectionFullScreen v-slot="{ cardClass }" bg="blue">
            <CardBox :class="cardClass" is-form @submit.prevent="submit">
                <div class="text-2xl font-semibold mb-3">
                    连接你的iPanel Host
                </div>
                <FormField label="地址" help="WebSocket连接地址">
                    <FormControl
                        v-model="form.address"
                        :icon="mdiAccount"
                        name="address"
                        autocomplete="url"
                    />
                </FormField>

                <FormField label="帐号" help="请输入你的帐号">
                    <FormControl
                        v-model="form.account"
                        :icon="mdiAccount"
                        name="login"
                        autocomplete="username"
                    />
                </FormField>

                <FormField label="密码" help="请输入你的密码">
                    <FormControl
                        v-model="form.password"
                        :icon="mdiAsterisk"
                        type="password"
                        name="password"
                        autocomplete="current-password"
                    />
                </FormField>

                <FormCheckRadio
                    v-model="form.rememberPassword"
                    name="remember"
                    label="记住密码"
                    :input-value="true"
                />

                <template #footer>
                    <BaseButtons>
                        <BaseButton
                            type="submit"
                            color="info"
                            label="登录"
                            :disabled="readyState === 1"
                        />
                        <span
                            v-if="readyState === 1"
                            class="text-sm text-gray-700 dark:text-gray-300"
                        >
                            你已经登录了
                        </span>
                    </BaseButtons>

                    <div class="text-sm mt-4">
                        <a
                            href="https://ipanel.serein.cc/docs/guide/webConsole/intro"
                            target="_blank"
                            class="hover:text-sky-800 hover:dark:text-sky-600"
                        >
                            登录时出现问题？
                        </a>
                    </div>
                </template>
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
