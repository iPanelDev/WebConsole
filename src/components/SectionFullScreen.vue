<script setup lang="ts">
import { computed } from "vue";
import { useStyleStore } from "@/style";
import {
    gradientBgPurplePink,
    gradientBgBlue,
    gradientBgDark,
    gradientBgPinkRed,
} from "@/style/colors";

const props = defineProps({
    bg: {
        type: String,
        required: true,
    },
});

const colorClass = computed(() => {
    if (props.bg === "blur") {
        return "backdrop-blur-sm";
    }
    if (useStyleStore().darkMode) {
        return gradientBgDark;
    }

    switch (props.bg) {
        case "purplePink":
            return gradientBgPurplePink;
        case "pinkRed":
            return gradientBgPinkRed;
        case "blue":
            return gradientBgBlue;
    }

    return "";
});
</script>

<template>
    <div
        class="flex min-h-screen items-center justify-center"
        :class="colorClass"
    >
        <slot />
    </div>
</template>
