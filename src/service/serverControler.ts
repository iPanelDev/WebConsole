import { ref } from "vue";

import { useServiceStore } from "@/service/store";
import { send } from "@/service/webSocket";

export const inputHistory = Array.from(
    (JSON.parse(localStorage.getItem("ipanel.inputHistory")) as string[]) || []
).filter((l) => Boolean(l?.trim()));

export const inputHistoryRef = ref(inputHistory);

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

    if (inputHistory.length > 50)
        inputHistory.splice(50, inputHistory.length - 50);

    if (line?.trim()) {
        if (inputHistory.includes(line))
            inputHistory.splice(inputHistory.indexOf(line), 1);
        inputHistory.unshift(line);
    }
    localStorage.setItem("ipanel.inputHistory", JSON.stringify(inputHistory));

    inputHistoryRef.value = [...inputHistory];
}

export function addToMap(guid: string, list: string[]) {
    const serviceStore = useServiceStore();
    const tem = (serviceStore.outputs.get(guid) || []).concat(list);

    if (tem.length > 500) tem.splice(0, tem.length - 500);

    serviceStore.outputs.set(guid, tem);
    updateAndSave();
}

export function clearOutputsMap(guid: string) {
    useServiceStore().outputs.set(guid, []);
    updateAndSave();
}

export function clearInputHistory() {
    inputHistory.length = 0;
    localStorage.setItem("ipanel.inputHistory", JSON.stringify(inputHistory));
    inputHistoryRef.value = [...inputHistory];
}

export function clearInvalidOutputHistory() {
    const serviceStore = useServiceStore();
    const currentKeys = Array.from(serviceStore.instances.keys());
    const invalid = Array.from(serviceStore.outputs.keys()).filter(
        (key) => !currentKeys.includes(key)
    );

    if (invalid.length === 0) return;

    for (const item of invalid) {
        serviceStore.outputs.delete(item);
    }

    updateAndSave();
}

function updateAndSave() {
    sessionStorage.setItem(
        "ipanel.outputs",
        JSON.stringify(Array.from(useServiceStore().outputs.entries()))
    );
}
