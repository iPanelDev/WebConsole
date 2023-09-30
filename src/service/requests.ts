import { useServiceStore } from "@/service/store";
import { Instance, SimplePacket, Status, User } from "@/service/types";
import axios from "axios";
import md5 from "blueimp-md5";
/**
 * 生成uuid
 */
async function generateUUID() {
    return (await axios.get<SimplePacket>("/api/generateUUID")).data
        .data as string;
}

/**
 * 登录
 */
export async function login() {
    const serviceStore = useServiceStore();

    const {
        status,
        data: { data },
    } = await axios.postForm<SimplePacket>(
        "/api/login",
        JSON.stringify({
            user_name: serviceStore.userName,
            token: md5(
                (await generateUUID()) +
                    serviceStore.userName +
                    serviceStore.password
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
        throw new Error(`登录失败：${data}`);
    }

    return data as Status;
}

/**
 * 获取登录态
 */
export async function getStatus() {
    return (await axios.get<SimplePacket>("/api/status")).data.data as Status;
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo() {
    return (await axios.get<SimplePacket>("/api/user/current")).data
        .data as User;
}

/**
 * 获取当前用户信息
 */
export async function listUsers() {
    return (await axios.get<SimplePacket>("/api/user/all")).data.data as Record<
        string,
        User
    >;
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
export async function listInstance(): Promise<Instance[]> {
    return (await axios.get<SimplePacket>("/api/instance/all")).data.data;
}
