import request from '@/utils/request'
// 获取组织架构数据
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

// 根据ID删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}

// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'POST',
    data
  })
}

// 获取某个部门的详情
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}

// 编辑部门更新的请求接口
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
