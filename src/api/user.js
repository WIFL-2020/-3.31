import request from '@/utils/request'
// 返回一个axios对象 => promise  // 返回了一个promise对象
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
// 获取用户的基本信息
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export function logout() {

}

// * 获取员工的基本信息  现在写它 完全是为了显示头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
