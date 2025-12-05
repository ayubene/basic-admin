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

// 调试：打印 request 对象结构
console.log('BasicComponents request:', request)
console.log('request.defaults:', (request as any).defaults)
console.log('request.interceptors:', (request as any).interceptors)

// 配置 baseURL
try {
  if ((request as any).defaults) {
    ;(request as any).defaults.baseURL = BASE_URL
    ;(request as any).defaults.timeout = 10000
    console.log('✅ 成功配置 baseURL 和 timeout')
  } else {
    console.warn('⚠️ request.defaults 不存在')
  }
} catch (error) {
  console.error('❌ 配置 defaults 失败:', error)
}

/**
 * 获取 token
 */
const getToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * 设置 token
 */
export const setToken = (token: string) => {
  localStorage.setItem('token', token)
  console.log('✅ Token 已设置:', token)
}

/**
 * 清除 token
 */
export const clearToken = () => {
  localStorage.removeItem('token')
  console.log('✅ Token 已清除')
}

// 请求拦截器 - 添加 token
try {
  if ((request as any).interceptors && (request as any).interceptors.request) {
    ;(request as any).interceptors.request.use(
      (config: any) => {
        const token = getToken()  || 'qdsfmksd'
        
        console.log('🔍 请求拦截器触发:', config.url)
        console.log('🔑 当前 token:', token)
        
        // 如果有 token，添加到请求头
        if (token) {
          if (!config.headers) {
            config.headers = {}
          }
          config.headers.Authorization = `Bearer ${token}`
          console.log('✅ 已添加 Authorization 头')
        } else {
          console.warn('⚠️ 没有找到 token')
        }
        
        return config
      },
      (error: any) => {
        console.error('❌ 请求错误:', error)
        return Promise.reject(error)
      }
    )
    console.log('✅ 请求拦截器配置成功')
  } else {
    console.warn('⚠️ request.interceptors.request 不存在')
  }
} catch (error) {
  console.error('❌ 配置请求拦截器失败:', error)
}

// 响应拦截器 - 处理数据格式和错误
try {
  if ((request as any).interceptors && (request as any).interceptors.response) {
    ;(request as any).interceptors.response.use(
      (response: any) => {
        const { data, config } = response
        
        console.log('📥 响应拦截器触发:', config.url)
        
        // 如果后端返回的数据结构是 { code, msg, rows, total }
        // 需要转换为 BasicTable 期望的格式 { data, total }
        if (data && typeof data === 'object') {
          // 处理分页列表数据（用户列表等）
          if (data.rows !== undefined && data.total !== undefined) {
            console.log('✅ 转换分页数据格式')
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
            console.log('✅ 数组数据，直接返回')
            return response
          }
          
          // 如果返回格式是 { code, msg, data: [...] }，提取 data
          if (data.code !== undefined && Array.isArray(data.data)) {
            console.log('✅ 提取 data 数组')
            return {
              ...response,
              data: data.data
            }
          }
        }
        
        return response
      },
      (error: any) => {
        console.error('❌ 响应错误:', error)
        
        if (error.response) {
          const { status, data } = error.response
          switch (status) {
            case 401:
              ElMessage.error('未授权，请重新登录')
              clearToken()
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
    console.log('✅ 响应拦截器配置成功')
  } else {
    console.warn('⚠️ request.interceptors.response 不存在')
  }
} catch (error) {
  console.error('❌ 配置响应拦截器失败:', error)
}

export default request
