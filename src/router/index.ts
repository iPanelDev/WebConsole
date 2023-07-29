import { createRouter, createWebHistory } from 'vue-router'
import { isConnected } from '@/service/ws'

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
      component: () => import('@/views/Overview.vue'),
      meta: {
        title: '总览'
      }
    },

    {
      path: '/instance',
      component: () => import('@/views/instance/Instance.vue'),
      meta: {
        title: '实例'
      }
    },

    {
      path: '/instance/:guid',
      component: () => import('@/views/instance/Instance.vue'),
      meta: {
        title: '实例'
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
  window.document.title = to.meta.title ? to.meta.title + ' | iPanel WebConsole' : 'iPanel WebConsole';
  next();
})

export default router;
