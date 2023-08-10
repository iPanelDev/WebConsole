import { isConnected } from '@/service/ws';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: () => isConnected() ? '/overview' : '/connect'
    },

    {
      path: '/connect',
      component: () => import('@/views/Connect.vue'),
      meta: {
        title: '连接'
      }
    },

    {
      path: '/overview',
      component: () => import('@/views/overview/Overview.vue'),
      meta: {
        title: '总览'
      }
    },

    {
      path: '/instance',
      redirect: '/overview',
    },

    {
      path: '/instance/:guid',
      redirect(to) {
        return to.fullPath + '/panel';
      }
    },

    {
      path: '/instance/:guid/panel',
      component: () => import('@/views/instancePanel/Panel.vue'),
      meta: {
        title: '面板'
      }
    },

    {
      path: '/instance/:guid/files',
      component: () => import('@/views/fileManager/FileManager.vue'),
      meta: {
        title: '文件管理'
      }
    },

    {
      path: '/:path(.*)*',
      component: () => import('@/views/error/_404.vue'),
      meta: {
        title: '404'
      }
    }
  ]
});

router.beforeEach((to, _from, next) => {
  window.document.title = to.meta.title ? to.meta.title + ' · iPanel WebConsole' : 'iPanel WebConsole';
  next();
})

export default router;
