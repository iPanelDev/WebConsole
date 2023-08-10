<script setup lang="ts">
import FlatInput from '@/components/flat/FlatInput.vue';
import Header from '@/components/header/Header.vue';
import InstanceInfo from './InstanceInfo.vue';

import { onMounted, ref } from 'vue';

import info from '@/service/info';
import { Instance } from '@/service/types';
import { checkConnectionStatus } from '@/service/ws';

onMounted(checkConnectionStatus);

const filter = ref('');

const filterFunc = (i: Instance) => {
    return i.address?.includes(filter.value) || i.custom_name?.includes(filter.value);
}
</script>

<template>
    <Header />
    <div id="overview-container">
        <h1>总览</h1>
        <FlatInput placeholder="搜索实例名称或地址" type="text" inputmode="none" v-model="filter" autocomplete="off">
            <vue-feather type="search" size="16" />
        </FlatInput>

        <div id="panel-container">
            <InstanceInfo v-for="(value, key) in Array.from(info.instances.values()).filter(filterFunc)" :key="key"
                :instance="value" />
        </div>
        <div class="void no-select" v-if="Array.from(info.instances.values()).filter(filterFunc).length === 0">
            <vue-feather type="frown" />
            <h2 v-if="info.instances.size === 0">
                空空如也。
            </h2>
            <h2 v-else-if="info.instances.size != 0 && Array.from(info.instances.values()).filter(filterFunc).length === 0">
                啥都没找到。
            </h2>
        </div>
        <div id=" update-time" :title="info.updateTime.toLocaleString()">
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