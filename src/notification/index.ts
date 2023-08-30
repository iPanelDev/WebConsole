import { mdiAlert, mdiAlertOctagon, mdiInformation } from "@mdi/js";
import { ref } from "vue";

export declare type NotificationOption = {
    type: NotificationType;
    title: string;
    icon?: string;
    message?: string;
    duration?: number;
};

export declare type NotificationType =
    | "white"
    | "light"
    | "info"
    | "success"
    | "contrast"
    | "warning"
    | "danger";

export const notificationMap = ref(new Map<string, NotificationOption>());

const acceptables = [
    "white",
    "light",
    "info",
    "success",
    "contrast",
    "warning",
    "danger",
];

const defaultIcons = {
    info: mdiInformation,
    success: null,
    warning: mdiAlertOctagon,
    danger: mdiAlert,
};

let id = 0;

/**
 * 显示消息
 * @param option 选项
 */
export function createNotify(option: NotificationOption | string) {
    if (typeof option === "string") {
        createNotify({ message: option, type: "info", title: "提示" });
        return;
    }

    const {
        type,
        title = "",
        message = "",
        duration = 5000,
        icon = defaultIcons[type],
    } = option;

    if (!acceptables.includes(type)) throw new TypeError("`type`类型错误");

    if (typeof message != "string") throw new TypeError("`message`类型错误");

    const currentId = id.toString();

    notificationMap.value.set(currentId, {
        type,
        title,
        message,
        duration,
        icon,
    });

    if (duration > 0)
        setTimeout(() => notificationMap.value.delete(currentId), duration);

    id += 1;
}
