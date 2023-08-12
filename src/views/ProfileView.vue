<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseDivider from "@/components/BaseDivider.vue";
import CardBox from "@/components/CardBox.vue";
import FormControl from "@/components/FormControl.vue";
import FormField from "@/components/FormField.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import UserCard from "@/components/UserCard.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { useServiceStore } from "@/service/store";
import { mdiAccount, mdiAsterisk, mdiFormTextboxPassword } from "@mdi/js";
import { reactive } from "vue";

const mainStore = useServiceStore();

const profileForm = reactive({
    name: mainStore.account,
});

const passwordForm = reactive({
    password_current: "",
    password: "",
    password_confirmation: "",
});

const submitProfile = () => {
    mainStore.setUser(profileForm);
};

const submitPass = () => {
    //
};
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
                <CardBox is-form @submit.prevent="submitProfile"> </CardBox>

                <CardBox is-form @submit.prevent="submitPass">
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
                                label="Submit"
                            />
                            <BaseButton color="info" label="Options" outline />
                        </BaseButtons>
                    </template>
                </CardBox>
            </div>
        </SectionMain>
    </LayoutAuthenticated>
</template>
