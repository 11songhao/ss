import request from '@/utils/request'

// 获取权限列表
export function getPermissionList (params) {
  return request({
    url: '/sys/permission',
    params
  })
}
// 新增权限
/**
 *
 * @param {*} data
* enVisible: '0', // 开启
  name: '', // 名称
  code: '', // 权限标识
  description: '', // 描述
  type: '', // 类型
  pid: '' // 添加到哪个节点下
 * @returns
 */
export function addPermission (data) {
  return request({
    url: '/sys/permission',
    method: 'post',
    data
  })
}

// 更新权限
export function updatePermission (data) {
  return request({
    url: `/sys/permission/${data.id}`,
    method: 'put',
    data
  })
}

// 删除权限
export function delPermission (id) {
  return request({
    url: `/sys/permission/${id}`,
    method: 'delete'
  })
}

// 获取权限详情
export function getPermissionDetail (id) {
  return request({
    url: `/sys/permission/${id}`
  })
}
