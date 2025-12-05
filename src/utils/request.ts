import { request } from 'srit-basic-components'
import { ElMessage } from 'element-plus'

/**
 * 配置 srit-basic-components 的 request 实例
 * 为所有请求添加 token 和其他全局配置
 */

// 基础 URL 配置（开发环境使用代理，生产环境使用完整 URL）
const BASE_URL = import.meta.env.PROD 
  ? 'http://10.1.23.80:8082/shiye-retail' 
  : ''

// 配置 baseURL
if ((request as any).defaults) {
  ;(request as any).defaults.baseURL = BASE_URL
  ;(request as any).defaults.timeout = 10000
}

/**
 * 获取 token
 * 可以从 localStorage、sessionStorage 或其他地方获取
 */
const getToken = (): string | null => {
  // 方式1: 从 localStorage 获取
  return localStorage.getItem('token')
  
  // 方式2: 从 sessionStorage 获取
  // return sessionStorage.getItem('token')
  
  // 方式3: 从 cookie 获取
  // return document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || null
}

/**
 * 设置 token
 */
export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

/**
 * 清除 token
 */
export const clearToken = () => {
  localStorage.removeItem('token')
}

// 请求拦截器 - 添加 token
if ((request as any).interceptors) {
  ;(request as any).interceptors.request.use(
    (config: any) => {
      const token = getToken()
      
      // 如果有 token，添加到请求头
      if (token) {
        // 根据后端要求选择合适的 header 名称
        config.headers.Authorization = `Bearer ${token}`
        // 或者使用其他格式：
        // config.headers.token = token
        // config.headers['X-Token'] = token
      }
      
      return config
    },
    (error: any) => {
      console.error('请求错误:', error)
      return Promise.reject(error)
    }
  )

  // 响应拦截器 - 处理数据格式和错误
  ;(request as any).interceptors.response.use(
    (response: any) => {
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
    (error: any) => {
      console.error('响应错误:', error)
      
      if (error.response) {
        const { status, data } = error.response
        switch (status) {
          case 401:
            ElMessage.error('未授权，请重新登录')
            // 清除 token 并跳转到登录页
            clearToken()
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
}

export default request
