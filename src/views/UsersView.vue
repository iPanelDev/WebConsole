<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import UsersTable from "@/components/UsersTable.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { listUsers } from "@/service/requests";
import { useServiceStore } from "@/service/store";
import { mdiAccountMultiple, mdiAlertCircle, mdiRefresh } from "@mdi/js";
import { ref } from "vue";

const serviceStore = useServiceStore();

const users = ref({});
getUsers();

async function getUsers() {
    const dict = {};

    for (const kv of Object.entries(await listUsers())) {
        dict[kv[0]] = kv[1];
    }
    users.value = dict;
}
</script>
<template>
    <LayoutAuthenticated>
        <SectionMain>
            <NotificationBar
                color="danger"
                :icon="mdiAlertCircle"
                v-if="serviceStore.currentUser?.level != 3"
            >
                <b>权限不足</b>
                你没有权限使用这个页面
            </NotificationBar>
            <SectionTitleLineWithButton
                :icon="mdiAccountMultiple"
                title="用户管理"
                main
            >
                <BaseButton
                    :icon="mdiRefresh"
                    color="lightDark"
                    @click="getUsers"
                />
            </SectionTitleLineWithButton>
            <UsersTable :users="users" @delete="getUsers" />
        </SectionMain>
    </LayoutAuthenticated>
</template>
