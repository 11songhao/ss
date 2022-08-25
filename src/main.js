import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
// import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n
if (process.env.NODE_ENV === 'development') {
  require('element-ui/lib/theme-chalk/index.css')
}

import i18n from '@/lang'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import ckp from '@/mixin/checkPoints'
import pg from '@/utils/plugin'

import * as directives from '@/directives'
// 导入全局组件注册对象
import Cp from '@/components'
Vue.use(Cp)
Vue.use(pg)
console.log(process.env)
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

// 全局混入
Vue.mixin(ckp)

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)
Vue.use(ElementUI, {
  i18n: (k, v) => i18n.t(k, v)
})

Vue.config.productionTip = false

console.log('环境变量：', process.env)

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
