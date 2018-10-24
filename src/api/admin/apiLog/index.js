import request from '@/authority/request'

export function page(query) {
  return request({
    url: '/api/admin/apiLog/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/admin/apiLog',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/apiLog/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/apiLog/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/apiLog/' + id,
    method: 'put',
    data: obj
  })
}
