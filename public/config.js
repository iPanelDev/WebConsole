// @ts-check
// @ts-ignore
// iPanel配置项
window.iPanelConfig ||= {
    /**
     * 锁定WebSocket地址
     * - 锁定后，将使用该host的ws服务器
     * 
     * `http://example.com:1111` -> `ws://example.com:1111/ws`
     * @type {boolean}
     */
    lockWebSocket: false,

    /**
     * 填写密码使用的储存位置
     * - `null` -- 不储存任何密码
     * - `localStorage` -- 明文储存在浏览器的本地存储中，除非手动删除，否则不会失效
     * - `sessionStorage` -- 明文储存在浏览器的会话存储中，页面会话结束时密码会被清除
     * @type {'localStorage'|'sessionStorage'|null}
     */
    passwordSaver: null
};