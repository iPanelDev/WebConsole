/**
 * 数据包
 */
export declare interface Packet {
    type: string;
    subType: string;
    data?: any;
    sender?: Record<string, string>;
}

/**
 * 数据包
 */
export declare interface HttpPacket {
    data?: any;
    code: number;
}

/**
 * 实例
 */
export declare type Instance = {
    info?: InstanceInfo;
    address: string;
    customName?: string | null;
    uuid: string;
    instanceId: string;
    metadata: Metadata;
};

export declare type Metadata = {
    version?: string;
    name?: string;
};

export declare type InstanceInfo = {
    server: {
        filename: string | null;
        status: boolean;
        runTime: string | null;
        usage: number;
    };
    system: {
        os: string | null;
        cpuName: string | null;
        totalRam: number;
        freeRam: number;
        ramUsage: number;
        cpuUsage: number;
    };
};

export declare type User = {
    lastLoginTime: string;
    level: number;
    instances: string[];
    description?: string;
    ipAddresses: string[];
    password?: string;
};

export declare type Status = {
    user: User;
    logined: boolean;
};

export enum State {
    none,
    logined,
    failure,
    reconnecting,
}

export declare type DirInfo = DirBase & {
    dir: string;
};

export declare type DirBase = {
    is_exist: boolean;
    items?: DirItem[];
};

export declare type DirItem = {
    type: "file" | "dir";
    path: string;
    name: string;
    size?: number;
    items?: Record<string, DirItem>;
};
