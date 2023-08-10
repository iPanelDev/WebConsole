<script setup lang="ts">
import { convert } from '@/utils/color'

defineProps({
    line: String
});

</script>

<template>
    <div v-html="convert(line)" class="output-line"></div>
</template>

<style>
.output-line {
    padding: 0 10px;
    width: 100%;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
    line-height: 1.4;
}

.output-line:hover {
    background: var(--fill-color);
}
</style>

