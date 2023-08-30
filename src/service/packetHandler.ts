import { createNotify } from "@/notification";
import router from "@/router";
import {
    getCurrentUserInfo,
    getUsers,
    listInstance,
    subscribe,
    verify,
} from "@/service/packetSender";
import { addToMap, clearOutputsMap } from "@/service/serverControler";
import { useConnectionStore, useServiceStore } from "@/service/store";
import {
    DirInfo,
    FullInfo,
    Instance,
    Item,
    Packet,
    User,
} from "@/service/types";

// @ts-expect-error
import moment from "moment";

/**
 * 处理数据包
 */
export function handle(msg: string): Packet | void {
    const packet = JSON.parse(msg) as Packet;
    console.debug("接收消息", packet);
    const { type } = packet;

    switch (type) {
        case "request":
            requests(packet);
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
    console.warn("数据包子类型未知：" + sub_type);
}

/**
 * 处理`request`数据包
 */
function requests({ sub_type, data }: Packet) {
    switch (sub_type) {
        case "verify_request":
            verify(data.uuid);
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
    const connectionStore = useConnectionStore();

    switch (sub_type) {
        case "verify_result":
            connectionStore.hasVerified = data.success;
            if (!data.success)
                createNotify({
                    title: "验证失败",
                    message: data.reason || "原因未知",
                    type: "warning",
                });
            else {
                createNotify({
                    title: "验证成功",
                    type: "success",
                });

                if (router.currentRoute.value.path === "/login")
                    router.push(
                        (router.currentRoute.value.query[
                            "redirect"
                        ] as string) || "/overview"
                    );

                if (router.currentRoute.value.params["instanceId"]) {
                    subscribe(
                        router.currentRoute.value.params["instanceId"] as string
                    );
                }

                serviceStore.lastLoginTime = new Date();
                connectionStore.clearTimer();
                connectionStore.heartbeatTimer = setInterval(
                    listInstance,
                    2500
                );

                listInstance();
                getCurrentUserInfo();
            }
            break;

        case "disconnection":
            connectionStore.disconnectReason = data?.reason ?? String(data);
            break;

        case "operation_result":
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理`broadcast`数据包
 */
function broadcasts({ sub_type, data, sender }: Packet) {
    switch (sub_type) {
        case "server_start":
            clearOutputsMap(sender.instance_id);
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
            addToMap(sender.instance_id, [
                `\x1b[96m[iPanel]\x1b[0m 进程已于${new Date().toLocaleTimeString()}退出(${data})`,
            ]);
            break;

        case "server_input":
            addToMap(
                sender.instance_id,
                data.map((line: string) => `>${line}`)
            );
            break;

        case "server_output":
            addToMap(sender.instance_id, data);
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理`return`数据包
 */
function returns({ sub_type, data, sender }: Packet) {
    const serviceStore = useServiceStore();
    switch (sub_type) {
        case "instance_list":
            updateList(data);
            break;

        case "instance_info":
            processInstanceInfo(data.instance_id, data.info);
            break;

        case "user_info":
            serviceStore.currentUser = data as User;

            if (serviceStore.currentUser?.level === 3) {
                getUsers();
            }
            break;

        case "user_dict":
            const array: (User & { account: string })[] = [];
            for (const key in data) {
                const user = data[key];
                user.account = key;
                array.push(user);
            }
            serviceStore.users = array;
            break;

        case "dir_info":
            processInstanceDirInfo(sender.instance_id, data);
            break;

        default:
            logUnknownSubType(sub_type);
            break;
    }
}

/**
 * 处理实例目录信息
 */
function processInstanceDirInfo(instanceId: string, dirInfo?: DirInfo) {
    if (!dirInfo || !dirInfo?.is_exist) return;

    const serviceStore = useServiceStore();
    const dirTree =
        serviceStore.instances.get(instanceId)?.dir_tree ||
        new Map<string, Item[]>();

    dirTree.set(dirInfo.dir.replaceAll("./", ""), dirInfo.items);

    const targetInstance = serviceStore.instances.get(instanceId);
    targetInstance.dir_tree = dirTree;
    serviceStore.instances.set(instanceId, targetInstance);
}

/**
 * 处理实例的信息
 */
function processInstanceInfo(instanceId: string, fullInfo?: FullInfo) {
    if (!fullInfo) return;

    const serviceStore = useServiceStore();
    const targetInstance = serviceStore.instances.get(instanceId);

    if (!targetInstance) return;

    targetInstance.full_info = fullInfo;
    serviceStore.instances.set(instanceId, targetInstance);

    const array = serviceStore.instanceInfosHistory.get(instanceId) || [];
    array.push([moment().format("HH:mm:ss"), fullInfo]);

    while (array.length > 20) array.shift();

    serviceStore.instanceInfosHistory.set(instanceId, array);
}

/**
 * 更新实例列表
 */
function updateList(data?: Instance[]) {
    const serviceStore = useServiceStore();
    const newInstances = data.map((i) => i.instance_id);
    const oldInstances = Array.from(serviceStore.instances.keys());

    // 清除无效的ID
    const invalidGuids = oldInstances.filter((g) => !newInstances.includes(g));
    invalidGuids.forEach((v) => serviceStore.instances.delete(v));

    for (const instance of data) {
        if (
            newInstances.includes(instance.instance_id) &&
            oldInstances.includes(instance.instance_id)
        ) {
            const oldInstance = serviceStore.instances.get(
                instance.instance_id
            );
            instance.full_info = oldInstance?.full_info;
            instance.short_info = oldInstance?.short_info;
            instance.dir_tree = oldInstance?.dir_tree;
        }
        serviceStore.instances.set(instance.instance_id, instance);
    }
}
