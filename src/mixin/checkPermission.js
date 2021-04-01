import store from '@/store'
// 做一个混入的对象
export default {
  // 混入对象时组件的选项对象
  methods: {
    // 去用户的信息里面去找points有没有key
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles.points && userInfo.roles.points.length) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false // 如果没进去 ， 说明没有权限
    }
  }
}
