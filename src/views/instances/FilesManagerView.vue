<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseButtons from "@/components/BaseButtons.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import BaseLevel from "@/components/BaseLevel.vue";
import CardBox from "@/components/CardBox.vue";
import CheckboxCell from "@/components/CheckboxCell.vue";
import NotificationBar from "@/components/NotificationBar.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";
import { EmptyStringPlaceholder } from "@/constant";
import { useServiceStore } from "@/service/store";
import { getIcon } from "@/utils/icons";
import { formatFileSize } from "@/utils/strings";
import {
    mdiAlertCircle,
    mdiArrowLeftCircle,
    mdiFile,
    mdiFolderOutline,
    mdiRefreshCircle,
} from "@mdi/js";
import { Ref, computed, ref } from "vue";
import { useRoute } from "vue-router";

const serviceStore = useServiceStore();

const instanceId = useRoute().params["instanceId"] as string;

const currentPath = ref("");
const items = ref([]);
const perPage = ref(20);
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

const selected: Ref = ref([]);

function check(isChecked: boolean, item) {
    if (isChecked) {
        selected.value.push(item);
    } else {
        selected.value = selected.value.filter((i) => i.path != item.path);
    }
}

async function update({ type, path }) {
    if (type != "dir") {
        return;
    }
    currentPath.value = path;
    selected.value.splice(0, selected.value.length);
}

function back() {
    if (currentPath.value) {
        const pattens = currentPath.value.split("/");
        pattens.pop();
        currentPath.value = pattens.join("/");
        currentPage.value = 0;
    }
}

function refresh() {}
</script>

<template>
    <LayoutOfInstance>
        <SectionMain>
            <NotificationBar
                color="danger"
                :icon="mdiAlertCircle"
                v-if="!(serviceStore.currentUser?.level >= 2)"
            >
                <b>权限不足</b>
                你没有权限使用这个页面
            </NotificationBar>
            <SectionTitleLineWithButton :icon="mdiFile" title="文件管理" main />
            <CardBox>
                <div class="flex items-center">
                    <BaseButton
                        :icon="mdiArrowLeftCircle"
                        @click="back"
                        color="lightdark"
                        class="mr-2"
                        :disabled="!currentPath"
                    />
                    <BaseButton
                        :icon="mdiRefreshCircle"
                        @click="refresh"
                        color="lightdark"
                        class="mr-2"
                    />
                    <pre>{{ currentPath }}</pre>
                </div>
                <table>
                    <thead>
                        <th></th>
                        <th>名称</th>
                        <th class="text-center whitespace-nowrap">大小</th>
                    </thead>
                    <tbody>
                        <tr
                            v-for="item in itemsPaginated"
                            class="cursor-pointer"
                        >
                            <td class="w-1">
                                <CheckboxCell @checked="check($event, item)" />
                            </td>
                            <td @click="() => update(item)">
                                <div class="flex">
                                    <BaseIcon
                                        :path="mdiFolderOutline"
                                        v-if="item.type === 'dir'"
                                    />

                                    <BaseIcon
                                        :path="getIcon(item.name)"
                                        v-else
                                    />
                                    {{ item.name }}
                                </div>
                            </td>
                            <td class="text-center w-1">
                                <pre>{{
                                    formatFileSize(item.size) ||
                                    EmptyStringPlaceholder
                                }}</pre>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="ml-2 my-3 text-sm text-center">
                    <span class="mx-2" v-if="selected.length > 0">
                        已选择{{ selected.length }}个项目
                    </span>
                    <span class="mx-2" v-else>
                        当前共{{ items.length }}个项目
                    </span>
                    ·
                    <span class="whitespace-nowrap mx-2">
                        第{{ currentPageHuman }}页 / 共{{ numPages }}页
                    </span>
                </div>
                <div class="p-3 lg:px-6">
                    <BaseLevel>
                        <BaseButtons>
                            <BaseButton
                                v-for="page in pagesList"
                                :key="page"
                                :active="page === currentPage"
                                :label="page + 1"
                                :color="
                                    page === currentPage
                                        ? 'lightDark'
                                        : 'whiteDark'
                                "
                                small
                                @click="currentPage = page"
                            />
                        </BaseButtons>
                    </BaseLevel>
                </div>
            </CardBox>
        </SectionMain>
    </LayoutOfInstance>
</template>
