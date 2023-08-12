<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { mdiAccount, mdiAsterisk } from "@mdi/js";
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import CardBox from "@/components/CardBox.vue";
import FormCheckRadio from "@/components/FormCheckRadio.vue";
import FormField from "@/components/FormField.vue";
import FormControl from "@/components/FormControl.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import LayoutGuest from "@/layouts/LayoutGuest.vue";
import { useServiceStore } from "@/service/store";

const serviceStore = useServiceStore();
serviceStore.restore();

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
                        <BaseButton type="submit" color="info" label="登录" />
                    </BaseButtons>
                </template>
            </CardBox>
        </SectionFullScreen>
    </LayoutGuest>
</template>
