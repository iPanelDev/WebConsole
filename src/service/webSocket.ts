import { createNotify } from "@/notification";
import router from "@/router";
import { addToMap, clearOutputsMap } from "@/service/serverControler";
import { useConnectionStore } from "@/service/store";
import { Packet, State } from "@/service/types";
import { subscirbe } from ".";

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
            }/ws/broadcast`
        );
        connectionStore.ws.onopen = onOpen;
        connectionStore.ws.onclose = onClose;
        connectionStore.ws.onmessage = onMsg;
        connectionStore.wsConnectionId = null;
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

    const { type, subType, sender, data } = packet;

    if (type === "broadcast") {
        switch (subType) {
            case "server_start":
                clearOutputsMap(sender.instanceId);
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
                addToMap(sender.instanceId, [
                    `\x1b[96m[iPanel]\x1b[0m 进程已于${new Date().toLocaleTimeString()}退出(${data})`,
                ]);
                break;

            case "server_input":
                addToMap(
                    sender.instanceId,
                    data.map((line: string) => `>${line}`)
                );
                break;

            case "server_output":
                addToMap(sender.instanceId, data);
                break;
        }
    } else if (type === "return" && subType === "connection_id") {
        const connectionStore = useConnectionStore();
        connectionStore.wsConnectionId = data as string;

        const instanceId = router.currentRoute.value.params["instanceId"];
        if (instanceId) subscirbe(instanceId as string);
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
