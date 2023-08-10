<script setup lang="ts">
import router from '@/router';
import { isVerified } from '@/service/packetHandler';
import { disconnect, isConnected } from '@/service/ws';

import HeaderButton from './HeaderButton.vue';

const exit = () => {
    disconnect();
    router.push('/connect');
};

</script>

<template>
    <TransitionGroup name="svg-transition">
        <HeaderButton class="header-svg-container" title="退出" v-if="isVerified && isConnected()" @click="exit">
            <vue-feather type="log-out" size="16" />
        </HeaderButton>
    </TransitionGroup>
</template>

<style scoped>
div#status-container {
    min-width: 15px;
    font-size: small;
    cursor: pointer;
}

div#dot {
    width: 8px;
    height: 8px;
    display: inline-block;
    margin: auto 3px;
    background: var(--color-info-light-3);
    border-radius: 50%;
}

div#dot.state0 {
    background: #58b368;
    animation: 0.8s ease-in-out 0s infinite alternate twinkle;
}

div#dot.state1 {
    background: #58b368;
}

div#dot.state2 {
    background: #58b368;
}

@keyframes twinkle {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

.svg-transition-enter-from,
.svg-transition-leave-to {
    transform: translateY(-50px);
    opacity: 0;
}
</style>