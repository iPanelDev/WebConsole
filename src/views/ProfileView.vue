<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import CardBox from "@/components/CardBox.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import UserCard from "@/components/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { EmptyStringPlaceholder } from "@/constant";
import { updateUserInfo } from "@/service";
import { useServiceStore } from "@/service/store";
import { mdiAccount, mdiFormTextboxPassword } from "@mdi/js";
import { reactive } from "vue";

const serviceStore = useServiceStore();

const passwordForm = reactive({
    password_current: "",
    password: "",
    password_confirmation: "",
});

updateUserInfo();

const submitPass = () => {};
</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiAccount"
                title="个人资料"
                main
            />

            <UserCard class="mb-6" />

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CardBox>
                    <div class="text-xl mb-5 font-bold">用户信息</div>
                    <div class="mb-5">
                        <h2 class="font-bold">描述</h2>
                        {{
                            serviceStore.currentUser?.description ||
                            EmptyStringPlaceholder
                        }}
                    </div>
                    <div class="mb-5">
                        <h2 class="font-bold">权限等级</h2>
                        {{
                            ["游客", "只读", "助手", "管理员"][
                                serviceStore.currentUser?.level
                            ] || EmptyStringPlaceholder
                        }}
                    </div>
                    <div class="mb-5">
                        <h2 class="font-bold">允许使用的实例</h2>
                        <div v-if="serviceStore.currentUser?.level === 3">
                            所有实例
                        </div>
                        <div
                            v-else
                            v-for="id in serviceStore.currentUser?.instances ||
                            []"
                        >
                            <pre> {{ id }}</pre>
                        </div>
                    </div>
                    <div class="mb-5">
                        <h2 class="font-bold">历史登录IP（最近10次）</h2>
                        <div
                            class="grid grid-cols-2 p-2"
                            style="background: #88888810"
                        >
                            <div
                                v-for="(address, index) in serviceStore
                                    .currentUser?.ipAddresses || []"
                                class="flex"
                            >
                                <span class="mr-2">{{ index + 1 }}.</span>
                                <pre class="select-all">{{ address }}</pre>
                            </div>
                        </div>
                    </div>
                </CardBox>

                <CardBox is-form @submit.prevent="submitPass">
                    <div class="text-xl mb-5 font-bold">修改密码</div>
                    <FormField label="新的密码">
                        <FormControl
                            v-model="passwordForm.password"
                            :icon="mdiFormTextboxPassword"
                            name="password"
                            type="password"
                            required
                            autocomplete="new-password"
                        />
                    </FormField>

                    <FormField label="确认密码" help="重复输入一遍新的密码">
                        <FormControl
                            v-model="passwordForm.password_confirmation"
                            :icon="mdiFormTextboxPassword"
                            name="password_confirmation"
                            type="password"
                            required
                            autocomplete="new-password"
                        />
                    </FormField>

                    <template #footer>
                        <BaseButtons>
                            <BaseButton
                                type="submit"
                                color="info"
                                label="提交"
                            />
                        </BaseButtons>
                    </template>
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>
