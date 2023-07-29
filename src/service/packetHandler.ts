import md5 from 'blueimp-md5'
import { ref } from 'vue';

import { createNotify } from '@/notification'
import router from '@/router'
import info from './info';
import { send } from './ws'
import { addToMap, clearOutputsMap, updateStatus, clearInvalidOutputHistory } from '@/service/serverControler'
import { Packet, Instance, FullInfo } from './types'
import { listInstance, verify } from './packetSender';

export const isVerified = ref(false);

export function handle(msg: string): Packet | void {
    const packet = JSON.parse(msg) as Packet;
    console.debug('接收消息', packet);
    const { type } = packet;

    switch (type) {
        case 'action':
            actions(packet);
            break;

        case 'event':
            events(packet);
            break;

        default:
            console.error('数据包类型未知：'+type);
            break;
    }

}

function actions({ sub_type, data }: Packet) {
    switch (sub_type) {
        case 'verify_request':
            verify(md5(data.random_key + info.password));
            break;

        default:
            break;
    }
}

function events({ sub_type, data }: Packet): Packet | void {
    switch (sub_type) {
        case 'verify_result':
            isVerified.value = data.success;
            if (!data.success)
                createNotify({
                    title: '验证失败',
                    message: data.reason || '原因未知',
                    type: 'warn'
                });
            else {
                createNotify({
                    title: '验证成功',
                    type: 'info'
                });
                router.push('/overview');
                info.heartbeatTimer = setInterval(listInstance, 2500);
                listInstance();
            }
            break;

        case 'disconnection':
            info.disconnectReason = data?.reason ?? String(data);
            break;

        case 'list':
            updateList(data);
            break;

        case 'target_info':
            processTargetInfo(data);
            break;

        case 'server_start':
            clearOutputsMap(info.subscribeTarget);
            createNotify({
                type: 'info',
                title: '服务器已启动'
            });
            updateStatus(info.subscribeTarget, true);
            break;

        case 'server_stop':
            createNotify({
                type: 'info',
                title: '服务器已关闭',
                message: `退出代码：${data}`
            });
            updateStatus(info.subscribeTarget, false);
            break;

        case 'server_input':
            addToMap(info.subscribeTarget, data.map((line: string) => `>${line}`));
            break;

        case 'server_output':
            addToMap(info.subscribeTarget, data);
            break;
    }
}

function processTargetInfo(data?: FullInfo) {
    if (!info.subscribeTarget || !data)
        return;

    const targetInstance = info.instances.get(info.subscribeTarget);

    if (!targetInstance)
        return;

    targetInstance.full_info = data;
    info.instances.set(info.subscribeTarget, targetInstance);
}

function updateList(data?: { type: string, list: Instance[] }) {
    if (data.type === 'instance') {
        const newGuids = data.list.map((i) => i.guid);
        const oldGuids = Array.from(info.instances.keys());

        // 清除无效的ID
        const invalidGuids = oldGuids.filter((g) => !newGuids.includes(g));
        invalidGuids.forEach((v) => info.instances.delete(v));

        for (const instance of data.list) {
            if (newGuids.includes(instance.guid) && oldGuids.includes(instance.guid)) {
                const fullInfo = info.instances.get(instance.guid)?.full_info;
                instance.full_info = fullInfo;
            }
            info.instances.set(instance.guid, instance);
        }
        info.updateTime.value = new Date();
        clearInvalidOutputHistory();
    }
}
