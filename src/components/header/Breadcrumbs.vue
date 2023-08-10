<script lang="ts" setup>
import info from '@/service/info';
import { isVerified } from '@/service/packetHandler';
import HeaderButton from './HeaderButton.vue';

const routes = {
    instance: ['/overview', '实例'],
    overview: ['/overview', '总览'],
    connect: ['/connect', '连接'],
};

const names = {
    panel: '面板',
    files: '文件管理'
};

function generate(path: string): [string, string][] {
    const array = [];
    let _path = '';

    for (const patten of path.split('/').filter(p => p)) {
        _path += `/${patten}`
        array.push(routes[patten] || [_path, /^\w{32}$/.test(patten) ? patten.substring(0, 8) : (names[patten] || patten)]);
    }

    return array;
}
</script>

<template>
    <div class="breadcrumbs" v-if="isVerified && info.account">
        <div class="breadcrumbs-item">
            <span class="breadcrumbs-splitter">/</span>
            <HeaderButton @click="$router.push('/overview')" title="当前用户">
                {{ info.account }}
            </HeaderButton>
        </div>
        <div class="breadcrumbs-item" v-for="(item, index) in generate($route.fullPath)">
            <span class="breadcrumbs-splitter">/</span>
            <HeaderButton @click="$router.push(item[0])" :title="index === 1 ? '当前实例' : null"> {{ item[1] }}</HeaderButton>
        </div>
    </div>
</template>

<style>
.breadcrumbs {
    width: 100%;
    display: flex;
    align-items: center;
    overflow-x: scroll;
}

.breadcrumbs-splitter {
    color: var(--text-color-placeholder);
}

.breadcrumbs::-webkit-scrollbar {
    visibility: hidden;
    display: none;
}

.breadcrumbs-item {
    display: flex;
}

.breadcrumbs-item .header-button {
    margin: 0 2px;
}

.breadcrumbs:nth-last-child() {
    background: #000;
}
</style>