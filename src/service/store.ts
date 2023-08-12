import { defineStore } from "pinia";
import { Instance } from "@/service/types";
import { connectTo } from "@/service/webSocket";

export const useServiceStore = defineStore("user", {
    state: () => ({
        account: null,
        address: null,
        password: null,
        lastLogin: new Date(),
        currentAddress: "未知地址",

        isFieldFocusRegistered: false,

        instances: new Map<string, Instance>(),
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

        login() {
            connectTo(this.address, this.account, this.password);
        },

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
    },
});
