import { ref } from "vue"

export declare type NotificationOption = {
    type: NotificationType,
    title: string,
    message?: string,
    duration?: number,
}

export declare type NotificationType = 'info' | 'warn' | 'error';

export const notificationMap = ref(new Map<string, NotificationOption>);

let id = 0;

/**
 * 显示消息
 * @param option 选项
 */
export function createNotify(option: NotificationOption | string) {
    if (typeof (option) === 'string') {
        createNotify({ message: option, type: 'info', title: '提示' });
        return;
    }

    const { type, title = '', message = '', duration = 5000 } = option;


    if (!['info', 'warn', 'error'].includes(type))
        throw new TypeError('`type`类型错误');

    if (typeof (message) != 'string')
        throw new TypeError('`message`类型错误');

    notificationMap.value.set(id.toString(), {
        type, title, message, duration
    });

    id += 1;
}

export function dismissAll() {
    id = 0;
    notificationMap.value.clear();
}