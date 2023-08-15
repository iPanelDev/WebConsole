<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Tooltip,
} from "chart.js";

const props = defineProps({
    data: {
        type: Object,
        required: true,
    },
});

const root = ref(null);

let chart: Chart;

Chart.register(
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Tooltip
);

onMounted(() => {
    chart = new Chart(root.value, {
        type: "line",
        data: props.data as any,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    display: true,
                },
                x: {
                    display: true,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
        },
    });
});

const chartData = computed(() => props.data);

watch(
    chartData,
    (data) => {
        if (chart) {
            chart.data = data as any;
            chart.update("none");
        }
    },
    { deep: true }
);
</script>

<template>
    <div>
        <canvas ref="root" />
    </div>
</template>
