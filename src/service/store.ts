import { defineStore } from "pinia";
import { FullInfo, Instance, User } from "@/service/types";

export const useServiceStore = defineStore("service", {
    state: () => ({
        account: localStorage["ipanel.account"],

        address: localStorage["ipanel.address"],

        password: localStorage["ipanel.password"],

        /**
         * 上次登录时间
         */
        lastLoginTime: null,

        /**
         * 记住密码
         */
        rememberPassword: localStorage["ipanel.rememberPassword"] === "1",

        /**
         * 自动连接
         */
        autoReconnect: localStorage["ipanel.autoReconnect"] === "1",

        /**
         * 实例
         */
        instances: new Map<string, Instance>(),

        /**
         * 输出
         */
        outputs: new Map<string, string[]>(
            JSON.parse(localStorage["ipanel.outputs"] || "[]")
        ),

        /**
         * 订阅目标
         */
        subscribeTarget: null,

        /**
         * 实例信息
         */
        instanceInfosHistory: new Map<string, [string, FullInfo][]>(),

        /**
         * 当前用户
         */
        currentUser: {} as User,

        /**
         * 用户列表
         */
        users: [],
    }),

    actions: {
        input(payload: Record<string, any>) {
            if (payload.account) {
                this.account = payload.account;
            }
            if (payload.address) {
                this.address = payload.address;
            }
            if (payload.password) {
                this.password = payload.password;
            }

            this.rememberPassword = payload.rememberPassword;
            this.autoReconnect = payload.autoReconnect;
        },

        save() {
            localStorage["ipanel.account"] = this.account ?? "";
            localStorage["ipanel.address"] = this.address ?? "";
            localStorage["ipanel.password"] =
                (this.rememberPassword && this.password) || "";
            localStorage["ipanel.rememberPassword"] = Number(
                this.rememberPassword
            );
            localStorage["ipanel.autoReconnect"] = Number(this.autoReconnect);
        },
    },
});

export const useConnectionStore = defineStore("connection", {
    state: () => ({
        /**
         * WebSocket对象
         */
        ws: null,

        /**
         * WS连接状态
         */
        state: 3,

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
         * 错误信息
         */
        errorMsg: null,
    }),

    actions: {
        clearTimer() {
            clearInterval(this.heartbeatTimer);
        },
    },
});
