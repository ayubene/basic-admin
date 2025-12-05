# Token 配置说明

## ✅ 已完成配置

所有请求（包括 BasicTable、BasicSelect 等组件的请求）都会自动添加 token。

## 📁 相关文件

### 1. src/utils/request.ts
配置了 `srit-basic-components` 的全局请求拦截器：
- 自动从 localStorage 获取 token
- 在所有请求头中添加 `Authorization: Bearer {token}`
- 处理 401 未授权错误（自动清除 token）

### 2. src/api/config.ts
配置了自定义 axios 实例的请求拦截器：
- 用于手动调用的 API（如 `getUserList`、`getDepartmentList` 等）
- 同样会自动添加 token

### 3. src/utils/auth.ts
提供了 token 管理的工具函数：
- `setToken(token)` - 设置 token
- `getToken()` - 获取 token
- `clearToken()` - 清除 token
- `isAuthenticated()` - 检查是否已登录
- `logout()` - 登出

### 4. src/main.ts
导入了 `./utils/request`，确保在应用启动时配置拦截器

## 🔧 使用方法

### 1. 登录时设置 token

```typescript
import { setToken } from '@/utils/auth'

// 登录成功后
const handleLogin = async () => {
  const response = await loginApi({ username, password })
  const token = response.data.token
  
  // 保存 token
  setToken(token)
  
  // 跳转到首页
  router.push('/')
}
```

### 2. 登出时清除 token

```typescript
import { logout } from '@/utils/auth'

const handleLogout = () => {
  logout()
  router.push('/login')
}
```

### 3. 检查登录状态

```typescript
import { isAuthenticated } from '@/utils/auth'

// 在路由守卫中使用
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    next('/login')
  } else {
    next()
  }
})
```

### 4. 手动测试（浏览器控制台）

```javascript
// 设置一个测试 token
localStorage.setItem('token', 'your-test-token-here')

// 刷新页面，所有请求都会带上这个 token

// 查看请求头（在 Network 标签中）
// Authorization: Bearer your-test-token-here
```

## 📝 Token 格式配置

默认使用 `Authorization: Bearer {token}` 格式，如果后端要求不同的格式，可以修改：

### 修改 src/utils/request.ts

```typescript
// 当前格式（JWT 标准）
config.headers.Authorization = `Bearer ${token}`

// 其他可能的格式：
// 格式1: 直接使用 token 字段
config.headers.token = token

// 格式2: 使用 X-Token
config.headers['X-Token'] = token

// 格式3: 使用自定义字段
config.headers['X-Auth-Token'] = token
```

### 同时修改 src/api/config.ts

确保两个文件使用相同的格式。

## 🔒 Token 存储位置

当前使用 `localStorage` 存储 token，也可以改为其他方式：

### 使用 sessionStorage（关闭浏览器后失效）

```typescript
// 在 src/utils/auth.ts 中修改
export const setToken = (token: string): void => {
  sessionStorage.setItem('token', token)
}

export const getToken = (): string | null => {
  return sessionStorage.getItem('token')
}
```

### 使用 Cookie

```typescript
// 需要安装 js-cookie: npm install js-cookie
import Cookies from 'js-cookie'

export const setToken = (token: string): void => {
  Cookies.set('token', token, { expires: 7 }) // 7天过期
}

export const getToken = (): string | null => {
  return Cookies.get('token') || null
}
```

## 🚀 自动生效的请求

配置完成后，以下所有请求都会自动带上 token：

### BasicTable
```vue
<BasicTable
  query-url="/system/user/list"
  delete-url="/system/user"
/>
```

### BasicSelect
```vue
<BasicSelect
  list-url="/system/department/departList"
  value-key="id"
  label-key="name"
/>
```

### 手动 API 调用
```typescript
import { getUserList } from '@/api/user'

// 这个请求也会自动带上 token
const users = await getUserList({ pageNum: 1, pageSize: 10 })
```

## ⚠️ 注意事项

1. **401 错误处理**
   - 当收到 401 错误时，会自动清除 token
   - 需要手动跳转到登录页（在拦截器中添加路由跳转）

2. **Token 过期**
   - 建议后端返回 token 过期时间
   - 前端可以在 token 快过期时自动刷新

3. **安全性**
   - localStorage 可能受到 XSS 攻击
   - 生产环境建议使用 httpOnly cookie
   - 或者使用更安全的存储方案

4. **跨域问题**
   - 开发环境使用 Vite 代理，不会有跨域问题
   - 生产环境需要后端配置 CORS

## 🧪 测试 Token 功能

### 1. 在浏览器控制台设置 token
```javascript
localStorage.setItem('token', 'test-token-123')
```

### 2. 刷新页面，打开 Network 标签

### 3. 查看任意请求的 Request Headers
应该能看到：
```
Authorization: Bearer test-token-123
```

### 4. 清除 token
```javascript
localStorage.removeItem('token')
```

## 📚 扩展功能

### 1. Token 刷新

```typescript
// src/api/auth.ts
export const refreshToken = async () => {
  const oldToken = getToken()
  const response = await request.post('/auth/refresh', { token: oldToken })
  const newToken = response.data.token
  setToken(newToken)
  return newToken
}
```

### 2. 自动刷新 Token

```typescript
// 在响应拦截器中添加
if (error.response?.status === 401) {
  try {
    const newToken = await refreshToken()
    // 重试原请求
    error.config.headers.Authorization = `Bearer ${newToken}`
    return request(error.config)
  } catch (refreshError) {
    logout()
    router.push('/login')
  }
}
```

### 3. Token 过期检查

```typescript
import { jwtDecode } from 'jwt-decode'

export const isTokenExpired = (): boolean => {
  const token = getToken()
  if (!token) return true
  
  try {
    const decoded: any = jwtDecode(token)
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}
```
