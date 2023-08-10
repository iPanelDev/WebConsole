<script setup lang="ts">
import { createNotify } from '@/notification';
import router from '@/router';
import info from '@/service/info';
import { isVerified } from '@/service/packetHandler';
import { subscribe } from '@/service/packetSender';
import { clearInputHistory, clearOutputsMap, input, inputHistory, kill, start, stop } from '@/service/serverControler';
import { checkConnectionStatus } from '@/service/ws';
import { nextTick, onMounted, ref, watch } from 'vue';

import FlatButton from '@/components/flat/FlatButton.vue';
import FlatInput from '@/components/flat/FlatInput.vue';
import FlatPanel from '@/components/flat/FlatPanel.vue';
import FlatProgressBar from '@/components/flat/FlatProgressBar.vue';
import Header from '@/components/header/Header.vue';
import Console from '@/views/instancePanel/Console.vue';

const
    inputText = ref(''),
    inputRefWrapper = ref(),
    consoleRef = ref<{ el: HTMLElement }>(),
    isFullscreen = ref(false),
    supportFullscreen = document.fullscreenEnabled,
    guid = router.currentRoute.value.params.guid as string,
    isExist = guid && Array.from(info.instances.keys()).includes(guid),
    instance = ref(info.instances.get(guid));

let hasBeenLost = false;

watch(info.updateTime, () => {
    if (!hasBeenLost) {
        const _new = info.instances.get(guid);
        if (instance.value && !_new) {
            createNotify({
                title: '该实例已丢失',
                message: '请返回上一页重新选择实例',
                type: 'error',
                duration: -1
            });
            hasBeenLost = true;
        }
        else
            instance.value = _new;
    }
});

onMounted(() => checkConnectionStatus(guid));

if (guid && isVerified)
    subscribe(guid);

const sendInput = () => {
    input(inputText.value);
    inputText.value = '';
};

const recoverInputHistory = (value: string) => {
    inputText.value = instance.value?.short_info?.server_status ? value : undefined;
    nextTick(() => inputRefWrapper.value.el.focus());
}

const requestFullscreen = () => consoleRef.value.el.requestFullscreen();

const exitFullscreen = () => document.exitFullscreen();

document.onfullscreenchange = () => isFullscreen.value = document.fullscreenElement !== null;

</script>

<template>
    <Header>
    </Header>
    <div id="details-container">
        <h1 class="details-title no-select">
            <div class="instance-panel-name">
                <span v-if="instance?.custom_name">
                    {{ instance?.custom_name }}
                </span>
                <span v-else><i>未知名称</i></span>
            </div>
            <div class="instance-panel-actions">
                <FlatButton @click="router.push(`/instance/${guid}/files`)">
                    文件管理
                </FlatButton>
            </div>
        </h1>
        <div id="panel-container">
            <FlatPanel id="info">
                <h3 class="details-title no-select">
                    <vue-feather type="info" size="16" />
                    基础信息
                </h3>
                <table>
                    <tr>
                        <td class="info-text no-select">
                            <vue-feather type="server" size="14" />
                            状态
                        </td>
                        <td class="info-item">
                            {{ instance?.short_info?.server_status ? '运行中' : '未启动' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="info-text no-select">
                            <vue-feather type="file" size="14" />
                            启动文件
                        </td>
                        <td class="info-item">
                            {{ instance?.short_info?.server_filename ?? '-' }}
                        </td>
                    </tr>
                    <tr>
                        <td class="info-text no-select">
                            <vue-feather type="clock" size="14" />
                            运行时间
                        </td>
                        <td class="info-item">
                            {{ instance?.short_info?.server_time ?? '-' }}
                        </td>
                    </tr>
                </table>
            </FlatPanel>


            <FlatPanel id="control">
                <h3 class="details-title no-select">
                    <vue-feather type="tool" size="16" />
                    控制
                </h3>
                <div>
                    <FlatButton :disabled="hasBeenLost || !isExist || instance?.short_info?.server_status" @click="start">
                        启动
                    </FlatButton>
                    <FlatButton :disabled="hasBeenLost || !isExist || !instance?.short_info?.server_status" @click="stop">
                        关闭
                    </FlatButton>
                    <FlatButton :disabled="hasBeenLost || !isExist || !instance?.short_info?.server_status" @click="kill" class="danger">
                        强制结束
                    </FlatButton>
                </div>
            </FlatPanel>

            <FlatPanel id="monitor">
                <h3 class="details-title no-select">
                    <vue-feather type="pie-chart" size="16" />
                    性能监控
                </h3>
                <div>
                    <div class="monitor-name">
                        服务器进程占用
                    </div>
                    <FlatProgressBar :loading="!instance?.full_info?.server?.status"
                        :percentage="instance?.full_info?.server?.usage" />
                    <div class="monitor-value" v-if="instance?.full_info?.server?.status">{{
                        `${instance?.full_info?.server?.usage.toFixed(0)}%` }}
                    </div>
                    <div class="monitor-value" v-else>-%</div>
                    <div class="monitor-name" id="monitor-cpu">
                        <div>CPU</div>
                        <div>{{ instance?.full_info?.sys?.cpu_name }}</div>
                    </div>
                    <FlatProgressBar :loading="!Boolean(instance?.full_info?.sys?.cpu_usage)"
                        :percentage="instance?.full_info?.sys?.cpu_usage" />
                    <div class="monitor-value" v-if="Boolean(instance?.full_info?.sys?.cpu_usage)">{{
                        `${instance?.full_info?.sys?.cpu_usage?.toFixed(0)}%` }}
                    </div>
                    <div class="monitor-value" v-else>-%</div>
                    <div class="monitor-name" id="monitor-ram">
                        <div>
                            内存
                        </div>
                        <div v-if="Boolean(instance?.full_info?.sys?.ram_usage)">
                            {{ ((instance?.full_info?.sys?.total_ram - instance?.full_info?.sys?.free_ram) / 1024 /
                                1024).toFixed(1) }}
                            /
                            {{ (instance?.full_info?.sys?.total_ram / 1024 / 1024)?.toFixed(1) }}
                            GB
                        </div>
                    </div>
                    <FlatProgressBar :loading="!Boolean(instance?.full_info?.sys?.ram_usage)"
                        :percentage="instance?.full_info?.sys?.ram_usage" />
                    <div class="monitor-value" v-if="Boolean(instance?.full_info?.sys?.ram_usage)">{{
                        `${instance?.full_info?.sys?.ram_usage?.toFixed(0)}%` }}
                    </div>
                    <div class="monitor-value" v-else>-%</div>
                    <div class="monitor-name"> 操作系统 </div>
                    <div class="monitor-value" id="monitor-os">{{ instance?.full_info?.sys?.os ?? '-' }}</div>
                </div>
            </FlatPanel>

            <FlatPanel id="console" ref="consoleRef">
                <h3 class="details-title no-select">
                    <vue-feather type="terminal" size="16" />
                    控制台
                    <div class="void"></div>
                    <vue-feather type="trash" size="16" class="hover-effect-svg" title="清屏"
                        @click="clearOutputsMap(guid)" />
                    <vue-feather type="maximize-2" size="16" class="hover-effect-svg" title="全屏" @click="requestFullscreen"
                        v-show="!isFullscreen && supportFullscreen" />
                    <vue-feather type="minimize-2" size="16" class="hover-effect-svg" title="退出全屏" @click="exitFullscreen"
                        v-show="isFullscreen && supportFullscreen" />
                </h3>
                <div id="console-wrapper">
                    <Console :guid="instance?.guid" />
                </div>
                <div id="console-input-wrapper">
                    <FlatInput v-model="inputText" inputmode="text" @keyup.up="inputText = inputHistory[0]"
                        @keyup.enter="sendInput" :disabled="hasBeenLost || !isExist || !instance?.short_info?.server_status"
                        ref="inputRefWrapper" placeholder=">在此输入命令..." />
                    <FlatButton @click="sendInput"
                        :disabled="hasBeenLost || !isExist || !instance?.short_info?.server_status">
                        发送
                    </FlatButton>
                </div>
            </FlatPanel>

            <FlatPanel id="history">
                <h3 class="details-title no-select">
                    <vue-feather type="archive" size="16" />
                    输入历史
                    <div class="void"></div>
                    <vue-feather type="trash" size="16" class="hover-effect-svg" title="清除所有" @click="clearInputHistory" />
                </h3>
                <div v-for="(v) in inputHistory" class="history-item" @click="() => recoverInputHistory(v)">
                    {{ v.replace(/\s/g, '&nbsp;') }}
                </div>
            </FlatPanel>
        </div>

    </div>
</template>

<style>
@import './main.css';
@import './mobile.css';
@import './desktop.css';
</style>