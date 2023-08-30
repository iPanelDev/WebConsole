<script setup lang="ts">
import { computed, watch, ref, nextTick, onMounted } from "vue";
import OutputLine from "./OutputLine.vue";

const props = defineProps({
    datas: {
        type: Array,
        require: true,
    },
});

const scrollToBottom = () =>
    (consoleRef.value.scrollTop = consoleRef.value.scrollHeight ?? 0);

const consoleRef = ref();
const length = computed(() => props.datas.length);

watch(length, () => nextTick(scrollToBottom));
onMounted(scrollToBottom);
</script>

<template>
    <div id="console" ref="consoleRef" class="py-0.5 overflow-y-scroll">
        <OutputLine v-for="line in (datas as string[])" :line="line" />
    </div>
</template>

<style>
div#console {
    font-family: Consolas, "Courier New", Courier, "微软雅黑";
    height: 50vh;
    min-height: 500px;
    scrollbar-width: thin;
    scrollbar-color: rgb(156, 163, 175) rgb(249, 250, 251);
}

div#console::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

div#console::-webkit-scrollbar-track {
    @apply bg-gray-50;
}

div#console::-webkit-scrollbar-thumb {
    @apply bg-gray-400 rounded;
}

div#console::-webkit-scrollbar-thumb:hover {
    @apply bg-gray-500;
}

.dark div#console::-webkit-scrollbar-track {
    @apply bg-slate-900/70;
}

.dark div#console::-webkit-scrollbar-thumb {
    @apply bg-slate-600;
}

.dark div#console::-webkit-scrollbar-thumb:hover {
    @apply bg-slate-500;
}

.dark div#console {
    color-scheme: dark;
    scrollbar-color: rgb(71, 85, 105) rgb(30, 41, 59);
}
</style>
