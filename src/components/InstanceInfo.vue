<script setup lang="ts">
import { Instance } from '@/service/types'
import router from '@/router'

import Box from '@/components/svg/Box.vue'
import Server from '@/components/svg/Server.vue'
import Clock from '@/components/svg/Clock.vue'
import File from '@/components/svg/File.vue'
import FlatPanel from '@/components/flat/FlatPanel.vue'

const props = defineProps(['instance']);

</script>

<template>
    <FlatPanel class="instance-panel" @click="router.push('/instance/' + props.instance.guid)"
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
        <div class="row">
            <Server class="instance-panel-svg" />
            服务器状态 : {{ (props.instance as Instance).short_info?.server_status ? '运行中 ' : '未启动' }}
        </div>
        <div class="row">
            <File class="instance-panel-svg" />
            启动文件 : {{ (props.instance as Instance).short_info?.server_filename || '-' }}
        </div>
        <div class="row">
            <Clock class="instance-panel-svg" />
            运行时长 : {{ (props.instance as Instance).short_info?.server_time || '-' }}
        </div>
        <div class="row">
            <Box class="instance-panel-svg" />
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

.instance-panel-svg {
    transform: scale(0.6);
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