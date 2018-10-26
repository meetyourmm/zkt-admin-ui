import Layout from '@/views/layout/Layout'

/**
 * 根据类型过滤菜单权限
 * @param menus
 * @param type
 * @returns {Array}
 */
export function getElements(menus, elements) {
  menus.forEach(menu => {
    if (menu.type === 'button') {
      elements[menu.code] = true
    } else {
      if (menu.children && menu.children.length > 0) {
        getElements(menu.children, elements)
      }
    }
  })
}

export function getMenus(menus) {
  menus.forEach(function(menu, index, array) {
    if (menu.type === 'menu') {
      if (menu.children && menu.children.length > 0) {
        getMenus(menu.children)
      }
      // 设置路由
      const view = '@/views/' + menu.view
      const tmp = {
        path: menu.path,
        name: menu.code,
        component: () => menu.view ? import(view) : Layout,
        meta: {
          title: menu.label,
          icon: menu.icon
        }
      }
      menu = tmp
    } else {
      menus.splice(index, 1)
    }
  })
  return menus
}
