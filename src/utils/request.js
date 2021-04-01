// 导出一个axios的实例  而且这个实例要有请求拦截器 响应拦截器
import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'
const TimeOut = 3600
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 定时5秒
}) // 创建一个axios的实例
// 请求拦截器
service.interceptors.request.use(config => {
  // config请求配置信息    判断token存不存在  如果存在注入token
  if (store.getters.token) {
    // 只有在有token的情况下 才有时间去检擦时间搓
    if (IsCheckTimeOut()) {
      // 如果大于有效时间  表示过期了
      store.dispatch('user/login') // 登出操作
      router.push('/login') // 页面跳转到登录页
      return Promise.reject(new Error('token超时了'))// 弹出错误信息提示
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  // 必须返回
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
service.interceptors.response.use(response => {
  // 结构赋值
  const { success, message, data } = response.data
  if (success) {
    return data
  } else {
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, error => {
  // error 信息里面的response对象
  if (error.response && error.response.data && error.response.data.code === 10002) {
    // 当等于10002的时候 表示 后端告诉我token超时了
    store.dispatch('user/logout') // 登出action 删除token
    router.push('/login') // 跳转到登录页面
  } else {
    // 错误提示信息
    Message.error(error.message) // 提示错误信息
  }
  // 返回执行错误
  return Promise.reject(error)
})

// 超时时间函数方法
function IsCheckTimeOut() {
  const currentTime = Date.now() // 当前时间
  const timeStamp = getTimeStamp()
  return (currentTime - timeStamp) / 1000 > TimeOut
}
export default service // 导出axios实例
