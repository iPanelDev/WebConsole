import { useConnectionStore, useServiceStore } from "@/service/store";
import { SimplePacket } from "@/service/types";
import axios from "axios";
import md5 from "blueimp-md5";

/**
 * 登录
 */
export async function logIn() {
    const serviceStore = useServiceStore();

    const time = new Date().toISOString();
    const {
        status,
        data: { data },
    } = await axios.post<SimplePacket>(
        "/api/user/@self/login",
        JSON.stringify({
            userName: serviceStore.userName,
            time,
            md5: md5(
                `${time}.${serviceStore.userName}.${serviceStore.password}`
            ),
        }),
        {
            headers: {
                "Content-Type": "application/json",
            },
            validateStatus: () => true,
        }
    );

    if (status !== 200) {
        throw new Error(data);
    }

    return data;
}

/**
 * 退出
 */
export async function logOut() {
    await axios.get<SimplePacket>("/api/user/@self/logout");
}

/**
 * 获取登录态
 */
export async function getStatus() {
    return (await axios.get<SimplePacket>("/api/user/@self/status")).data.data;
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo() {
    return (await axios.get<SimplePacket>("/api/user/@self")).data.data;
}

/**
 * 获取当前用户信息
 */
export async function listUsers() {
    return (await axios.get<SimplePacket>("/api/user")).data.data;
}

/**
 * 删除用户
 */
export async function deleteUser(userName: string) {
    return await axios.delete<SimplePacket>(
        `/api/user/${encodeURIComponent(userName)}`
    );
}

/**
 * 获取实例
 */
export async function listInstances() {
    return (await axios.get<SimplePacket>("/api/instance")).data.data;
}

/**
 * 获取实例信息
 */
export async function getInstanceInfo(instanceId: string) {
    return (
        await axios.get<SimplePacket>(
            `/api/instance/${encodeURIComponent(instanceId)}`
        )
    ).data.data;
}

/**
 * 订阅实例
 * @param instanceId 实例ID
 */
export async function subscribeInstance(instanceId: string) {
    await axios.get<SimplePacket>(
        `/api/instance/${encodeURIComponent(
            instanceId
        )}/subscribe?connectionId=${useConnectionStore().wsConnectionId}`
    );
}

/**
 * 启动实例
 * @param instanceId 实例ID
 */
export async function callInstanceStart(instanceId: string) {
    await axios.get<SimplePacket>(
        `/api/instance/${encodeURIComponent(instanceId)}/start`
    );
}

/**
 * 关闭实例
 * @param instanceId 实例ID
 */
export async function callInstanceStop(instanceId: string) {
    await axios.get<SimplePacket>(
        `/api/instance/${encodeURIComponent(instanceId)}/stop`
    );
}

/**
 * 关闭实例
 * @param instanceId 实例ID
 */
export async function callInstanceKill(instanceId: string) {
    await axios.get<SimplePacket>(
        `/api/instance/${encodeURIComponent(instanceId)}/kill`
    );
}

/**
 * 关闭实例
 * @param instanceId 实例ID
 * @param inputs 输入
 */
export async function callInstanceInput(instanceId: string, inputs: string[]) {
    await axios.post<SimplePacket>(
        `/api/instance/${encodeURIComponent(instanceId)}/input`,
        JSON.stringify(inputs),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

/**
 * 获取iPanel版本号
 * @returns 版本号
 */
export async function getVersion() {
    return (await axios.get<SimplePacket>("/api/meta/version")).data
        .data as string;
}

export async function getInstanceDirInfo(path: string) {}
