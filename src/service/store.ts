import { defineStore } from "pinia";
import { FullInfo, Instance } from "@/service/types";

export const useServiceStore = defineStore("user", {
    state: () => ({
        account: localStorage["ipanel.account"],

        address: localStorage["ipanel.address"],

        password: localStorage["ipanel.password"],

        /**
         * 被用户断开
         */
        isDisconnectedByUser: false,

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
         * 当前地址
         */
        currentAddress: "未知地址",

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
         * 断开原因
         */
        disconnectReason: null,

        /**
         * 心跳计时器
         */
        heartbeatTimer: null,

        /**
         * 实例信息
         */
        instanceInfos: new Map<string, [string, FullInfo][]>(),
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
