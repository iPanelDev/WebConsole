<script setup lang="ts">
import BaseIcon from '@/components/BaseIcon.vue';
import CardBox from '@/components/CardBox.vue';
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue';
import FormControl from '@/components/FormControl.vue';
import SectionMain from '@/components/SectionMain.vue';
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue';
import { EmptyStringPlaceholder } from '@/constant';
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue';
import { callWhenLogined, updateInstancesInfo } from '@/service';
import { useServiceStore } from '@/service/store';
import { Instance } from '@/service/types';
import { mdiClock, mdiFile, mdiFilter, mdiHome, mdiServer } from '@mdi/js';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const serviceStore = useServiceStore();

const filter = ref('');

const instancesFiltered = computed(() =>
    Array.from(
        Object.entries(serviceStore.instances as Record<string, Instance>)
    ).filter(
        (item) =>
            !filter.value ||
            item[1].address.includes(filter.value) ||
            item[1].customName
                .toLowerCase()
                .includes(filter.value.toLowerCase())
    )
);

const timer = setInterval(updateInstancesInfo, 2000);
callWhenLogined(updateInstancesInfo);
onMounted(updateInstancesInfo);
onBeforeUnmount(() => clearInterval(timer));
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
            <div class="grid lg:grid-cols-3 md:grid-cols-2 gap-3">
                <RouterLink
                    v-for="item in instancesFiltered"
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
                                {{ item[1].customName ?? '未知名称' }}
                            </span>
                            <span
                                class="text-lg text-gray-600 dark:text-gray-400"
                            >
                                {{ item[1].address }}
                            </span>
                        </div>
                        <div
                            class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                        >
                            <BaseIcon :path="mdiServer" />
                            服务器状态
                            <span class="ml-2">
                                <span
                                    :class="[
                                        item[1]?.info?.server?.status
                                            ? 'text-teal-500'
                                            : 'text-gray-500',
                                    ]"
                                    >●</span
                                >
                                {{
                                    item[1].info?.server?.status
                                        ? '运行中'
                                        : '未启动'
                                }}
                            </span>
                        </div>
                        <div
                            class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                        >
                            <BaseIcon :path="mdiFile" />
                            启动文件
                            <code class="ml-2 inline">
                                {{
                                    item[1].info?.server?.filename ??
                                    EmptyStringPlaceholder
                                }}
                            </code>
                        </div>
                        <div
                            class="flex mb-1 text-gray-700 dark:text-gray-300 truncate"
                        >
                            <BaseIcon :path="mdiClock" />
                            运行时间
                            <span class="ml-2">
                                {{
                                    item[1].info?.server?.runTime ??
                                    EmptyStringPlaceholder
                                }}
                            </span>
                        </div>
                    </CardBox>
                </RouterLink>
            </div>
            <CardBoxComponentEmpty
                v-if="instancesFiltered.length === 0"
                message="啥都没有找到哦..."
            />
        </SectionMain>
    </LayoutAuthenticated>
</template>
