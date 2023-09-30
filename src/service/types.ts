/**
 * 实例
 */
export declare type _Instance = {
    short_info: ShortInfo;
    full_info?: FullInfo;
    address: string;
    custom_name: string | null;
    uuid: string;
    instance_id: string;
    dir_tree: Map<string, DirItem[]>;
};

/**
 * 实例
 */
export declare type Instance = {
    shortInfo: ShortInfo;
    fullInfo?: FullInfo;
    address: string;
    customName: string | null;
    uuid: string;
    instanceId: string;
};

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

/**
 * 数据包
 */
export declare interface Packet {
    type: string;
    sub_type: string;
    data?: any;
    sender?: Record<string, string>;
    echo?: any;
}

/**
 * 数据包
 */
export declare interface SimplePacket {
    data?: any;
    code: number;
}

/**
 * 简短信息
 */
export declare type ShortInfo = {
    server_status: boolean;
    server_filename: string | null;
    server_time: string | null;
    os: string | null;
};

export declare type FullInfo = {
    server: {
        filename: string | null;
        status: boolean;
        runTime: string | null;
        usage: number;
    };
    sys: {
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
};

export declare type Status = {
    user: User;
    logined: boolean;
};

export enum State {
    none,
    pending,
    logined,
    failure,
    reconnecting,
}
