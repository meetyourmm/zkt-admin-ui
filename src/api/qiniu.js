import request from '@/authority/request'

export function getToken() {
  return request({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  })
}
