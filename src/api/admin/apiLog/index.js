import request from '@/authority/request'

export function page(query) {
  return request({
    url: '/api/apiLog/page',
    method: 'post',
    params: query
  })
}

export function delAll() {
  return request({
    url: '/api/apiLog/delAll',
    method: 'delete'
  })
}

export function addObj(obj) {
  return request({
    url: '/api/apiLog/addObj',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/apiLog/getObj',
    method: 'post',
    params: id
  })
}

export function delObj(id) {
  return request({
    url: '/api/apiLog/delObj',
    method: 'delete',
    params: id
  })
}

export function putObj(obj) {
  return request({
    url: '/api/apiLog/putObj',
    method: 'put',
    data: obj
  })
}
