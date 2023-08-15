import { useServiceStore } from "@/service/store";
import { send } from "@/service/webSocket";
import md5 from "blueimp-md5";

export function subscribe(guid: string) {
    send({
        type: "action",
        sub_type: "subscribe",
        data: guid,
    });
    useServiceStore().subscribeTarget = guid;
}

export function verify(salt: string) {
    const serviceStore = useServiceStore();
    send({
        type: "action",
        sub_type: "verify",
        data: {
            token: md5(salt + serviceStore.account + serviceStore.password),
            account: useServiceStore().account,
            client_type: "console",
        },
    });
}

export function listInstance() {
    send({
        type: "action",
        sub_type: "list_instance",
    });
}
