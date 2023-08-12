import { ref } from "vue";

import { createNotify } from "@/notification";
import info from "@/service/info";
import { handle, isVerified } from "@/service/packetHandler";
import { Packet } from "@/service/types";
import { getConfig } from "@/utils/configManager";

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

function updateReadyState() {
    readyState.value = ws?.readyState ?? State.CLOSED;
}

/**
 * 连接
 * @param addr 地址
 * @param account 账号
 * @param password 密码
 * @returns 错误信息
 */
export function connectTo(addr: string, account: string, password: string) {
    if (getConfig().lockWebSocket)
        addr =
            (window.location.protocol === "https:" ? "wss://" : "ws://") +
            window.location.host +
            "/ws";

    if (readyState.value <= 1 || !checkValues(addr, account, password)) return;

    info.address = addr;
    info.account = account;
    info.password = password;

    try {
        ws = new WebSocket(addr);
        ws.onclose = onClose;
        ws.onmessage = onMsg;
        ws.onopen = updateReadyState;
        ws.onerror = updateReadyState;
        info.disconnectReason = "";
    } catch (e) {
        console.error(e);
        createNotify({
            title: "无法创建WS对象",
            message: (e as Error).message || e,
            type: "error",
        });
    }
}

function checkValues(addr: string, account: string, password: string) {
    if (typeof addr != "string" || !addr)
        createNotify({
            title: "填写信息有误",
            message: "WS地址为空",
            type: "error",
        });
    else if (typeof account != "string" || !account)
        createNotify({
            title: "填写信息有误",
            message: "账号为空",
            type: "error",
        });
    else if (typeof password != "string" || !password)
        createNotify({
            title: "填写信息有误",
            message: "密码为空",
            type: "error",
        });
    else return true;

    return false;
}

function onClose(e: CloseEvent) {
    updateReadyState();
    clearInterval(info.heartbeatTimer);
    console.warn("断开连接", e);
    info.disconnectReason ||= codeMap.get(e.code);

    createNotify({
        title: "连接断开了",
        message: `${
            info.disconnectReason ? info.disconnectReason + "\n" : ""
        }Code: ${e.code}`,
        type: "warn",
        duration: !info.disconnectReason && e.code === 1000 ? 5000 : -1,
    });
}

export function send(packet: Packet) {
    ws?.send(JSON.stringify(packet));
    console.debug("发送消息", packet);
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

export function disconnect() {
    ws?.close(1000);
    ws = null;
}

export function checkConnectionStatus(guid?: string) {
    if (!isVerified || !isConnected())
        createNotify({
            title:
                "你貌似还未" + (isConnected() && !isVerified ? "验证" : "连接"),
            message: "请点击左上角的Logo进行连接",
            type: "error",
        });
    else if (guid && !info.instances.has(guid)) {
        createNotify({
            type: "warn",
            title: "没有找到此实例",
            message: "请返回上一页或重新连接",
        });
    }
}
