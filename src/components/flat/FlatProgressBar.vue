<script setup lang="ts">
defineProps({
    percentage: {
        type: Number,
        default: 50
    },
    loading: {
        type: Boolean,
        default: true
    }
});
</script>

<template>
    <div class="flat-progress-bar flat" :title="loading ? '加载中' : `${percentage}%`">
        <div class="flat-progress-bar-main-bar" :style="{ width: `${percentage}%` }" v-if="!loading">
        </div>
        <div class="flat-progress-bar-main-bar flat-progress-bar-main-bar-loading" :style="{ width: `${percentage}%` }"
            v-else>
        </div>
    </div>
</template>

<style>
.flat-progress-bar {
    height: 20px;
    overflow: hidden;
    margin: 5px 0;
}

.flat-progress-bar-main-bar {
    position: relative;
    height: 18px;
    top: 0;
    bottom: 0;
    background: var(--text-color-secondary);
}

.flat-progress-bar-main-bar-loading {
    animation: loadingAnimation 4s infinite linear;
    width: 30% !important;
}

.flat-progress-bar:hover .flat-progress-bar-main-bar {
    background: var(--text-color-primary);
}

@keyframes loadingAnimation {
    0% {
        left: -100%;
    }

    100% {
        left: 100%;
    }
}
</style>