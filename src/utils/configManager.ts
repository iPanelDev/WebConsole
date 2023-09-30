export function getWebGlobalConfig() {
    // @ts-ignore
    return (window.iPanelWebConsoleConfig || {}) as Config | undefined;
}

export declare type Config = {
    routerHistoryType: string;
};
