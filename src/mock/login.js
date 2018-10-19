import { param2Obj } from '@/utils'

const userMap = {
  admin: {
    roles: ['admin'],
    token: 'admin',
    introduction: '我是超级管理员',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  editor: {
    roles: ['editor'],
    token: 'editor',
    introduction: '我是编辑',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  loginByUsername: config => {
    const { userName } = JSON.parse(config.body)
    return {
      status: 200,
      message: 'Success',
      success: true,
      data: userName
    }
  },
  getUserInfo: config => {
    const { token } = param2Obj(config.url)
    if (userMap[token]) {
      return {
        status: 200,
        message: 'Success',
        success: true,
        data: userMap[token]
      }
    } else {
      return {
        status: 40101,
        message: '获取用户失败',
        success: true,
        data: false
      }
    }
  },
  logout: () => 'success'
}
