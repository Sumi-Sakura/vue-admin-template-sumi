import request from '@/utils/request'

const api = {}

export default api

// 登录
export function login(data) {
  return request({
    url: '',
    method: 'post',
    data,
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '',
    method: 'get',
    params: { token },
  })
}

// 登出
export function logout() {
  return request({
    url: '',
    method: 'post',
  })
}
