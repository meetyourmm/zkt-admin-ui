import request from '@/authority/request'
import qs from 'qs'

export function page(data) {
  return request({
    url: '/api/user/page',
    method: 'post',
    params: data
  })
}

export function addObj(obj) {
  return request({
    url: '/api/user/addObj',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/api/user/getObj',
    method: 'post',
    params: id
  })
}

export function delObj(id) {
  return request({
    url: '/api/user/delObj',
    method: 'post',
    params: id
  })
}

export function putObj(obj) {
  return request({
    url: '/api/user/putObj',
    method: 'post',
    data: obj
  })
}
export function validateUser(userName) {
  return request({
    url: '/api/user/validateUser',
    method: 'post',
    params: userName
  })
}
