import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 如果token存在 注入token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // 从axios的data中解构出来必要的字段
    const { success, message, data } = response.data
    // 如果success为true,直接返回data即可
    if (success) {
      return data
    } else {
      Message({
        message: message,
        type: 'error',
        duration: 5 * 1000
      })
      // 如果success为false 业务出错,直接触发reject 被catch分支捕获
      return Promise.reject(new Error(message))
    }
  },
  error => {
    console.dir(error) // for debug
    if (error.response && error.response.status === 401) {
      if (router.currentRoute.path === '/login') return
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
      // 登出action 删除token和用户信息
      store.dispatch('user/logout')
      router.replace(`/login?redirect=${router.currentRoute.path}`)
    }
    return Promise.reject(error)
  }
)

export default service
