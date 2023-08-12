import {
  RouteRecordRaw,
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
    path: "/instance",
    redirect: "/overview",
  },

  {
    path: "/instance/:guid",
    redirect: (to) => `/instance/${to.params['guid']}/dashboard`,
  },

  {
    meta: {
      title: "仪表盘",
    },
    path: "/instance/:guid/dashboard",
    name: "instance",
    props: true,
    // @ts-expect-error
    component: () => import("@/views/instances/DashboardView.vue"),
  },

  {
    meta: {
      title: "控制台",
    },
    path: "/instance/:guid/console",
    name: "console",
    props: true,
    // @ts-expect-error
    component: () => import("@/views/instances/ConsoleView.vue"),
  },

  {
    meta: {
      title: "错误",
    },
    path: "/:path",
    name: "error",
    // @ts-expect-error
    component: () => import("@/views/ErrorView.vue"),
    props: {
      message: new Error("404"),
    },
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
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
