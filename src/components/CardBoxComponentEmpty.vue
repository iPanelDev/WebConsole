<script setup lang="ts">
defineProps(["message"]);
</script>
<template>
    <div class="text-center py-24 text-gray-500 dark:text-slate-400">
        <p>{{ message ?? "Nothing's here…" }}</p>
    </div>
</template>
