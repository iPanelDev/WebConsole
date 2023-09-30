import { createNotify } from "@/notification";
import { login } from "@/service/requests";
import { addToMap, clearOutputsMap } from "@/service/serverControler";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { FullInfo, Packet } from "@/service/types";
import md5 from "blueimp-md5";
import { ref } from "vue";
import { useRoute } from "vue-router";

// @ts-expect-error
import moment from "moment";

/**
 * 状态枚举值
 */
export const State = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
};

const codeMap = new Map<number, string>([
    [1001, "CLOSE_GOING_AWAY.终端离开"],
    [1002, "CLOSE_PROTOCOL_ERROR.协议错误"],
    [1003, "CLOSE_UNSUPPORTED.接收到不允许的数据类型"],
    [1005, "CLOSE_NO_STATUS.没有收到预期的状态码"],
    [1006, "CLOSE_ABNORMAL.未收到关闭帧"],
    [1007, "Unsupported Data.收到了格式不符的数据"],
    [1008, "Policy Violation.收到不符合约定的数据"],
    [1009, "CLOSE_TOO_LARGE.收到的数据帧过大"],
    [1010, "Missing Extension.与服务器的拓展商定失败"],
    [1011, "Internal Error.内部错误"],
    [1012, "Service Restart.服务器重启"],
    [1013, "Try Again Later.请稍后重试"],
]);

export const reconnectTime = ref(new Date());

function updateReadyState() {
    const connectionStore = useConnectionStore();
    connectionStore.state = connectionStore.ws?.readyState ?? State.CLOSED;
}

/**
 * 连接
 * @param skipCheck 跳过检查
 * @returns 错误信息
 */
export function connect(skipCheck = false) {
    const serviceStore = useServiceStore();
    const connectionStore = useConnectionStore();

    login();
    try {
        connectionStore.ws = new WebSocket(
            `${window.location.protocol.replace("http", "ws")}//${
                window.location.host
            }/ws`
        );
        connectionStore.ws.onclose = onClose;
        connectionStore.ws.onmessage = onMsg;
        connectionStore.ws.onopen = updateReadyState;
        connectionStore.ws.onerror = updateReadyState;
        reconnectTime.value = null;
    } catch (e) {
        connectionStore.errorMsg = String(e);
    }
}

/**
 * 检查输入值
 */
function checkValues(userName: string, password: string) {
    const connectionStore = useConnectionStore();

    if (typeof userName != "string" || !userName)
        connectionStore.errorMsg = "帐号为空";
    else if (typeof password != "string" || !password)
        connectionStore.errorMsg = "密码为空";
    else return true;

    return false;
}

/**
 * 断开事件
 */
function onClose(e: CloseEvent) {
    const serviceStore = useServiceStore();
    const connectionStore = useConnectionStore();

    updateReadyState();
    connectionStore.clearTimer();

    console.warn("断开连接", e);
    connectionStore.disconnectReason ||= codeMap.get(e.code);

    createNotify({
        title: "连接断开了",
        message: `${
            connectionStore.disconnectReason
                ? connectionStore.disconnectReason + "\n"
                : ""
        }Code: ${e.code}`,
        type: "warning",
        duration:
            !connectionStore.disconnectReason && e.code === 1000 ? 5000 : -1,
    });
    connectionStore.ws = null;

    if (
        connectionStore.hasVerified &&
        serviceStore.autoReconnect &&
        !connectionStore.isClosedByUser
    ) {
        setTimeout(reconnect, 10000);
    }
}

function onMsg(e: MessageEvent) {
    updateReadyState();
    const { data } = e;

    if (typeof data === "string") {
        const packet = handle(data);

        if (packet) {
            send(packet);
        }
    }
}

/**
 * 发送数据包
 * @param packet 数据包
 */
export function send(packet: Packet) {
    updateReadyState();
    useConnectionStore().ws?.send(JSON.stringify(packet));
    console.debug("发送消息", packet);
}

/**
 * 断开连接
 */
export function disconnect() {
    const connectionStore = useConnectionStore();

    connectionStore.ws?.close(1000);
    connectionStore.isClosedByUser = true;
}

/**
 * 重新连接
 */
async function reconnect() {
    const serviceStore = useServiceStore();
    const connectionStore = useConnectionStore();

    if (
        connectionStore.isClosedByUser ||
        useRoute()?.path === "/login" ||
        window.location.pathname.includes("login") ||
        !serviceStore.autoReconnect
    )
        return;

    try {
        connect();
    } catch (error) {
        connectionStore.errorMsg = `重连失败. ${String(
            error?.message || error
        )}`;
        console.error(error);
    } finally {
        connectionStore.isReconnecting = false;
    }
}

// setTimeout(reconnect, 200);

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

        case "broadcast":
            broadcasts(packet);
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
    const serviceStore = useServiceStore();
    switch (sub_type) {
        case "verify_request":
            send({
                type: "request",
                sub_type: "verify",
                data: {
                    token: md5(
                        data.uuid +
                            serviceStore.userName +
                            serviceStore.password
                    ),
                    user_name: serviceStore.userName,
                    client_type: "console",
                },
            });
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
 * 处理实例的信息
 */
function processInstanceInfo(instanceId: string, fullInfo?: FullInfo) {
    if (!fullInfo) return;

    const serviceStore = useServiceStore();
    const targetInstance = serviceStore.instances.get(instanceId);

    if (!targetInstance) return;

    targetInstance.fullInfo = fullInfo;
    serviceStore.instances.set(instanceId, targetInstance);

    const array = serviceStore.instanceInfosHistory.get(instanceId) || [];
    array.push([moment().format("HH:mm:ss"), fullInfo]);

    while (array.length > 20) array.shift();

    serviceStore.instanceInfosHistory.set(instanceId, array);
}
