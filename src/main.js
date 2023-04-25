import Vue from 'vue'

import 'normalize.css/normalize.css'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// element国际化
// import locale from 'element-ui/lib/locale/lang/en'

// 全局css
import '@/styles/index.scss'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
// 权限控制
import '@/permission'

// 英文版element
// Vue.use(ElementUI, { locale })

// 中文版element
Vue.use(ElementUI, { size: 'small' })

// 去掉生产环境中vue自带的在F12中的提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})
