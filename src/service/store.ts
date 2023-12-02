import { Instance, InstanceInfo, State, User } from '@/service/types';
import { defineStore } from 'pinia';

export const useServiceStore = defineStore('service', {
    state: () => ({
        userName: localStorage['ipanel.userName'],

        password: localStorage['ipanel.password'],

        /**
         * 上次登录时间
         */
        lastLoginTime: null,

        /**
         * 记住密码
         */
        rememberPassword: localStorage['ipanel.rememberPassword'] === '1',

        /**
         * 自动连接
         */
        autoLogin: localStorage['ipanel.autoLogin'] === '1',

        /**
         * 实例
         */
        instances: {} as Record<string, Instance>,

        /**
         * 输出
         */
        outputs: new Map<string, string[]>(
            JSON.parse(localStorage['ipanel.outputs'] || '[]')
        ),

        /**
         * 订阅目标
         */
        subscribeTarget: null,

        /**
         * 实例信息
         */
        instanceInfosHistory: new Map<string, [string, InstanceInfo][]>(),

        /**
         * 当前用户
         */
        currentUser: {} as User,
    }),

    actions: {
        update(payload: Record<string, any>) {
            if (payload.userName) {
                this.userName = payload.userName;
            }
            if (payload.password) {
                this.password = payload.password;
            }

            this.rememberPassword = payload.rememberPassword;
            this.autoLogin = payload.autoLogin;
        },

        save() {
            localStorage['ipanel.userName'] = this.userName ?? '';
            localStorage['ipanel.password'] =
                (this.rememberPassword && this.password) || '';
            localStorage['ipanel.rememberPassword'] = Number(
                this.rememberPassword
            );
            localStorage['ipanel.autoLogin'] = Number(this.autoLogin);
        },
    },
});

export const useConnectionStore = defineStore('connection', {
    state: () => ({
        /**
         * WebSocket对象
         */
        ws: null,

        /**
         * WebSocket连接Id
         */
        wsConnectionId: null,

        /**
         * 连接状态
         */
        state: State.none,

        /**
         * 已经连接
         */
        hasConnected: false,

        /**
         * 已经通过验证
         */
        hasVerified: false,

        /**
         * 正在重连
         */
        isReconnecting: false,

        /**
         * 被用户关闭
         */
        isClosedByUser: false,

        /**
         * 断开原因
         */
        disconnectReason: null,

        /**
         * 心跳计时器
         */
        heartbeatTimer: null,

        /**
         * 提示消息
         */
        notice: null,

        /**
         * 提示消息类型
         */
        noticeType: 'warning',

        /**
         * 延迟
         */
        latency: null,

        /**
         * 上一次请求时间
         */
        lastRequestStatusTime: 0,

        /**
         * 上一次请求时间
         */
        lastRequestInstanceTime: 0,
    }),

    actions: {
        clearTimer() {
            clearInterval(this.heartbeatTimer);
        },
    },
});
