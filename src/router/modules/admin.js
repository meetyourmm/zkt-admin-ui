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
    title: '系统管理',
    icon: 'tree'
  },
  children: [{
    path: '/userManager',
    component: () => import('@/views/admin/user/index'),
    name: 'userManager',
    meta: {
      title: '用户管理',
      icon: 'user'
    }
  },
  {
    path: '/menuManager',
    component: () => import('@/views/admin/menu/index'),
    name: 'menuManager',
    meta: {
      title: '菜单管理 ',
      icon: 'list'
    }
  },
  {
    path: '/groupManager',
    component: () => import('@/views/admin/group/index'),
    name: 'groupManager',
    meta: {
      title: '角色权限管理',
      icon: 'peoples'
    }
  },
  {
    path: '/dictManager',
    component: () => import('@/views/admin/group/index'),
    name: 'dictManager',
    meta: {
      title: '数据字典',
      icon: 'dictionary'
    }
  },
  {
    path: '/logManager',
    component: () => import('@/views/admin/apiLog/index'),
    name: 'viewlist',
    meta: {
      title: '接口日志',
      icon: 'log'
    }
  }
  ]
}

export default adminRouter
