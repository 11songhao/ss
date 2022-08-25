import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
import { getUserInfo, getUserDetailById } from '@/api/user'

import { resetRouter } from '@/router'
export default {
  namespaced: true,
  state: {
    token: getToken() || null,
    userInfo: {}
  },
  mutations: {
    // 设置token
    setToken (state, token) {
      state.token = token // 设置token
      setToken(token)
    },
    // 删除token
    removeToken (state) {
      state.token = null // 删除vuex的token
      removeToken()
    },
    // 设置用户信息
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
    },
    // 删除用户信息
    reomveUserInfo (state) {
      state.userInfo = {}
    }
  },
  actions: {
    // test
    atest () {
      return 123
    },
    // 登录存token
    async userLogin (ctx, data) {
      const res = await login(data)
      ctx.commit('setToken', res)
    },
    // 获取登录人资料存储
    async getUserInfo (context) {
      const result = await getUserInfo()
      const base = await getUserDetailById(result.userId)
      console.log(base)
      context.commit('setUserInfo', { ...result, ...base })
      return result.roles
    },
    // 登出
    logout (context) {
      // 清除token
      context.commit('removeToken')
      // 清除用户信息
      context.commit('reomveUserInfo')
      // 3. 重置路由
      resetRouter()
      // 4. 重置 vuex 中的路由信息 只保留每个用户都一样的静态路由数据
      // context.commit('routes/addAsyncRoutes', []) // 调用失败
      context.commit('routes/addAsyncRoutes', [], { root: true })
    }

  }
}
