import request from '@/authority/request'

export function getRootDict(query) {
  return request({
    url: '/api/dict/getRootDict',
    method: 'post',
    params: query
  })
}
export function getDictChildren(query) {
  return request({
    url: '/api/dict/getDictChildren',
    method: 'post',
    params: query
  })
}
export function addObj(obj) {
  return request({
    url: '/api/dict/addObj',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/dict/getObj',
    method: 'post',
    params: id
  })
}

export function delObj(id) {
  return request({
    url: '/api/dict/delObj',
    method: 'delete',
    params: id
  })
}

export function putObj(obj) {
  return request({
    url: '/api/dict/putObj',
    method: 'put',
    data: obj
  })
}
