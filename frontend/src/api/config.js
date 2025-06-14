import axios from 'axios'

// 根据环境设置基础URL
const baseURL = import.meta.env.PROD 
  ? '/api'  // 生产环境，使用 /api 前缀
  : 'http://localhost:3000/api'  // 开发环境

const api = axios.create({
  baseURL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    if (import.meta.env.DEV) {
      console.log('=== 发送请求 ===')
      console.log('请求URL:', config.url)
      console.log('请求方法:', config.method)
      console.log('请求头:', config.headers)
      console.log('请求数据:', config.data)
    }
    return config
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject({ error: '请求配置错误' })
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    if (import.meta.env.DEV) {
      console.log('=== 收到响应 ===')
      console.log('响应状态:', response.status)
      console.log('响应数据:', response.data)
    }
    return response
  },
  error => {
    if (import.meta.env.DEV) {
      console.error('=== 响应错误 ===')
      if (error.response) {
        console.error('状态码:', error.response.status)
        console.error('响应数据:', error.response.data)
      } else if (error.request) {
        console.error('请求已发送但没有收到响应')
      } else {
        console.error('请求配置错误:', error.message)
      }
    }

    // 统一错误格式
    if (error.response) {
      // 如果响应中已经有error字段，直接传递
      if (error.response.data && error.response.data.error) {
        return Promise.reject(error.response.data)
      }
      // 否则，根据状态码生成错误信息
      const errorMessages = {
        400: '请求参数错误',
        401: '未授权',
        403: '禁止访问',
        404: '资源不存在',
        500: '服务器错误'
      }
      return Promise.reject({ 
        error: errorMessages[error.response.status] || '请求失败' 
      })
    }
    
    return Promise.reject({ error: '网络请求失败' })
  }
)

export default api
