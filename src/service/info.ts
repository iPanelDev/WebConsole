import { ref } from 'vue';

import { Instance } from './types';

/**
 * 断开原因
 */
let disconnectReason: string = null;

/**
 * 账号
 */
let account: string = null;

/**
 * 密码
 */
let password: string = null;

/**
 * WS地址
 */
let address: string = null;

/**
 * 实例列表
 */
const instances = new Map<string, Instance>();

/**
 * 心跳计时器
 */
let heartbeatTimer: NodeJS.Timer | number = null;

/**
 * 更新时间
 */
const updateTime = ref(new Date());

/**
 * 订阅对象
 */
let subscribeTarget: string = null;

export default {
    disconnectReason,
    account,
    password,
    address,
    instances,
    heartbeatTimer,
    updateTime,
    subscribeTarget,
}