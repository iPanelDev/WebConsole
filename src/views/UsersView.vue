<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import UsersTable from "@/components/UsersTable.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { getUsers } from "@/service/packetSender";
import { useServiceStore } from "@/service/store";
import { mdiAccountMultiple, mdiAlertCircle, mdiRefresh } from "@mdi/js";
import { onMounted } from "vue";

const serviceStore = useServiceStore();
getUsers();
onMounted(getUsers);
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
            <UsersTable />
        </SectionMain>
    </LayoutAuthenticated>
</template>
