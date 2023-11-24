import { useConnectionStore, useServiceStore } from "@/service/store";
import { HttpPacket, Instance, User } from "@/service/types";
import axios, { AxiosError } from "axios";
import md5 from "blueimp-md5";

const appJsonHeader = {
    "Content-Type": "application/json",
};
const axiosInstance = axios.create({ baseURL: "/api" });
axiosInstance.defaults.headers.delete = appJsonHeader;
axiosInstance.defaults.headers.put = appJsonHeader;
axiosInstance.defaults.headers.post = appJsonHeader;
axiosInstance.interceptors.response.use(undefined, (err) => {
    if (err instanceof AxiosError && err.response)
        throw `${err.response.status} ${err.response.statusText}: ${
            (err.response.data as HttpPacket).data || "unknown"
        }`;
    throw err;
});

/**
 * 登录
 */
export async function login() {
    const serviceStore = useServiceStore();

    const time = new Date().toISOString();
    const {
        status,
        data: { data },
    } = await axiosInstance.post<HttpPacket>(
        "/user/@self/login",
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
            // validateStatus: () => true,
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
export async function logout() {
    await axiosInstance.get<HttpPacket>("/user/@self/logout");
}

/**
 * 获取登录态
 */
export async function getStatus() {
    return (await axiosInstance.get<HttpPacket>("/user/@self/status")).data
        .data;
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo() {
    return (await axiosInstance.get<HttpPacket>("/user/@self")).data
        .data as User;
}

export async function editSelfPwd(pwd: string) {
    return await axiosInstance.put<HttpPacket>(
        "/user/@self",
        JSON.stringify({ password: pwd }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

/**
 * 获取所有用户信息
 */
export async function listUsers() {
    return (await axiosInstance.get<HttpPacket>("/user")).data.data as Record<
        string,
        User
    >;
}

/**
 * 编辑用户
 */
export async function createUser(userName: string, newUser: User) {
    const user = { ...newUser };
    return await axiosInstance.post<HttpPacket>(
        `/user/${encodeURIComponent(userName)}`,
        JSON.stringify(user),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

/**
 * 编辑用户
 */
export async function editUser(userName: string, newUser: User) {
    const user = { ...newUser };
    user.password = user.password || null;
    return await axiosInstance.put<HttpPacket>(
        `/user/${encodeURIComponent(userName)}`,
        JSON.stringify(user),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
}

/**
 * 删除用户
 */
export async function removeUser(userName: string) {
    return await axiosInstance.delete<HttpPacket>(
        `/user/${encodeURIComponent(userName)}`
    );
}

/**
 * 获取实例
 */
export async function listInstances() {
    return (await axiosInstance.get<HttpPacket>("/instance")).data
        .data as Instance[];
}

/**
 * 获取实例信息
 */
export async function getInstanceInfo(instanceId: string) {
    return (
        await axiosInstance.get<HttpPacket>(
            `/instance/${encodeURIComponent(instanceId)}`
        )
    ).data.data;
}

/**
 * 订阅实例
 * @param instanceId 实例ID
 */
export async function subscribeInstance(instanceId: string) {
    await axiosInstance.get<HttpPacket>(
        `/instance/${encodeURIComponent(instanceId)}/subscribe?connectionId=${
            useConnectionStore().wsConnectionId
        }`
    );
}

/**
 * 启动实例
 * @param instanceId 实例ID
 */
export async function callInstanceStart(instanceId: string) {
    await axiosInstance.get<HttpPacket>(
        `/instance/${encodeURIComponent(instanceId)}/start`
    );
}

/**
 * 关闭实例
 * @param instanceId 实例ID
 */
export async function callInstanceStop(instanceId: string) {
    await axiosInstance.get<HttpPacket>(
        `/instance/${encodeURIComponent(instanceId)}/stop`
    );
}

/**
 * 关闭实例
 * @param instanceId 实例ID
 */
export async function callInstanceKill(instanceId: string) {
    await axiosInstance.get<HttpPacket>(
        `/instance/${encodeURIComponent(instanceId)}/kill`
    );
}

/**
 * 关闭实例
 * @param instanceId 实例ID
 * @param inputs 输入
 */
export async function callInstanceInput(instanceId: string, inputs: string[]) {
    await axiosInstance.post<HttpPacket>(
        `/instance/${encodeURIComponent(instanceId)}/input`,
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
    return (await axiosInstance.get<HttpPacket>("/meta/version")).data
        .data as string;
}

export async function getInstanceDirInfo(path: string) {}
