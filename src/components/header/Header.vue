<script setup lang="ts">
import Breadcrumbs from './Breadcrumbs.vue';
import StatusBar from './StatusBar.vue';
import ToggleTheme from './ToggleTheme.vue';
</script>

<template>
    <header class="no-select">
        <div id="header-logo" @click="$router.push('/')" title="iPanel">
            <img src="@/assets/logo.png" alt="logo">
            <div class="title">iPanel</div>
        </div>
        <Breadcrumbs />
        <div id="header-rest">
            <slot></slot>
            <ToggleTheme />
            <StatusBar />
        </div>
    </header>
</template>

<style scoped>
header {
    display: flex;
    background: var(--bg-color);
    justify-content: space-between;
    min-height: 45px;
    width: 100%;
    height: 60px;
    border-bottom: 1px solid var(--border-color);
}

div#header-logo {
    height: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    margin-right: 7px;
}

div#header-logo:hover {
    cursor: pointer;
    background: var(--fill-color-light);
}

div#header-logo img {
    max-width: 30px;
}

div#header-logo div {
    font-weight: bold;
    font-size: 25px;
    font-family: 'OstrichSans-Heavy';
}

div#header-rest {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
}

div#header-rest>:deep(*) {
    margin: 0 5px;
}

:deep(div.header-svg-container) {
    cursor: pointer;
    border-radius: 50%;
}

@media screen and (max-width: 768px) {
    header {
        height: 45px;
    }

    div#header-logo div {
        opacity: 0;
        display: none;
    }
}
</style>