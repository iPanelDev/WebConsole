<script setup lang="ts">
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import LoginCardBox from "@/components/LoginCardBox.vue";
import { useConnectionStore } from "@/service/store";

const connectionStore = useConnectionStore();

const show = connectionStore.state != 1;
</script>

<template>
    <SectionFullScreen
        bg="blur"
        class="fixed w-full select-none"
        style="z-index: 49"
        v-if="show && connectionStore.state != 1"
    >
        <LoginCardBox />
    </SectionFullScreen>
</template>
