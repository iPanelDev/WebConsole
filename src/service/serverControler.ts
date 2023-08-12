import { ref } from "vue";

import info from "./info";
import { send } from "./webSocket";

export const outputsMapTracker = ref(0);

export const outputsMap = new Map<string, string[]>(
    JSON.parse(localStorage.getItem("ipanel.outputHistory"))
);

export const inputHistory = ref(
    Array.from(
        (JSON.parse(localStorage.getItem("ipanel.inputHistory")) as string[]) ||
            []
    ).filter((l) => Boolean(l?.trim()))
);

export function start() {
    send({
        type: "action",
        sub_type: "server_start",
    });
}

export function stop() {
    send({
        type: "action",
        sub_type: "server_stop",
    });
}

export function kill() {
    if (confirm("确定结束此进程吗？\n此操作可能导致存档损坏等问题"))
        send({
            type: "action",
            sub_type: "server_kill",
        });
}

export function input(line: string) {
    send({
        type: "action",
        sub_type: "server_input",
        data: [line],
    });

    if (inputHistory.value.length > 50)
        inputHistory.value.splice(50, inputHistory.value.length - 50);

    if (line?.trim()) {
        if (inputHistory.value.includes(line))
            inputHistory.value.splice(inputHistory.value.indexOf(line), 1);
        inputHistory.value.unshift(line);
    }
    localStorage.setItem(
        "ipanel.inputHistory",
        JSON.stringify(inputHistory.value)
    );
}

export function addToMap(guid: string, list: string[]) {
    const tem = (outputsMap.get(guid) || []).concat(list);

    if (tem.length > 500) tem.splice(0, tem.length - 500);

    outputsMap.set(guid, tem);
    updateAndSave();
}

export function clearOutputsMap(guid: string) {
    outputsMap.set(guid, []);
    updateAndSave();
}

export function clearInputHistory() {
    inputHistory.value.length = 0;
    localStorage.setItem(
        "ipanel.inputHistory",
        JSON.stringify(inputHistory.value)
    );
}

export function clearInvalidOutputHistory() {
    const currentKeys = Array.from(info.instances.keys());
    const invalid = Array.from(outputsMap.keys()).filter(
        (key) => !currentKeys.includes(key)
    );

    if (invalid.length === 0) return;

    for (const item of invalid) {
        outputsMap.delete(item);
    }

    updateAndSave();
}

function updateAndSave() {
    outputsMapTracker.value = Math.random();
    localStorage.setItem(
        "ipanel.outputHistory",
        JSON.stringify(Array.from(outputsMap.entries()))
    );
}
