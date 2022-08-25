import Vue from 'vue'
// 导入i18n
import VueI18n from 'vue-i18n'

// import locale from 'element-ui/lib/locale'
import elementEN from 'element-ui/lib/locale/lang/en' // 引入饿了么的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入饿了么的中文包

import Cookie from 'js-cookie'

// 引入自定义中文包
import customZH from './zh'
// 引入自定义英文包
import customEN from './en'

Vue.use(VueI18n)

const i18n = new VueI18n({
  // 指定语言类型 zh表示中文  en表示英文
  locale: Cookie.get('lang') || 'zh',
  messages: {
    // 英文环境下的语言数据
    en: {
      ...elementEN,
      ...customEN
    },
    // 中文环境下的语言数据
    zh: {
      ...elementZH,
      ...customZH
    }
  }
})
// 配置elementUI 语言转换关系
// locale.i18n((key, value) => i18n.t(key, value))

export default i18n
