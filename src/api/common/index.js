import request from '@/utils/request'

const api = {
  model: '/',
}

export default api

// 模板
export function model(data) {
  return request({
    url: api.model,
    method: 'post',
    data,
  })
}
