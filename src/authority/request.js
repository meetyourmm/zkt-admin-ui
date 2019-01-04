import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/authority/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  // response => response,
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 当code返回如下情况则说明权限有问题，登出并返回到登录页
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
   */
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const resCode = response.status
    if (resCode !== 200) {
      Message({
        message: '访问接口异常',
        type: 'error',
        duration: 5 * 1000
      })
      // return Promise.reject('error')
    } else {
      const res = response.data
      if (res.status === 40101 || res.status === 40001 || res.status === 40401 || res.status === 500) { // token过期或者异常 用户异常 其他异常
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        // return Promise.reject('error')
      } else {
        return res
      }
      // if (res.code !== 200) {
      //   Message({
      //     message: res.message,
      //     type: 'error',
      //     duration: 5 * 1000
      //   })
      // }
    }
  },
  error => {
    console.log('访问接口异常：' + error) // for debug
    Message({
      message: '访问接口异常：' + error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
