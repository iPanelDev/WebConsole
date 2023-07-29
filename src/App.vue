<script setup lang="ts">
import { RouterView } from 'vue-router'
import NotificationContainer from '@/notification/NotificationContainer.vue'
</script>

<template>
  <RouterView />
  <NotificationContainer />
</template>