import axios from 'axios'
import { ElMessage } from 'element-plus'

// 基础 URL 配置（开发环境使用代理，生产环境使用完整 URL）
export const BASE_URL = import.meta.env.PROD 
  ? 'http://10.1.23.80:8082/shiye-retail' 
  : ''

// 创建 axios 实例
const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器 - 添加 token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      // 或者根据后端要求使用其他格式：
      // config.headers.token = token
      // config.headers['X-Token'] = token
    }
    
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data, config } = response
    
    // 如果后端返回的数据结构是 { code, msg, rows, total }
    // 需要转换为 BasicTable 期望的格式 { data, total }
    if (data && typeof data === 'object') {
      // 处理分页列表数据（用户列表等）
      if (data.rows !== undefined && data.total !== undefined) {
        return {
          ...response,
          data: {
            data: data.rows,
            total: data.total
          }
        }
      }
      
      // 处理普通列表数据（部门列表等）- BasicSelect 需要的格式
      // 如果是数组，直接返回，BasicSelect 会使用
      if (Array.isArray(data)) {
        return response
      }
      
      // 如果返回格式是 { code, msg, data: [...] }，提取 data
      if (data.code !== undefined && Array.isArray(data.data)) {
        return {
          ...response,
          data: data.data
        }
      }
    }
    
    return response
  },
  (error) => {
    console.error('响应错误:', error)
    
    if (error.response) {
      const { status, data } = error.response
      switch (status) {
        case 401:
          ElMessage.error('未授权，请重新登录')
          // 清除 token
          localStorage.removeItem('token')
          // 如果有路由，可以跳转到登录页
          // router.push('/login')
          break
        case 403:
          ElMessage.error('拒绝访问')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error(data?.msg || '服务器错误')
          break
        default:
          ElMessage.error(data?.msg || '请求失败')
      }
    } else {
      ElMessage.error('网络错误，请检查网络连接')
    }
    
    return Promise.reject(error)
  }
)

export default request

/**
 * 导出 token 管理函数
 */
export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const clearToken = () => {
  localStorage.removeItem('token')
}
