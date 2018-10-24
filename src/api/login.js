import request from '@/authority/request'
import qs from 'qs'

export function loginByUsername(clientId, userName, password) {
  const data = {
    clientId,
    userName,
    password
  }
  return request({
    url: '/auth/login',
    method: 'post',
    data: qs.stringify(data)
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/api/user/info',
    method: 'get'
  })
}

