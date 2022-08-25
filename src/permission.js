import router, { asyncRoutes } from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
// 导入所有动态路由
// import { asyncRoutes } from '@/router'

const whitelist = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
      // console.log('跳转了111111')
      // 判断如果没有获取用户信息才进行调用
      if (!store.getters.name) {
        // await store.dispatch('user/getUserInfo')
        // 拿到菜单权限数据
        const roles = await store.dispatch('user/getUserInfo')
        // 做过滤处理
        // 如果路由的name属性能在menus权限数据中找到代表可以访问
        const filterRoutes = asyncRoutes.filter(route => {
          return roles.menus.includes(route.children[0].name)
        })
        // 添加菜单渲染需要的动态路由
        store.commit('routes/addAsyncRoutes', filterRoutes)
        console.log('当前用户可以访问的动态路由：', filterRoutes)
        // 动态添加可访问路由
        // router.addRoutes(filterRoutes)
        router.addRoutes([...filterRoutes, { path: '*', redirect: '/404', hidden: true }])
        // next({
        //   path: to.path,
        //   replace: true
        // })
      }
    }
  } else {
    if (whitelist.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done()
})

// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
