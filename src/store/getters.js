const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // 用户数据快捷访问
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto,
  name: state => state.user.userInfo.username,
  departmentName: state => state.user.userInfo.departmentName,
  mobile: state => state.user.userInfo.mobile,

  // 菜单渲染
  routes: state => state.routes.routes
}
export default getters
