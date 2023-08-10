<script lang="ts" setup>
import router from '@/router';
import Header from '@/components/header/Header.vue';
import { nextTick, onMounted, ref, watch } from 'vue';
import { checkConnectionStatus } from '@/service/ws';

const guid = router.currentRoute.value.params.guid as string;

onMounted(() => checkConnectionStatus(guid));

</script>

<template>
    <Header></Header>
    🚧 施工中
</template>