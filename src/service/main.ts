import { createNotify } from "@/notification";
import router from "@/router";
import { getStatus, getUserInfo, login } from "@/service/requests";
import { State, User } from "@/service/types";
import { unwrap } from "@/utils/wrapper";
import { useRouter } from "vue-router";
import { useConnectionStore, useServiceStore } from "@/service/store";
import { getSettings } from "@/utils/settingsManager";

/**
 * 准备登录
 */
export async function prepareToLogin() {
    const serviceStore = useServiceStore();
    const connectionStore = useConnectionStore();

    try {
        if (
            connectionStore.state == State.pending ||
            connectionStore.state == State.logined ||
            !validateValues(serviceStore.userName, serviceStore.password)
        )
            return;
        connectionStore.$reset();

        const { user } = await login();
        serviceStore.currentUser = unwrap<User>(user);
        connectionStore.state = State.logined;

        jumpToOverview();
        createNotify({ type: "success", title: "登录成功" });
    } catch (error) {
        connectionStore.state = State.failure;
        console.error(error);
        connectionStore.errorMsg = String(error);
    }
}

/**
 * 检查输入值
 */
function validateValues(userName: string, password: string) {
    if (typeof userName != "string" || !userName) throw new Error("帐号为空");
    else if (typeof password != "string" || !password)
        throw new Error("密码为空");
    else return true;
}

export async function updateUserInfo() {
    useServiceStore().currentUser = unwrap<User>(await getUserInfo());
}

/**
 * 首次尝试重连
 */
async function firstReconnect() {
    const serviceStore = useServiceStore();
    if (
        !serviceStore.autoReconnect ||
        !serviceStore.userName ||
        !serviceStore.password
    ) {
        return;
    }

    const status = await getStatus();
    if (status.logined) {
        const connectionStore = useConnectionStore();

        connectionStore.state = State.logined;
        serviceStore.currentUser = unwrap<User>(status.user);

        jumpToOverview();
        createNotify({ type: "success", title: "重连成功" });
    }
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
export function logout() {
    const connectionStore = useConnectionStore();
    const serviceStore = useServiceStore();

    connectionStore.$reset();
    serviceStore.$reset();
    useRouter().push("/login");
}

setTimeout(firstReconnect, 200);
