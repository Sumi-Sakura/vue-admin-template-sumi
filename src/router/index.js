import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * 子菜单仅在路由的 children.length >= 1 时出现，详见 https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 * hidden: true                   当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面
 * alwaysShow: true               当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
                                  只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
                                  若你想不管路由下面的 children 声明的个数都显示你的根路由
                                  你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']     设置该路由进入的权限，支持多个权限叠加
    title: 'title'                设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'/'el-icon-x'  设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
    noCache: true                 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    breadcrumb: false             如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
    affix: true                   如果设置为true，它则会固定在tags-view中(默认 false)
    activeMenu: '/article/list'   当路由设置了该属性，则会高亮相对应的侧边栏。
                                  这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
                                  点击文章进入文章详情页，这时候路由为/article/1，但你想在侧边栏高亮文章列表的路由，就可以进行如下设置
  }
 */

/**
 * constantRoutes
 * 无需权限的页面，所有角色均可访问
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/pages/login/index'),
    hidden: true,
  },

  {
    path: '/404',
    component: () => import('@/pages/404'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/pages/home/index'),
        meta: { title: '首页', icon: 'home' },
      },
    ],
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/pages/tree/index'),
        meta: { title: 'Tree', icon: 'tree' },
      },
    ],
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/pages/form/index'),
        meta: { title: 'Form', icon: 'form' },
      },
    ],
  },
]

/**
 * asyncRoutes
 * 需要根据用户角色动态加载的路由
 */
export const asyncRoutes = [
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested',
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/pages/nested/menu1/index'),
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/pages/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' },
          },
          {
            path: 'menu1-2',
            component: () => import('@/pages/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/pages/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' },
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/pages/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' },
              },
            ],
          },
          {
            path: 'menu1-3',
            component: () => import('@/pages/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' },
          },
        ],
      },
      {
        path: 'menu2',
        component: () => import('@/pages/nested/menu2/index'),
        meta: { title: 'menu2' },
      },
    ],
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://baidu.com',
        meta: { title: 'External Link', icon: 'link' },
      },
    ],
  },

  // 404页面必须放在最底部
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  // 重置路由
  router.matcher = newRouter.matcher
}

export default router
