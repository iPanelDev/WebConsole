export declare type Instance = {
    short_info: ShortInfo;
    full_info?: FullInfo;
    address: string;
    custom_name: string | null;
    uuid: string;
    instance_id: string;
    dir_tree: Map<string, Item[]>;
};

export declare type DirInfo = DirBase & {
    dir: string;
};

export declare type DirBase = {
    is_exist: boolean;
    items?: Item[];
};

export declare type Item = {
    type: "file" | "dir";
    path: string;
    name: string;
    size?: number;
    items?: Record<string, Item>;
};

export declare type ShortInfo = {
    server_status: boolean;
    server_filename: string | null;
    server_time: string | null;
    os: string | null;
};

export declare interface Packet {
    type: string;
    sub_type: string;
    data?: any;
    sender?: Record<string, string>;
}

export declare type FullInfo = {
    server: {
        filename: string | null;
        status: boolean;
        run_time: string | null;
        usage: number;
    };
    sys: {
        os: string | null;
        cpu_name: string | null;
        total_ram: number;
        free_ram: number;
        ram_usage: number;
        cpu_usage: number;
    };
};

export declare type User = {
    last_login_time: string;
    level: number;
    instances: string[];
    description?: string;
    ip_addresses: string[];
};
