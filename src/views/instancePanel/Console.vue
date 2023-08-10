<script setup lang="ts">
import { outputsMap, outputsMapTracker } from '@/service/serverControler';
import { nextTick, ref, watch } from 'vue';
import OutputLine from './OutputLine.vue';

const props = defineProps({
    guid: String
});
const consoleRef = ref();
const outputs = ref(outputsMap.get(props.guid) || []);


watch(outputsMapTracker, () => {
    nextTick(() => consoleRef.value.scrollTop = consoleRef.value.scrollHeight ?? 0);

    outputs.value = outputsMap.get(props.guid) || [];
});
</script>

<template>
    <div class="console-container" ref="consoleRef">
        <OutputLine v-for="(v) in outputs" :line="v" />
    </div>
</template>

<style>
div.console-container {
    margin-top: 10px;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
    font-family: Consolas, 'Courier New', Courier, 微软雅黑;
    border-radius: 6px;
    border: 1px solid var(--border-color);
}
</style>