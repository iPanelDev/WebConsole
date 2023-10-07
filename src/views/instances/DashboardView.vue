<script setup lang="ts">
import BaseIcon from "@/components/BaseIcon.vue";
import CardBox from "@/components/CardBox.vue";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";
import { useServiceStore } from "@/service/store";
import { InstanceInfo } from "@/service/types";
import {
    mdiClock,
    mdiCpu64Bit,
    mdiEarthBox,
    mdiInformationBoxOutline,
    mdiMemory,
    mdiMonitorDashboard,
    mdiServer,
} from "@mdi/js";
import { ComputedRef, computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const serviceStore = useServiceStore();
const instanceId = useRoute().params["instanceId"] as string;

const infos: ComputedRef<Array<[string, InstanceInfo]>> = computed(
    () => serviceStore.instanceInfosHistory.get(instanceId) || []
);
const info = computed(() => serviceStore.instances.get(instanceId)?.info);
const meta = computed(() => serviceStore.instances.get(instanceId)?.metadata);

// onUnmounted(watch(info, generate));

const cpuData = ref({});
const ramData = ref({});

function generate() {
    cpuData.value = {
        labels: infos.value.map((info) => info[0]),
        datasets: [
            {
                label: "总CPU使用率",
                axis: "x",
                data: infos.value.map((info) => info[1].sys.cpuUsage),
                fill: true,
                cubicInterpolationMode: "default",
                borderColor: "#36A2EB",
                backgroundColor: "#9BD0F5",
            },
            {
                label: "服务器进程使用率",
                axis: "x",
                data: infos.value.map(
                    (info) =>
                        (info[1].server.status && info[1].server.usage) || 0
                ),
                fill: true,
                cubicInterpolationMode: "default",
                borderColor: "#64be9f",
                backgroundColor: "#47b382",
            },
        ],
    };

    ramData.value = {
        labels: infos.value.map((info) => info[0]),
        datasets: [
            {
                label: "空闲内存（GB）",
                axis: "x",
                data: infos.value.map(
                    (info) => info[1].sys.freeRam / 1024 / 1024
                ),
                fill: true,
                borderColor: "#53bb27",
                backgroundColor: "#8cf648",
            },
            {
                label: "已用内存（GB）",
                axis: "x",
                data: infos.value.map(
                    (info) =>
                        (info[1].sys.totalRam - info[1].sys.freeRam) /
                        1024 /
                        1024
                ),
                fill: true,
                borderColor: "#ff6363",
                backgroundColor: "#bd3232",
            },
        ],
    };
}

onMounted(generate);
</script>
<template>
    <LayoutOfInstance>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiMonitorDashboard"
                title="仪表盘"
                main
            />

            <div class="grid grid-cols-1 lg:gap-3 lg:grid-cols-2">
                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon
                            :path="mdiInformationBoxOutline"
                            size="17"
                        />实例信息
                    </div>
                    <div class="flex">
                        {{ meta?.name || "未知名称" }}

                        <span
                            v-if="meta?.version"
                            title="版本"
                            class="ml-3 text-gray-500"
                        >
                            - {{ meta?.version }}
                        </span>
                    </div>
                </CardBox>

                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiEarthBox" size="17" />系统
                    </div>
                    {{ info?.sys?.os || "未知" }}
                </CardBox>

                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiServer" size="17" />服务器状态
                    </div>
                    {{ info?.server.status ? "运行中" : "未启动" }}
                </CardBox>

                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiClock" size="17" />服务器运行时间
                    </div>
                    {{ info?.server.runTime || "未启动" }}
                </CardBox>
            </div>

            <CardBox class="pd-6 mb-5">
                <div class="flex items-center mb-3 justify-between">
                    <h1 class="text-2xl flex items-center">
                        <BaseIcon
                            :path="mdiCpu64Bit"
                            size="25"
                            class="mr-3"
                        />CPU使用率
                    </h1>
                    {{ info?.sys?.cpuUsage?.toFixed(1) || 0 }}%
                </div>
                <LineChart :data="cpuData" />
            </CardBox>

            <CardBox class="pd-6 mb-5">
                <div class="flex items-center mb-3 justify-between">
                    <h1 class="text-2xl flex items-center">
                        <BaseIcon
                            :path="mdiMemory"
                            size="25"
                            class="mr-3"
                        />内存
                    </h1>
                    {{
                        (
                            (info?.sys?.totalRam - info?.sys?.freeRam) /
                            1024 /
                            1024
                        )?.toFixed(1) || 0
                    }}
                    /
                    {{ (info?.sys?.totalRam / 1024 / 1024)?.toFixed(1) || 0 }}
                    GB |
                    {{ info?.sys?.ramUsage?.toFixed(1) || 0 || 0 }}%
                </div>
                <LineChart :data="ramData" />
            </CardBox>
        </SectionMain>
    </LayoutOfInstance>
</template>
