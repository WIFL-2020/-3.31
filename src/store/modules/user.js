import { getToken, setToken, removeToken, getTimeStamp } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
// 状态
const state = {
  // 设置token
  token: getToken(),
  // 定义一个空对象
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    removeToken()
  },
  // 设置对象
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    // 调用Api的接口
    const result = await login(data)
    // console.log(result)
    // if (result.data.success) {
    context.commit('setToken', result)
    // }
    // 获取时间搓
    getTimeStamp() // 将当前的时间写入缓存
  },
  // 获取用户的基本信息
  async getUserInfo(context) {
    const result = await getUserInfo() // 获取返回值
    const base = await getUserDetailById(result.userId) // 根据用户Id 获取用户详情
    const baseResult = { ...result, ...base } // 将两个接口的结果合并   合并对象
    context.commit('setUserInfo', baseResult) // 将个人信息存放到vuex中
    return baseResult // 返回
  },
  // 登出操作
  async logout(context) {
    context.commit('removeToken') // 删除token
    context.commit('removeUserInfo')// 删除 userInfo 用户信息
    // 重置路由
    resetRouter()
    // 父模块 调用 子模块的action
    context.commit('permission/setRoutes', [], { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
