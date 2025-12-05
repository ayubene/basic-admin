import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import { request } from 'srit-basic-components'
import BasicComponents from 'srit-basic-components'
import { ElMessage } from 'element-plus'
import App from './App.vue'
import router from './router'
import './styles/index.css'
// import './mock' // 使用真实接口时注释掉 mock

// ===== 配置 BasicComponents 的 request 实例 =====
console.log('🔧 开始配置 request 拦截器')
console.log('request 对象:', request)
console.log('request.instance:', (request as any).instance)

// 获取真正的 axios 实例
const axiosInstance = (request as any).instance
console.log('axios 实例:', axiosInstance)
console.log('axios.interceptors:', axiosInstance?.interceptors)

// 获取 token（如果没有，使用默认值）
const getToken = () => {
  const token = localStorage.getItem('token')
  // 如果没有 token，可以设置一个默认值用于测试
  // 生产环境请删除这个默认值
  return token || 'default-test-token-123'
}

// 配置请求拦截器 - 添加 token
if (axiosInstance && axiosInstance.interceptors && axiosInstance.interceptors.request) {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      const token = getToken()
      console.log('🔍 请求拦截:', config.url, 'Token:', token)
      
      if (token) {
        if (!config.headers) {
          config.headers = {}
        }
        config.headers.Authorization = `Bearer ${token}`
        console.log('✅ 已添加 Authorization 头')
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
  console.warn('⚠️ axios.interceptors.request 不存在')
}

// 配置响应拦截器 - 处理数据格式
if (axiosInstance && axiosInstance.interceptors && axiosInstance.interceptors.response) {
  axiosInstance.interceptors.response.use(
    (response: any) => {
      const { data } = response
      console.log('📥 响应拦截:', response.config.url)
      
      // 处理分页数据 {rows, total} -> {data, total}
      if (data && data.rows !== undefined && data.total !== undefined) {
        console.log('✅ 转换分页数据')
        return {
          ...response,
          data: {
            data: data.rows,
            total: data.total
          }
        }
      }
      
      // 处理数组数据
      if (Array.isArray(data)) {
        console.log('✅ 数组数据')
        return response
      }
      
      // 处理 {code, data: []} 格式
      if (data && data.code !== undefined && Array.isArray(data.data)) {
        console.log('✅ 提取 data 数组')
        return {
          ...response,
          data: data.data
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
            localStorage.removeItem('token')
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
  console.warn('⚠️ axios.interceptors.response 不存在')
}

console.log('🎉 request 配置完成')
// ===== 配置结束 =====

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)
app.use(VXETable)
app.use(BasicComponents)

app.mount('#app')
