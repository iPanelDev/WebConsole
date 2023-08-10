<script setup lang="ts">
import FlatPanel from '@/components/flat/FlatPanel.vue';
import router from '@/router';
import { Instance } from '@/service/types';

const props = defineProps(['instance']);

</script>

<template>
    <FlatPanel class="instance-panel" @click="router.push(`/instance/${props.instance.guid}/panel`)"
        :title="props.instance.address">
        <div class="row">
            <div class="instance-panel-name" v-if="props.instance.custom_name">
                {{ (props.instance as Instance).custom_name ?? '未知名称' }}
            </div>

            <div class="instance-panel-name" v-if="!props.instance.custom_name">
                <i>未知名称</i>
            </div>

            <div class="instance-panel-address">
                ({{ (props.instance as Instance).address ?? '-' }})
            </div>
        </div>
        <div class="row instance-info">
            <vue-feather type="server" size="16" />
            服务器状态 : {{ (props.instance as Instance).short_info?.server_status ? '运行中 ' : '未启动' }}
        </div>
        <div class="row instance-info">
            <vue-feather type="file" size="16" />
            启动文件 : {{ (props.instance as Instance).short_info?.server_filename || '-' }}
        </div>
        <div class="row instance-info">
            <vue-feather type="clock" size="16" />
            运行时长 : {{ (props.instance as Instance).short_info?.server_time || '-' }}
        </div>
        <div class="row instance-info">
            <vue-feather type="box" size="16" />
            系统 : {{ (props.instance as Instance).short_info?.os }}
        </div>
    </FlatPanel>
</template>

<style scoped>
.row {
    display: flex;
    align-items: center;
    text-overflow: clip;
}

.row span {
    margin: 3px;
}

.instance-info {
    color: var(--text-color-regular);
}

.instance-panel.flat {
    display: flex;
    flex-direction: column;
    padding: 10px 15px 15px 15px;
    width: 100%;
    cursor: pointer;
}

.instance-panel-address {
    margin-left: 7px;
    color: var(--text-color-secondary);
    font-size: small;
}

.instance-panel-name {
    font-weight: bold;
}
</style>