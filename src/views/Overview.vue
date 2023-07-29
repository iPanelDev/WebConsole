<script setup lang="ts">
import Header from '@/components/header/Header.vue'
import FlatInput from '@/components/flat/FlatInput.vue'
import Frown from '@/components/svg/Frown.vue'
import InstanceInfo from '@/components/InstanceInfo.vue';

import { onMounted, ref } from 'vue';
import { createNotify } from '@/notification'

import info from '@/service/info'
import { isConnected } from '@/service/ws'
import { isVerified } from '@/service/packetHandler'
import { Instance } from '@/service/types';

onMounted(() => {
    if (!isVerified || !isConnected())
        createNotify({
            title: '你貌似还未' + (isConnected() && !isVerified ? '验证' : '连接'),
            message: '请点击右上角的状态栏进行连接',
            type: 'error'
        });
});

const filter = ref('');

const filterFunc = (i: Instance) => {
    return i.address?.includes(filter.value) || i.custom_name?.includes(filter.value);
}
</script>

<template>
    <Header />
    <div id="overview-container">
        <h1>总览</h1>
        <FlatInput placeholder="搜索实例名称或地址" type="text" inputmode="none" v-model="filter" autocomplete="off" />

        <div id="panel-container">
            <InstanceInfo v-for="(value, key) in Array.from(info.instances.values()).filter(filterFunc)" :key="key"
                :instance="value" />
        </div>
        <div class="void no-select" v-if="info.instances.size === 0">
            <Frown />
            <h2>
                空空如也。
            </h2>
        </div>
        <div class="void no-select"
            v-if="info.instances.size != 0 && Array.from(info.instances.values()).filter(filterFunc).length === 0">
            <Frown />
            <h2>
                啥都没找到。
            </h2>
        </div>
        <div id="update-time" :title="info.updateTime.toLocaleString()">
            更新于 {{ info.updateTime.value.toLocaleTimeString() }}
        </div>
    </div>
</template>

<style scoped>
div#overview-container {
    margin: 20px 50px;
}

.flat-input {
    width: 100%;
    margin: 10px 0;
    flex-grow: 1;
    margin-right: 15px;
}

div#overview-container div.void {
    height: 60vh;
    max-height: 500px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color-regular);
}

div#overview-container div.void * {
    margin: 5px;
}

div#panel-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-column-gap: 20px;
    grid-row-gap: 0px;
}

div#update-time {
    color: var(--text-color-secondary);
    font-size: small;
}

@media screen and (min-width: 1000px) {
    div#panel-container {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media screen and (max-width: 768px) {
    div#panel-container {
        grid-template-columns: repeat(1, 1fr);
    }

    div#overview-container {
        margin: 10px 20px;
    }
}
</style>