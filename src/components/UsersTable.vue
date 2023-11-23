<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import PillTag from "@/components/PillTag.vue";
import { EmptyStringPlaceholder } from "@/constant";
import { permissionLevel } from "@/service";
import { useServiceStore } from "@/service/store";
import { User } from "@/service/types";
import { mdiAccountRemove, mdiPencil } from "@mdi/js";
import { computed, ref } from "vue";

const emit = defineEmits(["edit", "remove"]);
const props = defineProps(["users"]);

const serviceStore = useServiceStore();

const items = computed(() => props.users as [string, User]);

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
</script>

<template>
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
                        permissionLevel[userItem[1].level] ||
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
                            title="编辑用户信息"
                            small
                            :disabled="userItem[0] === serviceStore.userName"
                            @click="() => emit('edit', userItem[0])"
                        />
                        <BaseButton
                            color="danger"
                            :icon="mdiAccountRemove"
                            title="删除用户"
                            small
                            :disabled="userItem[0] === serviceStore.userName"
                            @click="() => emit('remove', userItem[0])"
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
