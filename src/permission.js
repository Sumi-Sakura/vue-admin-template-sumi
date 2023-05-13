import router from './router'
import store from './store'
import { Message } from 'element-ui'
// 进度条
import NProgress from 'nprogress'
// 进度条样式
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

// 进度条配置
NProgress.configure({ showSpinner: false })

// 无重定向白名单
const whiteList = ['/login']

router.beforeEach(async (to, from, next) => {
  // 进度条开始
  NProgress.start()

  // 设置页面title
  document.title = getPageTitle(to.meta.title)

  // 判断用户是否已登录
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // 如果已经登录，跳转到首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 判断用户是否已经通过getInfo接口获取到权限相关信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // 尝试通过getInfo接口获取权限相关信息
          const { roles } = await store.dispatch('user/getInfo')

          // 通过generateRoutes方法组装动态路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // 动态添加路由（异步）
          router.addRoutes(accessRoutes)

          // 由于addRoutes是异步，所以第一次访问被添加的路由时，并没有生成动态路由，会导致白屏，通过...to来确保通过addRoutes动态添加的路由已经被完全加载上去
          // ...to: 如果参数to不能找到对应的路由的话，就再执行一次beforeEach，直到next({ ...to})能找到对应的路由为止
          // replace: true用来设置本次操作后，不能通过浏览器后退按钮，返回前一个路由
          next({ ...to, replace: true })
        } catch (error) {
          // 移除本地储存的token
          await store.dispatch('user/resetToken')
          Message.error(error || '请重新登录')

          // 跳转到登录页并记录重定向url
          next(`/login?redirect=${to.fullPath}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 如果没有token
    // 如果跳转url存在于白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next()
      // 访问任何不存在于白名单的页面时跳转到登录页并记录重定向url
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
})

// 切换页面成功后结束进度条
router.afterEach(() => {
  NProgress.done()
})
