import { createNotify } from '@/notification';
import {
    callInstanceInput,
    callInstanceKill,
    callInstanceStart,
    callInstanceStop,
} from '@/service/requests';
import { useServiceStore } from '@/service/store';
import { getSettings } from '@/utils/settingsManager';
import { AxiosError } from 'axios';
import { ref } from 'vue';

export const inputHistory = Array.from(
    (JSON.parse(localStorage.getItem('ipanel.inputHistory')) as string[]) || []
).filter((l) => Boolean(l?.trim()));

export const inputHistoryRef = ref(inputHistory);

function failureHandler(error: any) {
    if (error instanceof AxiosError) {
        if (error.status == '403')
            createNotify({
                title: '权限不足',
                type: 'warning',
                message: '可能是用户等级权限不足或没有使用此实例的权限',
            });
    }
}

export function start(instanceId: string) {
    callInstanceStart(instanceId).catch(failureHandler);
}

export function stop(instanceId: string) {
    callInstanceStop(instanceId).catch(failureHandler);
}

export function kill(instanceId: string) {
    callInstanceKill(instanceId).catch(failureHandler);
}

const cache = [];
let timer: number;

const debounceInput = (instanceId: string, input: string) => {
    cache.push(input);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        callInstanceInput(instanceId, [...cache]).catch(failureHandler);
        cache.splice(0, cache.length);
    }, 250);
};

export function input(instanceId: string, line: string) {
    debounceInput(instanceId, line);

    if (inputHistory.length > 50)
        inputHistory.splice(50, inputHistory.length - 50);

    if (line?.trim()) {
        if (inputHistory.includes(line))
            inputHistory.splice(inputHistory.indexOf(line), 1);
        inputHistory.unshift(line);
    }
    localStorage.setItem('ipanel.inputHistory', JSON.stringify(inputHistory));

    inputHistoryRef.value = [...inputHistory];
}

export function addToMap(instanceId: string, list: string[]) {
    const serviceStore = useServiceStore();
    const tem = (serviceStore.outputs.get(instanceId) || []).concat(list);

    if (
        tem.length > getSettings().maxCacheLines &&
        getSettings().maxCacheLines > 0
    )
        tem.splice(0, tem.length - getSettings().maxCacheLines);

    serviceStore.outputs.set(instanceId, tem);
    updateAndSave();
}

export function clearOutputsMap(instanceId?: string) {
    if (instanceId != undefined) useServiceStore().outputs.set(instanceId, []);
    else useServiceStore().outputs.clear();
    updateAndSave();
}

export function clearInputHistory() {
    inputHistory.length = 0;
    localStorage.setItem('ipanel.inputHistory', JSON.stringify(inputHistory));
    inputHistoryRef.value = [...inputHistory];
}

export function clearInvalidOutputHistory() {
    const serviceStore = useServiceStore();
    const currentKeys = Array.from(Object.keys(serviceStore.instances));
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
    if (getSettings().saveOutput)
        localStorage.setItem(
            'ipanel.outputs',
            JSON.stringify(Array.from(useServiceStore().outputs.entries()))
        );
    else localStorage.setItem('ipanel.outputs', '[]');
}
