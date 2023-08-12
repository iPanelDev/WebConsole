<script setup lang="ts">
import { useServiceStore } from "@/service/store";
import UserAvatar from "@/components/UserAvatar.vue";

const mainStore = useServiceStore();
</script>

<template>
  <UserAvatar :username="mainStore.userName" :avatar="mainStore.userAvatar">
    <slot />
  </UserAvatar>
</template>
