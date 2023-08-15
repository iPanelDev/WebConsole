// @ts-check
// @ts-ignore
// iPanel配置项
window.iPanelWebConsoleConfig ||= {
    /**
     * 锁定WebSocket地址
     * - 锁定后，将使用该host的ws服务器
     *
     * `http://example.com:1111` -> `ws://example.com:1111/ws`
     * @type {boolean}
     */
    lockWebSocket: false,

    /**
     * 根目录
     * - 根据网页目录决定
     * - 如果发布的目录为`xxxx.com/example`，则需将此项改为`/example`
     * - 此项应该以`/`开头
     * @type {string}
     */
    basePath: "/",

    /**
     * 路由历史类型
     * - 如果不能设置单页面应用模式，则需将此项改为`hash`
     * @type {"web"|"hash"|"memory"}
     */
    routerHistoryType: "web",
};
