import { VERSION } from "@/constant";
import { createNotify, NotificationType } from "@/notification";
import router from "@/router";
import {
    getInstanceInfo,
    getStatus,
    getUserInfo,
    getVersion,
    listInstances,
    logIn,
    logOut,
    subscribeInstance,
} from "@/service/requests";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { Instance, State, User } from "@/service/types";
import { connect } from "@/service/webSocket";
import { reactive } from "vue";

const funcQueue: Function[] = [];

export function callWhenLogined(func: Function) {
    if (typeof func !== "function") {
        return;
    }

    funcQueue.push(func);
}

/**
 * 准备登录
 */
export async function prepareToLogin() {
    const serviceStore = useServiceStore();
    const connectionStore = useConnectionStore();

    if (
        connectionStore.state == State.pending ||
        connectionStore.state == State.logined
    )
        return;

    connectionStore.notice = null;

    try {
        validateValues(serviceStore.userName, serviceStore.password);
    } catch (error) {
        console.warn(error);
        connectionStore.state = State.failure;
        connectionStore.notice = String(error.message || error);
        connectionStore.noticeType = "info" as NotificationType;
        return;
    }

    try {
        connectionStore.$reset();
        const { user } = await logIn();

        onLogined(user);
        createNotify({ type: "success", title: "登录成功" });
    } catch (error) {
        console.error(error);
        connectionStore.state = State.failure;
        connectionStore.notice = String(error.message || error);
        connectionStore.noticeType = "danger" as NotificationType;
    }
}

/**
 * 检查输入值
 */
function validateValues(userName: string, password: string) {
    if (typeof userName != "string" || !userName) throw new Error("帐号为空");
    else if (typeof password != "string" || !password)
        throw new Error("密码为空");

    return true;
}

/**
 * 更新用户信息
 */
export async function updateUserInfo() {
    useServiceStore().currentUser = await getUserInfo();
}

/**
 * 首次尝试重连
 */
async function firstReconnect() {
    const serviceStore = useServiceStore();
    if (
        !serviceStore.autoReconnect ||
        !serviceStore.userName ||
        !serviceStore.password ||
        router.currentRoute.value.path === "/login"
    ) {
        return;
    }

    const status = await getStatus();
    if (status.logined) {
        createNotify({ type: "success", title: "重连成功" });
        onLogined(status.user);
    }
}

/**
 * 登录完毕处理函数
 * @param user 用户
 */
function onLogined(user: User) {
    const connectionStore = useConnectionStore();
    const serviceStore = useServiceStore();

    connectionStore.state = State.logined;
    connectionStore.latency = 1;
    serviceStore.currentUser = user;

    funcQueue.forEach((func) => func());
    funcQueue.splice(0, funcQueue.length);

    connect();
    compareVersion();
    jumpToOverview();
}

/**
 * 跳转到总览页面
 */
export function jumpToOverview() {
    if (router.currentRoute.value.path === "/login") {
        router.push("/overview");
    }
}

/**
 * 退出登录
 */
export async function logout() {
    try {
        await logOut();
    } catch (error) {
        createNotify({
            type: "warning",
            title: "退出时异常",
            message: "更多信息请查看网页开发控制台 (F12)",
        });
    }

    const connectionStore = useConnectionStore();
    const serviceStore = useServiceStore();
    connectionStore.$reset();
    serviceStore.$reset();
    router.push("/login");
}

/**
 * 更新实例信息
 * @param instanceId 实例ID
 */
export async function updateInstancesInfo(
    instanceId: string = null
): Promise<boolean> {
    const connectionStore = useConnectionStore();

    if (connectionStore.state !== State.logined) {
        return false;
    }

    const serviceStore = useServiceStore();

    try {
        if (instanceId) {
            const map = reactive(serviceStore.instances);
            map.set(instanceId, await getInstanceInfo(instanceId));
            serviceStore.instances = map;
        } else
            serviceStore.instances = new Map<string, Instance>(
                (await listInstances()).map((instance) => [
                    instance.instanceId,
                    instance,
                ])
            );

        return true;
    } catch (error) {
        console.warn("实例信息更新失败", error);
        return false;
    }
}

/**
 * 检查状态
 */
async function checkStatus() {
    const connectionStore = useConnectionStore();

    if (connectionStore.state === State.logined) {
        try {
            const startTime = Date.now();
            const state = await getStatus();
            connectionStore.latency = Date.now() - startTime;

            if (!state.logined) {
                createNotify({
                    title: "登录状态异常",
                    message: "你被强制下线了",
                    type: "warning",
                    duration: -1,
                });
                connectionStore.state = State.none;
            }
        } catch (error) {
            connectionStore.state = State.none;
            console.error(error);
            createNotify({
                title: "连接已断开",
                message: String(error),
                type: "danger",
                duration: -1,
            });
        }
    }
}

/**
 * 订阅实例
 * @param instanceId 实例ID
 */
export async function subscirbe(instanceId: string) {
    const connectionStore = useConnectionStore();

    if (connectionStore.state === State.logined) {
        subscribeInstance(instanceId);
    }
}

/**
 * 比较版本
 */
async function compareVersion() {
    const hostVer = await getVersion();
    const hostVers = hostVer.split(".");
    const consoleVer = VERSION.split(".");

    const minLength = Math.min(hostVers.length, consoleVer.length, 3);

    let result: -1 | 0 | 1 = 0;

    for (let i = 0; i < minLength; i++) {
        if (hostVers[i] > consoleVer[i]) {
            result = -1;
            break;
        } else if (hostVers[i] < consoleVer[i]) {
            result = 1;
            break;
        }
    }

    if (result !== 0) {
        createNotify({
            type: "warning",
            title: "与后端的版本不匹配",
            message: "更多信息详见开发控制台 (F12)",
            duration: -1,
        });

        switch (result) {
            case 1:
                console.warn(
                    "与后端的版本不匹配，这可能导致部分功能不可用\n",
                    `网页控制台版本：${VERSION}（较新）\n`,
                    `后端版本：${hostVer}`
                );
                break;

            case -1:
                console.warn(
                    "与后端的版本不匹配，这可能导致部分功能不可用\n",
                    `网页控制台版本：${VERSION}\n`,
                    `后端版本：${hostVer}（较新）`
                );
                break;
        }
    }
}

setTimeout(firstReconnect, 200);
setInterval(checkStatus, 5000);
connect();
