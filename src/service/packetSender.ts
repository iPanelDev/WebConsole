import { useServiceStore } from "@/service/store";
import { readyState, send } from "@/service/webSocket";
import md5 from "blueimp-md5";

export function subscribe(instanceId: string) {
    send({
        type: "request",
        sub_type: "subscribe",
        data: instanceId,
    });
    useServiceStore().subscribeTarget = instanceId;
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
    if (readyState.value !== 1) {
        clearInterval(useServiceStore().heartbeatTimer);
    }
    send({
        type: "request",
        sub_type: "list_instance",
    });
}
