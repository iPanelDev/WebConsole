<script setup lang="ts">
import { containerMaxW } from "@/style";
import BaseLevel from "@/components/BaseLevel.vue";
import { VERSION } from "@/meta/constant";

const year = new Date().getFullYear();
</script>

<template>
    <footer class="py-2 px-6" :class="containerMaxW">
        <BaseLevel>
            <div class="text-center md:text-left">
                <b>&copy;{{ year }}, iPanel WebConsole {{ VERSION }}.</b>
                <slot />
            </div>
        </BaseLevel>
    </footer>
</template>
