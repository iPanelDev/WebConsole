// @ts-check
// @ts-ignore
// iPanel配置项
window.iPanelConfig ||= {
    /**
     * WebSocket地h址
     * - 连接界面将默认填入此值
     * @type {string}
     */
    webSocketAddress: '',

    /**
     * 隐藏WS地址
     * - 为`true`后，连接界面的WebSocket地址输入框将不显示
     * - 推荐和`webSocketAddress`一起使用
     * 
     * ❗ 此项只能保证不在界面中出现该地址，但是按F12即可看到
     * @type {boolean}
     */
    hiddenWebSocketAddress: false,

    /**
     * 填写密码使用的储存位置
     * - `null` -- 不储存任何密码
     * - `localStorage` -- 明文储存在浏览器的本地存储中，除非手动删除，否则不会失效
     * - `sessionStorage` -- 明文储存在浏览器的会话存储中，页面会话结束时密码会被清除
     * @type {'localStorage'|'sessionStorage'|null}
     */
    passwordSaver: null
};