// 专门处理权限路由的模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  //  一开始 拥有静态路由的权限
  // 路由表 当前路由所拥有的所有数组
  routes: constantRoutes
}
const mutations = {
  // 定义修改router的方法
  setRoutes(state, newRoutes) {
    // 两个数组的合并
    state.routes = [...constantRoutes, ...newRoutes] // 每次都是在静态路由上加
  }
}
const actions = {
  // 定义调用他的方法
  filterRoutes(context, menus) {
    // 定义数组
    const routes = []
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    context.commit('setRoutes', routes)
    return routes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
