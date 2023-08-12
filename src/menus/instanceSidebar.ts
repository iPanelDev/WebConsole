import {
    mdiAccountCircle,
    mdiMonitor,
    mdiGithub,
    mdiLock,
    mdiAlertCircle,
    mdiSquareEditOutline,
    mdiTable,
    mdiViewList,
    mdiTelevisionGuide,
    mdiMonitorDashboard,
    mdiPalette,
    mdiConsole,
    mdiSolarPanel,
    mdiMenuLeft,
    mdiTextLong,
    mdiMenuLeftOutline,
} from "@mdi/js";

export default [
    {
        to: "./dashboard",
        icon: mdiMonitorDashboard,
        label: "仪表盘",
    },
    {
        to: "./console",
        icon: mdiConsole,
        label: "控制台",
    },

    {
        isDivider: true,
    },
];
