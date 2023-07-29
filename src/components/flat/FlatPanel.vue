<script setup lang="ts">
import { ref } from 'vue';

const el = ref<HTMLInputElement | null>(null);
defineExpose({ el })
</script>

<template>
    <div class="flat-panel flat" ref="el">
        <slot></slot>
    </div>
</template>

<style>
div.flat-panel.flat:hover:not([disabled]) {
    border: 1px solid var(--border-color-hover);
    box-shadow: var(--box-shadow-light);
}

div.flat-panel {
    padding: 20px;
    border-radius: 6px;
    background: var(--bg-color);
}
</style>