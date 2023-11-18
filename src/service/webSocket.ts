import { createNotify } from "@/notification";
import { addToMap, clearOutputsMap } from "@/service/serverControler";
import { useConnectionStore } from "@/service/store";
import { Packet, State } from "@/service/types";

/**
 * 连接
 */
export function connect() {
    const connectionStore = useConnectionStore();

    if (connectionStore.ws?.readyState === WebSocket.OPEN) {
        return;
    }

    try {
        connectionStore.ws = new WebSocket(
            `${window.location.protocol.replace("http", "ws")}//${
                window.location.host
            }/broadcast`
        );
        connectionStore.ws.onopen = onOpen;
        connectionStore.ws.onclose = onClose;
        connectionStore.ws.onmessage = onMsg;
    } catch (e) {
        connectionStore.notice = String(e);
    }
}

/**
 * 连接事件
 */
function onOpen(e: Event) {
    console.log("WebSocket连接成功", e);
}

/**
 * 断开事件
 */
function onClose(e: CloseEvent) {
    console.warn("WebSocket断开连接", e);
    const connectionStore = useConnectionStore();

    if (connectionStore.state === State.logined) {
        setTimeout(() => {
            connect();
            console.log("尝试重连中");
        }, 1000);
    }
}

/**
 * 接收数据包
 */
function onMsg(e: MessageEvent) {
    const packet = JSON.parse(e.data) as Packet;
    console.debug("WebSocket接收消息", packet);

    const { type, sub_type, sender, data } = packet;

    if (type === "broadcast") {
        switch (sub_type) {
            case "server_start":
                clearOutputsMap(sender.instance_id);
                createNotify({
                    type: "info",
                    title: "服务器已启动",
                });
                break;

            case "server_stop":
                createNotify({
                    type: "info",
                    title: "服务器已关闭",
                    message: `退出代码：${data}`,
                });
                addToMap(sender.instance_id, [
                    `\x1b[96m[iPanel]\x1b[0m 进程已于${new Date().toLocaleTimeString()}退出(${data})`,
                ]);
                break;

            case "server_input":
                addToMap(
                    sender.instance_id,
                    data.map((line: string) => `>${line}`)
                );
                break;

            case "server_output":
                addToMap(sender.instance_id, data);
                break;
        }
    }
}

/**
 * 发送数据包
 * @param packet 数据包
 */
export function send(packet: Packet) {
    useConnectionStore().ws?.send(JSON.stringify(packet));
    console.debug("发送消息", packet);
}

/**
 * 断开连接
 */
export function disconnect() {
    const connectionStore = useConnectionStore();

    connectionStore.ws?.close(1000);
    connectionStore.isClosedByUser = true;
}
