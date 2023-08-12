<script setup lang="ts">
import LayoutOfInstance from "@/layouts/LayoutOfInstance.vue";

import SectionMain from "@/components/SectionMain.vue";
import SectionTitleLineWithButton from "@/components/SectionTitleLineWithButton.vue";
import { mdiMonitorDashboard } from "@mdi/js";
import LineChart from "@/components/Charts/LineChart.vue";
import { sampleChartData } from "@/components/Charts/chart.config";
import { onMounted, ref } from "vue";
import CardBox from "@/components/CardBox.vue";

let chartData = ref(null);

const labels = [];
const datas = [];

const update = () => {};

onMounted(update);

setInterval(update, 2000);
</script>
<template>
    <LayoutOfInstance>
        <SectionMain>
            <SectionTitleLineWithButton
                :icon="mdiMonitorDashboard"
                title="仪表盘"
                main
            />
        </SectionMain>
        <CardBox class="pd-6">
            <LineChart :data="chartData" class="h-96" />
        </CardBox>
    </LayoutOfInstance>
</template>
