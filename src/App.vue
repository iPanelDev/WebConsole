<script setup lang="ts">
import NotificationContainer from '@/notification/NotificationContainer.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <RouterView />
  <NotificationContainer />
</template>