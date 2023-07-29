<script setup lang="ts">
import Sun from '@/components/svg/Sun.vue'
import Moon from '@/components/svg/Moon.vue'
import HeaderButton from './HeaderButton.vue'

import { ref, shallowRef } from 'vue';

const svg = shallowRef(Sun);

const isDark = ref(localStorage.getItem('ipanel.theme') === 'dark');

const onClick = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('ipanel.theme', isDark.value ? 'dark' : 'light');
    svg.value = isDark.value ? Moon : Sun;
    toggle();
};

const toggle = () => {
    if (isDark.value)
        document.body.classList.add('dark');
    else
        document.body.classList.remove('dark');
};

toggle();
</script>

<template>
    <HeaderButton class="header-svg-container" @click="onClick">
        <Transition name="theme" mode="out-in">
            <component :is="svg" />
        </Transition>
    </HeaderButton>
</template>

<style scoped>
div.header-svg-container {
    overflow: hidden;
}

.theme-enter-from {
    transform: translate(-30px, 20px)
}

.theme-leave-to {
    transform: translate(30px, 20px)
}
</style>