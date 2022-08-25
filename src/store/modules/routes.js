/**
 * 提供给菜单组件渲染使用
 */
import { constantRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    // 默认静态路由
    routes: []
  },
  mutations: {
    addAsyncRoutes (state, asyncRoutes) {
      // 添加根据权限过滤的动态路由
      state.routes = [...constantRoutes, ...asyncRoutes]
    }
  }
}
