<script setup lang="ts">
import { convert } from "@/utils/strings";

defineProps({
    line: String,
});
</script>

<template>
    <div
        class="whitespace-pre-wrap break-all hover:bg-[#8881] px-3 transition-colors"
        v-html="convert(line)"
    />
</template>
