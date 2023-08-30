import { useServiceStore, useConnectionStore } from "@/service/store";
import { send } from "@/service/webSocket";
import md5 from "blueimp-md5";

export function subscribe(instanceId: string) {
    if (useConnectionStore().hasVerified) {
        send({
            type: "request",
            sub_type: "subscribe",
            data: instanceId,
        });
        useServiceStore().subscribeTarget = instanceId;
    }
}

export function dissubscribe() {
    if (useConnectionStore().hasVerified) {
        send({
            type: "request",
            sub_type: "dissubscribe",
        });
        useServiceStore().subscribeTarget = "";
    }
}

export function verify(uuid: string) {
    const serviceStore = useServiceStore();
    send({
        type: "request",
        sub_type: "verify",
        data: {
            token: md5(uuid + serviceStore.account + serviceStore.password),
            account: serviceStore.account,
            client_type: "console",
        },
    });
}

export function listInstance() {
    const connectionStore = useConnectionStore();

    if (connectionStore.state !== 1) {
        connectionStore.clearTimer();
        return;
    }

    send({
        type: "request",
        sub_type: "list_instance",
    });
}

export function getCurrentUserInfo() {
    if (useConnectionStore().hasVerified) {
        send({
            type: "request",
            sub_type: "get_current_user_info",
        });
    }
}

export function getUsers() {
    if (useConnectionStore().hasVerified) {
        useServiceStore().users = [];
        send({
            type: "request",
            sub_type: "get_all_users",
        });
    }
}

export function getDirInfo(path = "") {
    if (useConnectionStore().hasVerified) {
        send({
            type: "request",
            sub_type: "get_dir_info",
            data: path,
        });
    }
}
