<script setup lang="ts">
import router from '@/router'
import { getReadyState, disconnect, isConnected } from '@/service/ws'
import { isVerified } from '@/service/packetHandler'

import HeaderButton from './HeaderButton.vue'
import LogOut from '@/components/svg/LogOut.vue'

const onClick = () => {
    if (isVerified.value && isConnected())
        router.push('/overview');
    else
        router.push('/connect');
};

const exit = () => {
    disconnect();
    router.push('/connect');
};

</script>

<template>
    <HeaderButton id="status-container" class="no-select" @click="onClick" title="连接状态"
        v-if="!($route.path.startsWith('/instance') && isVerified && isConnected())">
        <div id="dot" :class="'state' + getReadyState()"></div>
        <span>{{ ['连接中', '已连接', '断开中', '未连接'][getReadyState()] }}</span>
    </HeaderButton>
    <TransitionGroup name="svg-transition">
        <HeaderButton class="header-svg-container" title="退出" v-if="isVerified && isConnected()" @click="exit">
            <LogOut />
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