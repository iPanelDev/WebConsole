export function getConfig() {
    // @ts-ignore
    return (window.iPanelWebConsoleConfig || {}) as Config | undefined;
}

export declare type Config = {
    lockWebSocket: boolean;
    basePath?: string;
    routerHistoryType: string;
};
