// 权限路由跳转
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
// 不需要导出
// 前置守卫
const whileList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条
  // 判断有没有token
  if (store.getters.token) {
    // 如果要访问的是登录页
    if (to.path === '/login') {
      // 跳转到首页
      next('/')
    } else {
      // 如果当前没有vuex中的用户资料
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 筛选用户的可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 添加到路由表
        // router.addRoutes(routes)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表
        // 相当于跳到对应的地址  相当于多做一次跳转 为什么要多做一次跳转
        next(to.path)
      }
      // 否则放行
      next()
    }
  } else {
    if (whileList.indexOf(to.path) > -1) {
      // 放行
      next()
    } else {
      // 返回登录页
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})

// 后置守卫
router.afterEach(() => {
  NProgress.done() // 开启进度条
})

