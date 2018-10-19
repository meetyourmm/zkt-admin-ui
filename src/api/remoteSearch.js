import request from '@/authority/request'

export function userSearch(name) {
  return request({
    url: '/search/user',
    method: 'get',
    params: { name }
  })
}
