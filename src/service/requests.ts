import { useServiceStore } from "@/service/store";
import { Instance, SimplePacket, Status, User } from "@/service/types";
import { convertToCamelCase } from "@/utils/strings";
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
export async function logIn() {
    const serviceStore = useServiceStore();

    const {
        status,
        data: { data },
    } = await axios.postForm<SimplePacket>(
        "/api/user/login",
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
        throw new Error(data);
    }

    return convertNamingStyle<Status>(data);
}

/**
 * 退出
 */
export async function logOut() {
    await axios.get<SimplePacket>("/api/user/logout");
}

/**
 * 获取登录态
 */
export async function getStatus() {
    return convertNamingStyle<Status>(
        (await axios.get<SimplePacket>("/api/status")).data.data
    );
}

/**
 * 获取当前用户信息
 */
export async function getUserInfo() {
    return convertNamingStyle<User>(
        (await axios.get<SimplePacket>("/api/user")).data.data
    );
}

/**
 * 获取当前用户信息
 */
export async function listUsers() {
    return convertNamingStyle<Record<string, User>>(
        (await axios.get<SimplePacket>("/api/user/list")).data.data,
        true
    );
}

/**
 * 删除用户
 */
export async function deleteUser(userName: string) {
    return await axios.get<SimplePacket>(
        `/api/user/${encodeURIComponent(userName)}/delete`
    );
}

/**
 * 获取实例
 */
export async function listInstances() {
    return convertNamingStyle<Instance[]>(
        (await axios.get<SimplePacket>("/api/instance/list")).data.data
    );
}

/**
 * 获取实例信息
 */
export async function getInstanceInfo(instanceId: string) {
    return convertNamingStyle<Instance>(
        (
            await axios.get<SimplePacket>(
                `/api/instance/${encodeURIComponent(instanceId)}`
            )
        ).data.data
    );
}

/**
 * 订阅实例
 * @param instanceId 实例ID
 */
export async function subscribeInstance(instanceId: string) {
    await axios.get<SimplePacket>(
        `/api/instance/${encodeURIComponent(instanceId)}/subscribe`
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
        JSON.stringify(inputs)
    );
}

/**
 * 获取iPanel版本号
 * @returns 版本号
 */
export async function getVersion() {
    return (await axios.get<SimplePacket>("/api/version")).data.data as string;
}

/**
 * 递归转化命名风格
 */
function convertNamingStyle<T extends Record<string, any> | Array<any>>(
    input: T,
    ignoreTopKey = false
): T {
    if (typeof input != "object" || input === null) {
        return input;
    }

    if (Array.isArray(input)) {
        // @ts-expect-error
        return input.map((value: T) => convertNamingStyle(value));
    }

    const result: Record<string, any> = {};
    for (const kv of Object.entries(input)) {
        result[
            ignoreTopKey ? String(kv[0]) : convertToCamelCase(String(kv[0]))
        ] = convertNamingStyle(kv[1]);
    }

    return result as T;
}
