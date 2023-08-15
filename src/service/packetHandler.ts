import { ref } from "vue";

import { createNotify } from "@/notification";
import router from "@/router";
import { listInstance, verify } from "@/service/packetSender";
import { addToMap, clearOutputsMap } from "@/service/serverControler";
import { useServiceStore } from "@/service/store";
import { FullInfo, Instance, Packet } from "@/service/types";

export const isVerified = ref(false);

/**
 * 处理数据包
 */
export function handle(msg: string): Packet | void {
    const packet = JSON.parse(msg) as Packet;
    console.debug("接收消息", packet);
    const { type } = packet;

    switch (type) {
        case "action":
            actions(packet);
            break;

        case "return":
            returns(packet);
            break;

        case "broadcast":
            broadcasts(packet);
            break;

        case "event":
            events(packet);
            break;

        default:
            console.error("数据包类型未知：" + type);
            break;
    }
}

/**
 * 处理未知子类型的数据包
 */
function logUnknownSubType(sub_type: string) {
    console.error("数据包子类型未知：" + sub_type);
}

/**
 * 处理`action`数据包
 */
function actions({ sub_type, data }: Packet) {
    switch (sub_type) {
        case "verify_request":
            verify(data.salt);
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理`event`数据包
 */
function events({ sub_type, data }: Packet): Packet | void {
    const serviceStore = useServiceStore();

    switch (sub_type) {
        case "verify_result":
            isVerified.value = data.success;
            if (!data.success)
                createNotify({
                    title: "验证失败",
                    message: data.reason || "原因未知",
                    type: "warn",
                });
            else {
                createNotify({
                    title: "验证成功",
                    type: "info",
                });
                router.push(
                    (router.currentRoute.value.query["redirect"] as string) ||
                        "/overview"
                );
                serviceStore.lastLogin = new Date();
                serviceStore.heartbeatTimer = setInterval(listInstance, 2500);
                listInstance();
            }
            break;

        case "disconnection":
            serviceStore.disconnectReason = data?.reason ?? String(data);
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理`broadcast`数据包
 */
function broadcasts({ sub_type, data }: Packet) {
    const serviceStore = useServiceStore();

    switch (sub_type) {
        case "server_start":
            clearOutputsMap(serviceStore.subscribeTarget);
            createNotify({
                type: "info",
                title: "服务器已启动",
            });
            break;

        case "server_stop":
            createNotify({
                type: "info",
                title: "服务器已关闭",
                message: `退出代码：${data}`,
            });
            break;

        case "server_input":
            addToMap(
                serviceStore.subscribeTarget,
                data.map((line: string) => `>${line}`)
            );
            break;

        case "server_output":
            addToMap(serviceStore.subscribeTarget, data);
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理`return`数据包
 */
function returns({ sub_type, data }: Packet) {
    switch (sub_type) {
        case "list":
            updateList(data);
            break;

        case "target_info":
            processTargetInfo(data);
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理目标实例的信息
 */
function processTargetInfo(data?: FullInfo) {
    const serviceStore = useServiceStore();

    if (!serviceStore.subscribeTarget || !data) return;

    const targetInstance = serviceStore.instances.get(
        serviceStore.subscribeTarget
    );

    if (!targetInstance) return;

    targetInstance.full_info = data;
    serviceStore.instances.set(serviceStore.subscribeTarget, targetInstance);
    serviceStore.updateInfo(data);
}

/**
 * 更新实例列表
 */
function updateList(data?: { type: "instance"; list: Instance[] }) {
    const serviceStore = useServiceStore();
    if (data.type === "instance") {
        const newGuids = data.list.map((i) => i.guid);
        const oldGuids = Array.from(serviceStore.instances.keys());

        // 清除无效的ID
        const invalidGuids = oldGuids.filter((g) => !newGuids.includes(g));
        invalidGuids.forEach((v) => serviceStore.instances.delete(v));

        for (const instance of data.list) {
            if (
                newGuids.includes(instance.guid) &&
                oldGuids.includes(instance.guid)
            ) {
                const fullInfo = serviceStore.instances.get(
                    instance.guid
                )?.full_info;
                instance.full_info = fullInfo;
            }
            serviceStore.instances.set(instance.guid, instance);
        }
    }
}
