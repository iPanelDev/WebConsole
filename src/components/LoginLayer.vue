<script setup lang="ts">
import SectionFullScreen from "@/components/SectionFullScreen.vue";
import LoginCardBox from "@/components/LoginCardBox.vue";
import { useConnectionStore } from "@/service/store";
import { State } from "@/service/types";

const connectionStore = useConnectionStore();

const show = connectionStore.state != 1;
</script>

<template>
    <SectionFullScreen
        bg="blur"
        class="fixed w-full select-none"
        style="z-index: 49"
        v-if="show && connectionStore.state != State.logined"
    >
        <LoginCardBox />
    </SectionFullScreen>
</template>
