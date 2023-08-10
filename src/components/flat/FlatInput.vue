<script setup lang="ts">
import { ref } from 'vue';

const el = ref<HTMLInputElement | null>(null);

defineProps(['modelValue']);
defineEmits(['update:modelValue']);
defineOptions({
    inheritAttrs: false
});
defineExpose({ el });

</script>

<template>
    <div class="flat-input flat">
        <div class="flat-input-slot-container no-select" v-if="$slots.default">
            <slot></slot>
        </div>
        <input v-bind="$attrs" :value="modelValue" @input="$emit('update:modelValue', ($event?.target as any).value)"
            ref="el">
    </div>
</template>

<style>
.flat-input {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 10px;
    background: var(--bg-color);
}

.flat-input-slot-container {
    display: flex;
    justify-content: center;
    margin-right: 10px;
    white-space: nowrap;
    font-size: small;
}

.flat-input input {
    outline: none;
    border: none;
    box-shadow: none;
    background: none;
    width: 100%;
    height: 100%;
    min-height: 40px;
    padding: 0;
}

.flat-input:has(input:focus) {
    border: 1px solid var(--color-primary-light-3) !important;
    outline: 0;
    box-shadow: 0 0 0 0.25rem var(--color-primary-light-7);
}

.flat-input input:disabled {
    opacity: 0.5;
}
</style>
