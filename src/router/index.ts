import { getWebGlobalConfig } from "@/utils/configManager";
import {
    RouteRecordRaw,
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        redirect: "/login",
    },

    {
        meta: {
            title: "个人资料",
        },
        path: "/profile",
        name: "profile",
        // @ts-expect-error
        component: () => import("@/views/ProfileView.vue"),
    },

    {
        meta: {
            title: "登录",
        },
        path: "/login",
        name: "login",
        // @ts-expect-error
        component: () => import("@/views/LoginView.vue"),
    },

    {
        meta: {
            title: "总览",
        },
        path: "/overview",
        name: "overview",
        // @ts-expect-error
        component: () => import("@/views/OverviewView.vue"),
    },

    {
        meta: {
            title: "设置",
        },
        path: "/settings",
        name: "settings",
        // @ts-expect-error
        component: () => import("@/views/SettingsView.vue"),
    },

    {
        meta: {
            title: "用户管理",
        },
        path: "/users",
        name: "users",
        // @ts-expect-error
        component: () => import("@/views/UsersView.vue"),
    },

    {
        path: "/instance",
        redirect: "/overview",
    },

    {
        path: "/instance/:instanceId",
        redirect: (to) => `/instance/${to.params["instanceId"]}/dashboard`,
    },

    {
        meta: {
            title: "仪表盘",
        },
        path: "/instance/:instanceId/dashboard",
        name: "instance",
        // @ts-expect-error
        component: () => import("@/views/instances/DashboardView.vue"),
    },

    {
        meta: {
            title: "控制台",
        },
        path: "/instance/:instanceId/console",
        name: "console",
        // @ts-expect-error
        component: () => import("@/views/instances/ConsoleView.vue"),
    },

    {
        meta: {
            title: "调试",
        },
        path: "/debug",
        name: "debug",
        // @ts-expect-error
        component: () => import("@/views/DebugView.vue"),
    },

    {
        meta: {
            title: "404",
        },
        path: "/:path(.*)*",
        name: "error",
        // @ts-expect-error
        component: () => import("@/views/ErrorView.vue"),
        props: {
            message: new Error("404 NOT_FOUND"),
        },
    },
];

const routerHistory = (() => {
    const config = getWebGlobalConfig();

    switch (config.routerHistoryType) {
        case "hash":
            return createWebHashHistory();

        case "memory":
            return createMemoryHistory();

        case "web":
            return createWebHistory();

        default:
            console.warn("config.routerHistoryType有误");
            return createWebHistory();
    }
})();

const router = createRouter({
    routes,
    history: routerHistory,
    scrollBehavior(to, from, savedPosition) {
        return savedPosition || { top: 0 };
    },
});

const defaultDocumentTitle = "iPanel WebConsole";

router.afterEach((to) => {
    document.title = to.meta?.title
        ? `${to.meta.title} - ${defaultDocumentTitle}`
        : defaultDocumentTitle;
});

export default router;
