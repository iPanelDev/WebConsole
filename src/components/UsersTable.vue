<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import { EmptyStringPlaceholder } from "@/meta/constant";
import { useServiceStore } from "@/service/store";
import { User } from "@/service/types";
import { mdiAccountStar, mdiPencil, mdiTrashCan } from "@mdi/js";
import { computed, ref } from "vue";
import PillTag from "./PillTag.vue";
import CardBoxModal from "./CardBoxModal.vue";

const serviceStore = useServiceStore();

const items = computed(
    () => serviceStore.users as (User & { account: string })[]
);

const perPage = ref(10);

const currentPage = ref(0);

const itemsPaginated = computed(() =>
    items.value.slice(
        perPage.value * currentPage.value,
        perPage.value * (currentPage.value + 1)
    )
);

const numPages = computed(() => Math.ceil(items.value.length / perPage.value));

const currentPageHuman = computed(() => currentPage.value + 1);

const pagesList = computed(() => {
    const pagesList = [];

    for (let i = 0; i < numPages.value; i++) {
        pagesList.push(i);
    }

    return pagesList;
});

const userSelected = ref(null);
const isModalActive = ref(false);

function deleteUser(account: string) {
    userSelected.value = account;
    isModalActive.value = true;
}
</script>

<template>
    <CardBoxModal
        v-model="isModalActive"
        button-label="确认"
        :title="`确定要删除用户“${userSelected}”吗？`"
        has-cancel
    >
        此操作不可被撤销
    </CardBoxModal>
    <table class="collapsable">
        <thead>
            <tr>
                <th>帐号</th>
                <th>描述</th>
                <th>权限等级</th>
                <th>最近一次登录IP地址</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="user in itemsPaginated">
                <td data-label="帐号">
                    <div>
                        {{ user.account }}
                        <PillTag
                            class="ml-2"
                            label="当前用户"
                            color="info"
                            outline
                            v-if="user.account === serviceStore.account"
                        />
                    </div>
                </td>
                <td data-label="描述">
                    {{ user.description || EmptyStringPlaceholder }}
                </td>
                <td data-label="权限等级">
                    {{
                        ["游客", "只读", "助手", "管理员"][user.level] ||
                        EmptyStringPlaceholder
                    }}
                </td>
                <td data-label="最近一次登录IP地址">
                    <pre class="select-all">{{
                        user.ip_addresses[0] || EmptyStringPlaceholder
                    }}</pre>
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton color="info" :icon="mdiPencil" small />
                        <BaseButton
                            color="danger"
                            :icon="mdiTrashCan"
                            small
                            :disabled="user.account === serviceStore.account"
                            @click="() => deleteUser(user.account)"
                        />
                    </BaseButtons>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
            <BaseButtons>
                <BaseButton
                    v-for="page in pagesList"
                    :key="page"
                    :active="page === currentPage"
                    :label="page + 1"
                    :color="page === currentPage ? 'lightDark' : 'whiteDark'"
                    small
                    @click="currentPage = page"
                />
            </BaseButtons>
            <small>第{{ currentPageHuman }}页 共{{ numPages }}页</small>
        </BaseLevel>
    </div>
</template>
