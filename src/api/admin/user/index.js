import request from '@/authority/request'
import qs from 'qs'

export function page(data) {
  return request({
    url: '/api/user/page',
    method: 'post',
    data: qs.stringify(data)
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
    data: qs.stringify(id)
  })
}

export function delObj(id) {
  return request({
    url: '/api/user/delObj',
    method: 'post',
    data: qs.stringify(id)
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
    data: qs.stringify(userName)
  })
}
