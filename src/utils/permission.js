import Layout from '@/views/layout/Layout'

/**
 * 根据类型过滤菜单权限
 * @param menus
 * @param type
 * @returns {Array}
 */
export default function menuFilter(menus, type) {
  const res = []

  menus.forEach(menu => {
    let tmp = { }
    if (menu.type === type) {
      if (menu.children) {
        menu.children = menuFilter(menu.children, type)
      }
      // 设置路由
      const view = '@/views/' + menu.view
      tmp = {
        path: menu.path,
        name: menu.code,
        component: () => menu.view ? import(view) : Layout,
        meta: {
          title: menu.label,
          icon: menu.icon
        }
      }

      res.push(tmp)
    }
  })

  return res
}
