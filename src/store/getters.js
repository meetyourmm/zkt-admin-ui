const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  allMenus: state => state.app.allMenus,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  menus: state => state.user.menus,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  role: state => state.user.role,
  setting: state => state.user.setting,
  permission_routers: state => state.user.routers,
  addRouters: state => state.user.addRouters,
  errorLogs: state => state.errorLog.logs
}
export default getters
