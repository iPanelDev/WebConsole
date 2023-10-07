<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import CardBoxModal from "@/components/CardBoxModal.vue";
import PillTag from "@/components/PillTag.vue";
import { EmptyStringPlaceholder } from "@/constant";
import { useServiceStore } from "@/service/store";
import { User } from "@/service/types";
import { mdiPencil, mdiTrashCan } from "@mdi/js";
import { Ref, computed, ref } from "vue";
import { deleteUser } from "@/service/requests";
import { createNotify } from "@/notification";

const emit = defineEmits(["delete"]);
const props = defineProps(["users"]);

const serviceStore = useServiceStore();

const items = computed(() =>
    Array.from(Object.entries(props.users as Record<string, User>))
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

const userSelected = ref("");
const isDeleteConfirmActive = ref(false);
const isEditActive = ref(false);

function showDeleteComfirm(account: string) {
    userSelected.value = account;
    isDeleteConfirmActive.value = true;
}

function showEditForm(account: string) {
    userSelected.value = account;
    isEditActive.value = true;
}

function userDelete() {
    try {
        deleteUser(userSelected.value);
        createNotify({
            type: "success",
            title: "删除用户成功",
        });
    } catch (error) {
        createNotify({
            type: "warning",
            title: "删除用户失败",
            message: error,
        });
    }
    emit("delete");
}
</script>

<template>
    <CardBoxModal
        v-model="isDeleteConfirmActive"
        button-label="确认"
        :title="`确定要删除用户“${userSelected}”吗？`"
        has-cancel
        @confirm="userDelete"
    >
        此操作不可被撤销
    </CardBoxModal>
    <CardBoxModal
        v-model="isEditActive"
        button-label="确认"
        :title="`修改用户“${userSelected}”`"
        has-cancel
        @confirm=""
    >
        1111
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
            <tr v-for="userItem in itemsPaginated">
                <td data-label="帐号">
                    <div>
                        {{ userItem[0] }}
                        <PillTag
                            class="ml-2"
                            label="当前用户"
                            color="info"
                            outline
                            v-if="userItem[0] === serviceStore.userName"
                        />
                    </div>
                </td>
                <td data-label="描述">
                    {{ userItem[1].description || EmptyStringPlaceholder }}
                </td>
                <td data-label="权限等级">
                    {{
                        ["游客", "只读", "助手", "管理员"][userItem[1].level] ||
                        EmptyStringPlaceholder
                    }}
                </td>
                <td data-label="最近一次登录IP地址">
                    <pre class="select-all">{{
                        userItem[1]?.ipAddresses[0] || EmptyStringPlaceholder
                    }}</pre>
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                    <BaseButtons type="justify-start lg:justify-end" no-wrap>
                        <BaseButton
                            color="info"
                            :icon="mdiPencil"
                            small
                            @click="() => showEditForm(userItem[0])"
                        />
                        <BaseButton
                            color="danger"
                            :icon="mdiTrashCan"
                            small
                            :disabled="userItem[0] === serviceStore.userName"
                            @click="() => showDeleteComfirm(userItem[0])"
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
