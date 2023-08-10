<script setup lang="ts">
import HeaderButton from './HeaderButton.vue';

import { onMounted, ref } from 'vue';

const isDark = ref(localStorage.getItem('ipanel.theme') === 'dark');

const onClick = () => {
    isDark.value = !isDark.value;
    localStorage.setItem('ipanel.theme', isDark.value ? 'dark' : 'light');
    apply();
};

const apply = () => {
    if (isDark.value)
        document.body.classList.add('dark');
    else
        document.body.classList.remove('dark');
};

onMounted(apply);
</script>

<template>
    <HeaderButton class="header-svg-container" @click="onClick">
        <Transition name="theme" mode="out-in">
            <vue-feather type="moon" size="16" v-if="isDark" />
        </Transition>
        <Transition name="theme" mode="out-in">
            <vue-feather type="sun" size="16" v-if="!isDark" />
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