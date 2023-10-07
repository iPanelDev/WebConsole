import {
    mdiAccount,
    mdiCogOutline,
    mdiGithub,
    mdiLogout,
    mdiThemeLightDark
} from "@mdi/js";

export default [
    {
        isCurrentUser: true,
        menu: [
            {
                icon: mdiAccount,
                label: "个人资料",
                to: "/profile",
            },
            {
                to: "/settings",
                icon: mdiCogOutline,
                label: "设置",
            },
            {
                isDivider: true,
            },
            {
                icon: mdiLogout,
                label: "退出",
                isLogout: true,
                to: "/login",
            },
        ],
    },
    {
        label: "未连接",
        isLatency: true,
    },
    {
        icon: mdiThemeLightDark,
        label: "主题",
        isDesktopNoLabel: true,
        isToggleLightDark: true,
    },
    {
        icon: mdiGithub,
        label: "GitHub",
        isDesktopNoLabel: true,
        href: "https://github.com/iPanelDev/WebConsole",
        target: "_blank",
    },
];
