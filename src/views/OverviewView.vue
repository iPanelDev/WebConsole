<script setup lang="ts">
import CardBox from "@/components/CardBox.vue";
import FormControl from "@/components/FormControl.vue";
import CardBoxComponentEmpty from "@/components/CardBoxComponentEmpty.vue";
import SectionMain from "@/components/SectionMain.vue";
import BaseIcon from "@/components/BaseIcon.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutAuthenticated from "@/layouts/LayoutAuthenticated.vue";
import { mdiHome, mdiFilter, mdiServer, mdiFile, mdiClock } from "@mdi/js";
import { useServiceStore } from "@/service/store";
import { EmptyStringPlaceholder } from "@/meta/constant";
import { computed, ref } from "vue";

const serviceStore = useServiceStore();

const filter = ref("");

const instances = computed(() =>
    Array.from(serviceStore.instances.entries()).filter(
        (instance) =>
            !filter.value ||
            instance[1].address.includes(filter.value) ||
            instance[1].customName
                .toLowerCase()
                .includes(filter.value.toLowerCase())
    )
);

</script>

<template>
    <LayoutAuthenticated>
        <SectionMain>
            <SectionTitleLineWithButton :icon="mdiHome" title="总览" main />
            <FormControl
                v-model="filter"
                type="input"
                :icon="mdiFilter"
                class="mb-5"
                inputmode="text"
                autocomplete="none"
                transparent
                placeholder="通过名称或地址筛选实例..."
            />
            <div class="grid lg:grid-cols-3 md:grid-cols-2">
                <RouterLink
                    v-for="item in instances"
                    :key="item[0]"
                    :to="`/instance/${item[0]}`"
                >
                    <CardBox
                        class="transition-all select-none flex flex-wrap cursor-pointer border-slate-300 dark:border-slate-700 border w-full hover:border-slate-500 hover:dark:border-slate-500"
                        is-hoverable
                        style="transition-property: all !important"
                    >
                        <div class="flex mb-5 truncate">
                            <span class="mr-2 text-xl">
                                {{ item[1].customName ?? "未知名称" }}
                            </span>
                            <span
                                class="text-lg text-gray-600 dark:text-gray-400"
                                >{{ item[1].address }}
                            </span>
                        </div>
                        <div
                            class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                        >
                            <BaseIcon :path="mdiServer" />
                            服务器状态
                            <span class="ml-2">
                                {{
                                    item[1].shortInfo.server_status
                                        ? "运行中"
                                        : "未启动"
                                }}
                            </span>
                        </div>
                        <div
                            class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                        >
                            <BaseIcon :path="mdiFile" />
                            启动文件
                            <span class="ml-2">
                                {{
                                    item[1].shortInfo.server_filename ??
                                    EmptyStringPlaceholder
                                }}
                            </span>
                        </div>
                        <div
                            class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                        >
                            <BaseIcon :path="mdiClock" />
                            运行时间
                            <span class="ml-2">
                                {{
                                    item[1].shortInfo.server_time ??
                                    EmptyStringPlaceholder
                                }}
                            </span>
                        </div>
                    </CardBox>
                </RouterLink>
            </div>
            <CardBoxComponentEmpty
                v-if="instances.length === 0"
                message="啥都没有找到哦..."
            />
        </SectionMain>
    </LayoutAuthenticated>
</template>
