import { ref } from "vue";

import { createNotify } from "@/notification";
import { handle } from "@/service/packetHandler";
import { Packet } from "@/service/types";
import { getWebGlobalConfig } from "@/utils/configManager";
import { useConnectionStore, useServiceStore } from "./store";
import { useRoute } from "vue-router";

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

    let address = serviceStore.address;
    if (getWebGlobalConfig().lockWebSocket)
        address =
            (window.location.protocol === "https:" ? "wss://" : "ws://") +
            window.location.host +
            "/ws";

    if (
        !skipCheck &&
        (connectionStore.state <= 1 ||
            !checkValues(address, serviceStore.account, serviceStore.password))
    )
        return;
    connectionStore.$reset();

    try {
        connectionStore.ws = new WebSocket(address);
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
function checkValues(addr: string, account: string, password: string) {
    const connectionStore = useConnectionStore();

    if (typeof addr != "string" || !addr)
        connectionStore.errorMsg = "WS地址为空";
    else if (typeof account != "string" || !account)
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
 * 检查连接状态
 * @param instanceId
 */
export function checkConnectionStatus(instanceId?: string) {
    const connectionStore = useConnectionStore();
    if (!connectionStore.hasVerified || connectionStore.state === 1)
        createNotify({
            title:
                "你貌似还未" +
                (connectionStore.state === 1 && !connectionStore.hasVerified
                    ? "验证"
                    : "连接"),
            message: "请点击左上角的Logo进行连接",
            type: "danger",
        });
    else if (instanceId && !useServiceStore().instances.has(instanceId)) {
        createNotify({
            type: "danger",
            title: "没有找到此实例",
            message: "请返回上一页或重新连接",
        });
    }
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
        (!getWebGlobalConfig().lockWebSocket && !serviceStore.address) ||
        !serviceStore.autoReconnect
    )
        return;

    try {
        reconnectTime.value = new Date();
        connectionStore.isReconnecting = true;

        const lockWebSocket = getWebGlobalConfig().lockWebSocket;
        const url = lockWebSocket ? null : new URL(serviceStore.address);
        const address = lockWebSocket
            ? "/api/ping"
            : (url.protocol === "wss:" ? "https:" : "http:") +
              `//${url.host}/api/ping`;
        await fetch(address);
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

setTimeout(reconnect, 200);
setInterval(updateReadyState, 200);
