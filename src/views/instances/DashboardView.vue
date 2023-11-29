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
    mdiApplication,
    mdiCpu64Bit,
    mdiHexagonOutline,
    mdiInformationBoxOutline,
    mdiMemory,
    mdiMonitorDashboard,
    mdiServer,
} from "@mdi/js";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const isNullOrUndefined = (v: any) => v === undefined || v === null;
const serviceStore = useServiceStore();
const instanceId = useRoute().params["instanceId"] as string;

const info = computed(() => serviceStore.instances[instanceId]?.info);
const meta = computed(() => serviceStore.instances[instanceId]?.metadata);
const infos: InstanceInfo[] =
    serviceStore.instanceInfosHistory[instanceId] || [];
const cpuData = ref({});
const ramData = ref({});

watch(info, update);

function update() {
    const time = infos.length > 0 ? infos[infos.length - 1]?.updateTime : null;
    if (time === info.value?.updateTime || !info || !info.value?.updateTime)
        return;

    infos.push(info.value);

    if (infos.length > 20) infos.splice(0, infos.length - 20);

    cpuData.value = {
        labels: infos.map((i) => new Date(i.updateTime).toLocaleTimeString()),
        datasets: [
            {
                label: "总CPU使用率",
                axis: "x",
                data: infos.map((i) => i.system.cpuUsage),
                fill: true,
                cubicInterpolationMode: "default",
                borderColor: "#36A2EB",
                backgroundColor: "#9BD0F5",
            },
            {
                label: "服务器进程使用率",
                axis: "x",
                data: infos.map(
                    (i) => (i.server.status && i.server.usage) || 0
                ),
                fill: true,
                cubicInterpolationMode: "default",
                borderColor: "#64be9f",
                backgroundColor: "#47b382",
            },
        ],
    };

    ramData.value = {
        labels: infos.map((i) => new Date(i.updateTime).toLocaleTimeString()),
        datasets: [
            {
                label: "空闲内存（GB）",
                axis: "x",
                data: infos.map((i) => i.system.freeRam / 1024 / 1024),
                fill: true,
                borderColor: "#53bb27",
                backgroundColor: "#8cf648",
            },
            {
                label: "已用内存（GB）",
                axis: "x",
                data: infos.map(
                    (i) => (i.system.totalRam - i.system.freeRam) / 1024 / 1024
                ),
                fill: true,
                borderColor: "#0e7490",
                backgroundColor: "#06b6d4",
            },
        ],
    };

    serviceStore.instanceInfosHistory[instanceId] = infos;
}

onMounted(update);
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
                <CardBox class="pd-6 mb-3 lg:truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiApplication" size="17" />
                        实例
                    </div>
                    {{ meta?.name || "未知名称" }}

                    <span
                        v-if="meta?.version"
                        title="版本"
                        class="mr-1 text-gray-500 break-keep"
                    >
                        [{{ meta?.version }}]
                    </span>

                    <span
                        v-if="meta?.environment"
                        title="环境"
                        class="mr-1 text-gray-500 break-keep"
                    >
                        [{{ meta?.environment }}]
                    </span>
                </CardBox>

                <CardBox class="pd-6 mb-3 lg:truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiHexagonOutline" size="17" />
                        系统
                    </div>
                    {{ info?.system?.os || "未知" }}
                </CardBox>

                <CardBox class="pd-6 mb-3 lg:truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiServer" size="17" />
                        服务器状态
                    </div>
                    <span
                        :class="[
                            info?.server.status
                                ? 'text-green-500'
                                : 'text-gray-500',
                        ]"
                        >●</span
                    >
                    {{ info?.server.status ? "运行中" : "未启动" }}
                    <span
                        v-if="info?.server?.status && info?.server?.filename"
                        class="mr-1 text-gray-500 break-keep"
                    >
                        [进程名称:
                        <code class="inline">{{ info?.server?.filename }}</code
                        >]
                    </span>
                    <span
                        v-if="info?.server?.status && info?.server?.runTime"
                        class="mr-1 text-gray-500 break-keep"
                    >
                        [已运行{{ info?.server?.runTime }}]
                    </span>
                </CardBox>

                <CardBox class="pd-6 mb-3 lg:truncate">
                    <div class="text-xl mb-3 flex items-center">
                        <BaseIcon :path="mdiInformationBoxOutline" size="17" />
                        服务器信息
                    </div>
                    <div class="flex">
                        <div
                            v-if="
                                !isNullOrUndefined(
                                    info?.server?.onlinePlayers
                                ) && !isNullOrUndefined(info?.server?.capacity)
                            "
                        >
                            在线:
                            <code class="inline">{{
                                info?.server?.onlinePlayers
                            }}</code>
                            /
                            <code class="inline">{{
                                info?.server?.capacity
                            }}</code>
                        </div>

                        <span
                            class="mx-2"
                            v-if="
                                info?.server?.version &&
                                !isNullOrUndefined(
                                    info?.server?.onlinePlayers
                                ) &&
                                !isNullOrUndefined(info?.server?.capacity)
                            "
                        >
                            |
                        </span>

                        <div v-if="info?.server?.version">
                            版本:
                            <code class="inline">{{
                                info?.server?.version
                            }}</code>
                        </div>
                    </div>
                </CardBox>
            </div>

            <CardBox class="pd-6 mb-5">
                <div class="flex items-center mb-3 justify-between">
                    <h1 class="text-2xl flex items-center">
                        <BaseIcon :path="mdiCpu64Bit" size="25" class="mr-3" />
                        CPU使用率
                    </h1>
                    {{ info?.system?.cpuUsage?.toFixed(1) || 0 }}%
                </div>
                <LineChart :data="cpuData" />
            </CardBox>

            <CardBox class="pd-6 mb-5">
                <div class="flex items-center mb-3 justify-between">
                    <h1 class="text-2xl flex items-center">
                        <BaseIcon :path="mdiMemory" size="25" class="mr-3" />
                        内存
                    </h1>
                    {{
                        (
                            (info?.system?.totalRam - info?.system?.freeRam) /
                            1024 /
                            1024
                        )?.toFixed(1) || 0
                    }}
                    /
                    {{
                        (info?.system?.totalRam / 1024 / 1024)?.toFixed(1) || 0
                    }}
                    GB |
                    {{ info?.system?.ramUsage?.toFixed(1) || 0 || 0 }}%
                </div>
                <LineChart :data="ramData" />
            </CardBox>
        </SectionMain>
    </LayoutOfInstance>
</template>
