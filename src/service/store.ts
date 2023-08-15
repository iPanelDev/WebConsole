import { defineStore } from "pinia";
import { FullInfo, Instance } from "@/service/types";
import { connectTo } from "@/service/webSocket";

// @ts-expect-error
import moment from "moment";

export const useServiceStore = defineStore("user", {
    state: () => ({
        account: null,
        address: null,
        password: null,
        lastLogin: null,
        currentAddress: "未知地址",

        isFieldFocusRegistered: false,

        // 实例
        instances: new Map<string, Instance>(),

        // 输出
        outputs: new Map<string, string[]>(
            JSON.parse(sessionStorage["ipanel.outputs"] || "[]")
        ),

        // 订阅目标
        subscribeTarget: null,

        // 断开原因
        disconnectReason: null,

        // 心跳计时器
        heartbeatTimer: null,

        // 实例信息
        instanceInfos: new Map<string, [string, FullInfo][]>(),
    }),

    actions: {
        /**
         * 设置用户
         */
        setUser(payload: Record<string, any>) {
            if (payload.account) {
                this.account = payload.account;
            }
            if (payload.address) {
                this.address = payload.address;
            }
            if (payload.password) {
                this.password = payload.password;
            }
        },

        login: () => connectTo(),

        restore() {
            if (!localStorage) return;

            this.account = localStorage["iapenl.account"];
            this.address = localStorage["iapenl.address"];
            this.password = localStorage["iapenl.password"];
        },

        save() {
            localStorage["iapenl.account"] = this.account ?? "";
            localStorage["iapenl.address"] = this.address ?? "";
            localStorage["iapenl.password"] = this.password ?? "";
        },

        updateInfo(fullInfo: FullInfo) {
            const array = this.instanceInfos.get(this.subscribeTarget) || [];

            array.push([moment().format("HH:mm:ss"), fullInfo]);

            while (array.length > 20) array.shift();

            this.instanceInfos.set(this.subscribeTarget, array);
        },
    },
});
