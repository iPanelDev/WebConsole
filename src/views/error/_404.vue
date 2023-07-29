<script setup lang="ts">
import Header from '@/components/header/Header.vue'
</script>

<template>
    <Header></Header>
    <div id="container">
        <img src="@/assets/imgs/404.png" alt="404">
        <div>
            你访问的<span class="url" @click="$router.push($route.fullPath)">{{ this.$route.fullPath }}</span>似乎不存在
        </div>
    </div>
</template>

<style scoped>
div#container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 80vh;
    width: 100%;
}

div#container img {
    width: 600px;
    max-width: 90vw;
}
</style>