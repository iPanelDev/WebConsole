<script setup lang="ts">
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";

import CardBox from "@/components/CardBox.vue";
import LineChart from "@/components/Charts/LineChart.vue";
import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { subscribe } from "@/service/packetSender";
import { useServiceStore } from "@/service/store";
import { FullInfo } from "@/service/types";
import {
    mdiClock,
    mdiCpu64Bit,
    mdiEarthBox,
    mdiMemory,
    mdiMonitorDashboard,
    mdiServer,
} from "@mdi/js";
import { ComputedRef, computed, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

import BaseIcon from "@/components/BaseIcon.vue";

const serviceStore = useServiceStore();
const instanceId = useRoute().params["instanceId"] as string;
onMounted(() => subscribe(instanceId));

const infos: ComputedRef<Array<[string, FullInfo]>> = computed(
    () => serviceStore.instanceInfos.get(instanceId) || []
);
const fullInfo = computed(
    () => serviceStore.instances.get(instanceId)?.full_info
);
const shortInfo = computed(
    () => serviceStore.instances.get(instanceId)?.short_info
);

onUnmounted(watch(fullInfo, generate));

const cpuData = ref({});
const ramData = ref({});

function generate() {
    cpuData.value = {
        labels: infos.value.map((info) => info[0]),
        datasets: [
            {
                label: "总CPU使用率",
                axis: "x",
                data: infos.value.map((info) => info[1].sys.cpu_usage),
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
                    (info) => info[1].sys.free_ram / 1024 / 1024
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
                        (info[1].sys.total_ram - info[1].sys.free_ram) /
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

            <div class="grid grid-cols-1 lg:gap-3 lg:grid-cols-3">
                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiEarthBox" size="17" />系统
                    </div>
                    {{ shortInfo?.os || "未知" }}
                </CardBox>

                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiServer" size="17" />服务器状态
                    </div>
                    {{ shortInfo?.server_status ? "运行中" : "未启动" }}
                </CardBox>

                <CardBox class="pd-6 mb-3 truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiClock" size="17" />服务器运行时间
                    </div>
                    {{ shortInfo?.server_time || "未启动" }}
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
                    {{ fullInfo?.sys?.cpu_usage?.toFixed(1) || 0 }}%
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
                            (fullInfo?.sys?.total_ram -
                                fullInfo?.sys?.free_ram) /
                            1024 /
                            1024
                        ).toFixed(1) || 0
                    }}
                    /
                    {{
                        (fullInfo?.sys?.total_ram / 1024 / 1024).toFixed(1) || 0
                    }}
                    GB |
                    {{ fullInfo?.sys?.ram_usage?.toFixed(1) || 0 }}%
                </div>
                <LineChart :data="ramData" />
            </CardBox>
        </SectionMain>
    </LayoutOfInstance>
</template>
