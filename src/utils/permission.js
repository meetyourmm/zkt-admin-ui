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

export function getRouters(menus) {
  menus.forEach(function(menu, index, array) {
    if (menu.type === 'menu') {
      if (menu.children && menu.children.length > 0) {
        getRouters(menu.children)
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

export function getMenus(menus) {
  var i = menus.length
  while (i--) {
    if (menus[i].type === 'menu') {
      if (menus[i].children && menus[i].children.length > 0) {
        getMenus(menus[i].children)
      }
    } else {
      menus.splice(i, 1)
    }
  }
  return menus
}

export function hasChild(menus, id) {
  let flag = false
  menus.forEach(menu => {
    if (flag) {
      return
    }
    if (menu.id === id) {
      flag = menu.children && menu.children.length > 0
      return
    } else {
      if (menu.children && menu.children.length > 0) {
        flag = hasChild(menu.children, id)
        if (flag) {
          return flag
        }
      }
    }
  })
  return flag
}
