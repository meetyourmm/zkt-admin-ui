/**
 * adminSystem路由配置
 */

import Layout from '@/views/layout/Layout'
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const adminRouter = {
  path: '/adminSys',
  component: Layout,
  redirect: 'noredirect',
  name: 'adminSys',
  meta: {
    title: 'sysAdmin',
    icon: 'tab'
  },
  children: [{
    path: '/userManager',
    component: () => import('@/views/admin/user/index'),
    name: 'userManager',
    meta: {
      title: 'userManager',
      icon: 'fa-user'
    }
  },
  {
    path: '/menuManager',
    component: () => import('@/views/admin/menu/index'),
    name: 'menuManager',
    meta: {
      title: 'menuManager ',
      icon: 'category'
    }
  },
  {
    path: '/groupManager',
    component: () => import('@/views/admin/group/index'),
    name: 'groupManager',
    meta: {
      title: 'groupManager',
      icon: 'group_fill'
    }
  },
  {
    path: '/logManager',
    component: () => import('@/views/admin/apiLog/index'),
    name: 'viewlist',
    meta: {
      title: 'logManager',
      icon: 'fa-user'
    }
  }
  ]
}

export default adminRouter
