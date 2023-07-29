import { createNotify } from '@/notification'
import { Packet } from './types'
import { handle } from './packetHandler'
import info from './info'

/**
 * 状态枚举值
 */
export const State = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3
}

const codeMap = new Map<number, string>([
    [1001, 'CLOSE_GOING_AWAY.终端离开'],
    [1002, 'CLOSE_PROTOCOL_ERROR.协议错误'],
    [1003, 'CLOSE_UNSUPPORTED.接收到不允许的数据类型'],
    [1005, 'CLOSE_NO_STATUS.没有收到预期的状态码'],
    [1006, 'CLOSE_ABNORMAL.未收到关闭帧'],
    [1007, 'Unsupported Data.收到了格式不符的数据'],
    [1008, 'Policy Violation.收到不符合约定的数据'],
    [1009, 'CLOSE_TOO_LARGE.收到的数据帧过大'],
    [1010, 'Missing Extension.与服务器的拓展商定失败'],
    [1011, 'Internal Error.内部错误'],
    [1012, 'Service Restart.服务器重启'],
    [1013, 'Try Again Later.请稍后重试']
]);

/**
 * 准备状态
 */
export const getReadyState = () => ws?.readyState ?? State.CLOSED;

export const isConnected = () => ws?.readyState === 1;

let ws: WebSocket | null = null;

/**
 * 连接
 * @param addr 地址
 * @param account 账号
 * @param password 密码
 * @returns 错误信息
 */
export function connectTo(addr: string, account: string, password: string) {
    if (getReadyState() <= 1 || !check(addr, account, password))
        return;

    info.address = addr;
    info.account = account;
    info.password = password;

    try {
        ws = new WebSocket(addr);
        ws.onclose = onClose;
        ws.onmessage = onMsg;
        info.disconnectReason = '';
    }
    catch (e) {
        console.error(e);
        createNotify({
            title: '无法创建WS对象',
            message: (e as Error).message || e,
            type: 'error'
        });
    }
}

function check(addr: string, account: string, password: string) {
    if (typeof (addr) != 'string' || !addr)
        createNotify({
            title: '填写信息有误',
            message: 'WS地址为空',
            type: 'error'
        });

    else if (typeof (account) != 'string' || !account)
        createNotify({
            title: '填写信息有误',
            message: '账号为空',
            type: 'error'
        });

    else if (typeof (password) != 'string' || !password)
        createNotify({
            title: '填写信息有误',
            message: '密码为空',
            type: 'error'
        });

    else
        return true;

    return false;
}

function onClose(e: CloseEvent) {
    clearInterval(info.heartbeatTimer);
    console.warn('断开连接', e);
    info.disconnectReason ||= codeMap.get(e.code);

    createNotify({
        title: '连接断开了',
        message: `${info.disconnectReason ? info.disconnectReason + '\n' : ''}Code: ${e.code}`,
        type: 'warn',
        duration: !info.disconnectReason && e.code === 1000 ? 7500 : -1
    });
}

export function send(packet: Packet) {
    ws?.send(JSON.stringify(packet));
    console.debug('发送消息', packet);
}

function onMsg(e: MessageEvent) {
    const { data } = e;

    if (typeof (data) === 'string') {
        const packet = handle(data);

        if (packet) {
            send(packet);
        }
    }
}

export function disconnect() {
    ws?.close();
    ws = null;
}
