<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import UsersTable from "@/components/UsersTable.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { listUsers } from "@/service/requests";
import { useServiceStore } from "@/service/store";
import { User } from "@/service/types";
import { unwrap } from "@/utils/wrapper";
import { mdiAccountMultiple, mdiAlertCircle, mdiRefresh } from "@mdi/js";
import { ref } from "vue";

const serviceStore = useServiceStore();

const users = ref(new Map<string, User>());
getUsers();

async function getUsers() {
    const dict = await listUsers();

    users.value.clear();
    for (const kv of Object.entries(dict)) {
        users.value.set(kv[0], unwrap(kv[1]));
    }
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
            <UsersTable :users="users" />
        </SectionMain>
    </LayoutAuthenticated>
</template>
