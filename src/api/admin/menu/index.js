import request from '@/authority/request'
import qs from 'qs'

export function fetchTree(query) {
  return request({
    url: '/api/menu/tree',
    method: 'get',
    params: query
  })
}
export function getGroupAuth(groupId) {
  return request({
    url: '/api/menu/getGroupAuth',
    method: 'post',
    params: groupId
  })
}
export function fetchAll() {
  return request({
    url: '/api/menu/all',
    method: 'get'
  })
}
export function addObj(obj) {
  return request({
    url: '/api/menu/addObj',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/menu/getObj',
    method: 'post',
    data: qs.stringify(id)
  })
}

export function delObj(id) {
  return request({
    url: '/api/menu/delObj',
    method: 'post',
    data: qs.stringify(id)
  })
}

export function putObj(obj) {
  return request({
    url: '/api/menu/putObj',
    method: 'post',
    data: obj
  })
}
export function validateCode(code) {
  return request({
    url: '/api/menu/validateCode',
    method: 'post',
    data: qs.stringify(code)
  })
}

export function getElementList(query) {
  return request({
    url: '/api/menu/getElementList',
    method: 'get',
    params: query
  })
}
export function saveAuthTree(obj) {
  return request({
    url: '/api/menu/saveAuthTree',
    method: 'post',
    params: obj
  })
}
