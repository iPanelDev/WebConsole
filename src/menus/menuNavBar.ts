import {
    mdiAccount,
    mdiCogOutline,
    mdiLogout,
    mdiThemeLightDark,
    mdiGithub,
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
