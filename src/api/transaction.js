import request from '@/authority/request'

export function fetchList(query) {
  return request({
    url: '/transaction/list',
    method: 'get',
    params: query
  })
}
