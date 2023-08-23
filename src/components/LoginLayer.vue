<script setup lang="ts">
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import { readyState } from "@/service/webSocket";
import LoginCardBox from "./LoginCardBox.vue";

const show = readyState.value != 1;
</script>

<template>
    <SectionFullScreen
        bg="blur"
        class="fixed w-full select-none"
        style="z-index: 100"
        v-if="show && readyState != 1"
    >
        <LoginCardBox />
    </SectionFullScreen>
</template>
