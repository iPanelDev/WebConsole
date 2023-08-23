import { ref } from "vue";

import { createNotify } from "@/notification";
import { handle, isVerified } from "@/service/packetHandler";
import { Packet } from "@/service/types";
import { getConfig } from "@/utils/configManager";
import { useServiceStore } from "./store";
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

let ws: WebSocket | null = null;

/**
 * 准备状态
 */
export const readyState = ref(ws?.readyState ?? State.CLOSED);

export const isConnected = () => ws?.readyState === 1;

export const isReconnecting = ref(false);

export const reconnectTime = ref(new Date());

export const errorMsg = ref("");

function updateReadyState() {
    readyState.value = ws?.readyState ?? State.CLOSED;
}

/**
 * 连接
 * @param skipCheck 跳过检查
 * @returns 错误信息
 */
export function connect(skipCheck = false) {
    const serviceStore = useServiceStore();
    errorMsg.value = null;

    let address = serviceStore.address;
    if (getConfig().lockWebSocket)
        address =
            (window.location.protocol === "https:" ? "wss://" : "ws://") +
            window.location.host +
            "/ws";

    if (
        !skipCheck &&
        (readyState.value <= 1 ||
            !checkValues(address, serviceStore.account, serviceStore.password))
    )
        return;

    try {
        ws = new WebSocket(address);
        ws.onclose = onClose;
        ws.onmessage = onMsg;
        ws.onopen = updateReadyState;
        ws.onerror = updateReadyState;
        serviceStore.disconnectReason = null;
        serviceStore.isDisconnectedByUser = false;
        reconnectTime.value = null;
    } catch (e) {
        errorMsg.value = String(e);
    }
}

/**
 * 检查输入值
 */
function checkValues(addr: string, account: string, password: string) {
    if (typeof addr != "string" || !addr) errorMsg.value = "WS地址为空";
    else if (typeof account != "string" || !account)
        errorMsg.value = "帐号为空";
    else if (typeof password != "string" || !password)
        errorMsg.value = "密码为空";
    else return true;

    return false;
}

/**
 * 断开事件
 */
function onClose(e: CloseEvent) {
    const serviceStore = useServiceStore();
    updateReadyState();
    clearInterval(serviceStore.heartbeatTimer);
    console.warn("断开连接", e);
    serviceStore.disconnectReason ||= codeMap.get(e.code);

    createNotify({
        title: "连接断开了",
        message: `${
            serviceStore.disconnectReason
                ? serviceStore.disconnectReason + "\n"
                : ""
        }Code: ${e.code}`,
        type: "warn",
        duration: !serviceStore.disconnectReason && e.code === 1000 ? 5000 : -1,
    });
    ws = null;

    if (
        isVerified.value &&
        serviceStore.autoReconnect &&
        !serviceStore.isDisconnectedByUser
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
    ws?.send(JSON.stringify(packet));
    console.debug("发送消息", packet);
}

/**
 * 断开连接
 */
export function disconnect() {
    ws?.close(1000);
    useServiceStore().isDisconnectedByUser = true;
}

/**
 * 检查连接状态
 * @param instanceId
 */
export function checkConnectionStatus(instanceId?: string) {
    if (!isVerified || !isConnected())
        createNotify({
            title:
                "你貌似还未" + (isConnected() && !isVerified ? "验证" : "连接"),
            message: "请点击左上角的Logo进行连接",
            type: "error",
        });
    else if (instanceId && !useServiceStore().instances.has(instanceId)) {
        createNotify({
            type: "warn",
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

    if (
        serviceStore.isDisconnectedByUser ||
        useRoute()?.path === "/login" ||
        window.location.pathname.includes("login") ||
        !serviceStore.address ||
        !serviceStore.autoReconnect
    )
        return;

    try {
        reconnectTime.value = new Date();
        isReconnecting.value = true;
        const url = new URL(serviceStore.address);
        const address =
            (url.protocol === "wss:" ? "https:" : "http:") +
            `//${url.host}/api/ping`;
        await fetch(address);
        connect();
    } catch (error) {
        errorMsg.value = `重连失败. ${String(error)}`;
        console.error(error);
    } finally {
        isReconnecting.value = false;
    }
}

setTimeout(reconnect, 200);
