import { useServiceStore } from "@/service/store";
import { Instance, SimplePacket, Status, User } from "@/service/types";
import axios from "axios";
import md5 from "blueimp-md5";

async function getData(url: string, init?: RequestInit) {
    return (await (await fetch(url, init)).json()) as SimplePacket;
}

async function deleteData(url: string, init?: RequestInit) {
    init ??= {};
    return (await (
        await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...init.headers,
            },
            ...init,
        })
    ).json()) as SimplePacket;
}

async function postJson(url: string, body: Object, init?: RequestInit) {
    init ??= {};
    return (await (
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...init.headers,
            },
            body: JSON.stringify(body),
            ...init,
        })
    ).json()) as SimplePacket;
}

/**
 * 生成uuid
 */
async function generateUUID() {
    return (await getData("/api/generateUUID")).data as string;
}

/**
 * 登录
 */
export async function login() {
    const serviceStore = useServiceStore();

    const { code, data } = await postJson("/api/login", {
        user_name: serviceStore.userName,
        token: md5(
            (await generateUUID()) +
                serviceStore.userName +
                serviceStore.password
        ),
    });

    if (code !== 200) throw new Error(`登录失败：${data}`);

    return data as Status;
}

/**
 * 获取登录态
 */
export async function getStatus() {
    return (await getData("/api/status")).data as Status;
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo() {
    return (await getData("/api/user/current")).data as User;
}

/**
 * 获取当前用户信息
 */
export async function listUsers() {
    return (await getData("/api/user/all")).data as Record<string, User>;
}

/**
 * 删除用户
 */
export async function deleteUser(userName: string) {
    return await deleteData(`/api/user/${encodeURIComponent(userName)}`);
}

/**
 * 获取实例
 */
export async function listInstance(): Promise<Instance[]> {
    return (await axios.get<SimplePacket>("/api/instance/all")).data.data;
}
