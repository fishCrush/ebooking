// 实现多种语言
import Vue from 'vue'
// 引入vue实例
import VueI18n from 'vue-i18n'
// 引入vue-i18n这个库
import cn from './cn'
import en from './en'
import { getLocale, saveLocale } from '../utils/localStorage'
// 引入en和cn两个资源文件
Vue.use(VueI18n) // 利用Vue.use来加载插件

const messages = {
  // 创建一个对象，将en和cn放入其中
  en,
  cn
}

let locale = getLocale() // 设当前默认语言为本地存储的默认语言
if (!locale) {
  // 如果不存在已存储的默认语言，则设置当前默认语言为中文,并存入本地的默认语言
  locale = 'cn'
  saveLocale(locale)
}
 // 实例化i18n,传入两个参数：当前语言和语言对应的文本
const i18n = new VueI18n({
  locale, // 当前语言
  messages // 语言对应的文本
  }
)

export default i18n
