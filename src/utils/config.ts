export function getConfig() {
    // @ts-ignore
    return (window.iPanelConfig || {}) as Config | undefined;
}

export declare type Config = {
    lockWebSocket: boolean,
    passwordSaver?: 'localStorage' | 'sessionStorage'
}