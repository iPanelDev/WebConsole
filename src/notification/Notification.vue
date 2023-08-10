<script setup lang="ts">
import { notificationMap } from '@/notification';

const props = defineProps(
    {
        type: String,
        title: String,
        message: String,
        duration: Number,
        id: String
    });

const close = () => notificationMap.value.delete(props.id);

if (props.duration > 0) {
    const timer = setTimeout(() => {
        close();
        clearTimeout(timer);
    }, props.duration);
}

</script>

<template>
    <div :id="`notification-${id ?? -1}`" :class="['notification', 'notification-' + type]">
        <div class="notification-child-container no-select">
            <div class="notification-title-container">
                <vue-feather type="alert-circle" size="16" v-if="type === 'info'" />
                <vue-feather type="alert-triangle" size="16" v-if="type === 'warn'" />
                <vue-feather type="x-circle" size="16" v-if="type === 'error'" />
                <div class="notification-title">
                    {{ title || '未知' }}
                </div>
            </div>
            <div class="notification-close" @click="close" title="关闭">
                ×
            </div>
        </div>
        {{ message }}
    </div>
</template>

<style>
div.notification {
    display: flex;
    flex-direction: column;
    border: 2px solid var(--border);
    border-radius: 10px;
    padding: 10px 15px;
    word-wrap: break-word;
    word-break: break-all;
    margin: 10px 0;
    max-width: 100%;
    pointer-events: all;
    background: var(--background);
    white-space: pre-line;
}

div.notification-child-container,
div.notification-title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

div.notification-title {
    font-weight: bolder;
    display: inline;
}

div.notification-child-container>div.notification-close {
    cursor: pointer;
    color: var(--color);
    padding: 2px 5px;
}

div.notification-child-container>div.notification-close:hover {
    color: inherit;
}

div.notification-info {
    --border: var(--color-primary);
    --background: var(--color-primary-light-9);
    --color: var(--color-primary-dark-2);
}

div.notification-info:hover {
    --background: var(--color-primary-light-8);
}

div.notification-warn {
    --border: var(--color-warning);
    --background: var(--color-warning-light-9);
    --color: var(--color-warning-dark-2);
}

div.notification-warn:hover {
    --background: var(--color-warning-light-8);
}

div.notification-error {
    --border: var(--color-error);
    --background: var(--color-error-light-9);
    --color: var(--color-error-dark-2);
}

div.notification-error:hover {
    --background: var(--color-error-light-8);
}

div.notification-title-container i {
    margin-right: 3px;
}

div.notification-title-container i>svg {
    stroke: var(--color);
}
</style>
