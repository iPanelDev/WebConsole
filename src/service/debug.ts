import { createNotify } from '@/notification';
import { ref } from 'vue';

let ws: WebSocket = null;

export const datas = ref([]);

export function connectDebugWs(pwd: string) {
    ws?.close();
    try {
        ws = new WebSocket(
            `${window.location.protocol.replace('http', 'ws')}//${
                window.location.host
            }/ws/debug`
        );
        ws.onopen = () => {
            createNotify({ title: '已连接至调试服务器', type: 'success' });
            ws.send(pwd);
        };
        ws.onclose = () =>
            createNotify({ title: '已从调试服务器断开', type: 'warning' });

        ws.onmessage = handle;
        datas.value = [];
    } catch (error) {
        createNotify({
            title: '连接失败',
            type: 'danger',
            message: String(error),
        });
    }
}

function handle(e: MessageEvent) {
    const { lines, level } = JSON.parse(e.data) as {
        lines: string[];
        level: LogLevel;
    };

    let title: string = null;
    switch (level) {
        case LogLevel.trace:
            title = 'trace';
            break;
        case LogLevel.debug:
            title = 'debug';
            break;
        case LogLevel.info:
            title = 'info';
            break;
        case LogLevel.warning:
            title = 'warning';
            break;
        case LogLevel.error:
            title = 'error';
            break;
        case LogLevel.fatal:
            title = 'fatal';
            break;

        default:
            return;
    }
    datas.value = datas.value.concat(
        lines.map((l) => `[${title.toUpperCase()}] ${l}`)
    );
}

enum LogLevel {
    none = 0,
    trace = 1,
    debug = 2,
    info = 3,
    warning = 4,
    error = 5,
    fatal = 6,
}
