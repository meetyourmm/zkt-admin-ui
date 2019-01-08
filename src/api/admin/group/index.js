import request from '@/authority/request'
import qs from 'qs'

export function fetchTree(query) {
  return request({
    url: '/api/group/tree',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/api/group/addObj',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/group/getObj',
    method: 'post',
    params: id
  })
}

export function delObj(id) {
  return request({
    url: '/api/group/delObj',
    method: 'post',
    params: id
  })
}

export function putObj(obj) {
  return request({
    url: '/api/group/putObj',
    method: 'post',
    data: obj
  })
}
export function validateCode(code) {
  return request({
    url: '/api/group/validateCode',
    method: 'post',
    data: qs.stringify(code)
  })
}

export function getGroupUsers(query) {
  return request({
    url: '/api/group/getGroupUsers',
    method: 'get',
    params: query
  })
}
export function addGroupUsers(ids) {
  return request({
    url: '/api/group/addGroupUsers',
    method: 'post',
    params: ids
  })
}
export function delGroupUsers(ids) {
  return request({
    url: '/api/group/delGroupUsers',
    method: 'post',
    params: ids
  })
}
