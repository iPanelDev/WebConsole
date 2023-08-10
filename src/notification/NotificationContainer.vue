<script setup lang="ts">
import { dismissAll, notificationMap } from '@/notification';
import Notification from '@/notification/Notification.vue';
</script>

<template>
    <div id="notification-container">
        <div id="notification-container-tips" class="no-select">
            <Transition name="notify">
                <span v-show="notificationMap.size > 0" @click="dismissAll">关闭全部</span>
            </Transition>
        </div>
        <TransitionGroup name="notify">
            <Notification v-for="(kv) in notificationMap.entries()" :type="kv[1].type" :message="kv[1].message"
                :title="kv[1].title" :duration="kv[1].duration" :id="kv[0]" :key="kv[0]" />
        </TransitionGroup>
    </div>
</template>
  
<style scoped>
div#notification-container {
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-start;
    position: fixed;
    top: -10px;
    left: 0;
    bottom: 0;
    margin: 10px;
    pointer-events: none;
    z-index: 999;
    overflow-x: hidden;
    padding: 10px;
}

div#notification-container-tips {
    pointer-events: all;
    cursor: pointer;
    font-size: smaller;
    margin-right: 5px;
    height: 20px;
}

div#notification-container-tips span {
    color: var(--text-color-placeholder);
    border-bottom: transparent solid 1px;
}

div#notification-container-tips:hover span {
    color: var(--text-color-secondary);
    border-bottom: var(--text-color-secondary) solid 1px;
}

div#notification-container::-webkit-scrollbar {
    display: none;
}

@media screen and (min-width: 768px) {
    div#notification-container {
        max-width: 40vw;
    }

    div#notification-container>* {
        max-width: 40vw;
    }
}

.notify-move,
.notify-enter-active,
.notify-leave-active {
    transition: all 0.5s ease;
}

.notify-enter-from,
.notify-leave-to {
    opacity: 0;
    transform: translateX(-300px);
}
</style>