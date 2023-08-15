<script setup lang="ts">
import { containerMaxW } from "@/style";
import { ref } from "vue";

const el = ref<HTMLInputElement | null>(null);
defineExpose({ el });
</script>

<template>
    <section ref="el" class="p-6" :class="containerMaxW">
        <slot />
    </section>
</template>
