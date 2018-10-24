import request from '@/authority/request'

export function page(query) {
  return request({
    url: '/api/admin/element/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/admin/element',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/admin/element/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/api/admin/element/' + id,
    method: 'delete'
  })
}

export function putObj(id, obj) {
  return request({
    url: '/api/admin/element/' + id,
    method: 'put',
    data: obj
  })
}
