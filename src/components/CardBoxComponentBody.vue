<script setup lang="ts">
defineProps({
    noPadding: Boolean,
});
</script>

<template>
    <div class="flex-1 w-full" :class="{ 'p-6': !noPadding }">
        <slot />
    </div>
</template>
