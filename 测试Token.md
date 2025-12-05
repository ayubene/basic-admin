# 快速测试 Token 功能

## 🧪 测试步骤

### 1. 打开浏览器访问应用
```
http://localhost:5175/
```

### 2. 打开浏览器开发者工具
- Windows/Linux: `F12` 或 `Ctrl + Shift + I`
- Mac: `Cmd + Option + I`

### 3. 在 Console 标签中设置 token
```javascript
localStorage.setItem('token', 'test-token-123456')
```

### 4. 刷新页面
按 `F5` 或 `Ctrl/Cmd + R`

### 5. 切换到 Network 标签

### 6. 进入用户管理页面
点击侧边栏的"用户管理"

### 7. 查看请求
在 Network 标签中找到以下请求：
- `list?pageNum=1&pageSize=10` (用户列表)
- `departList` (部门列表)

### 8. 查看请求头
点击任意请求，查看 **Request Headers**，应该能看到：
```
Authorization: Bearer test-token-123456
```

## ✅ 验证成功标志

如果看到以下内容，说明 token 配置成功：

1. **所有请求都带上了 Authorization 头**
   ```
   Authorization: Bearer test-token-123456
   ```

2. **BasicTable 的请求带 token**
   - 用户列表请求: `/system/user/list`
   - 包含 Authorization 头

3. **BasicSelect 的请求带 token**
   - 部门列表请求: `/system/department/departList`
   - 包含 Authorization 头

## 🔧 修改 Token 格式

如果后端要求不同的 token 格式，修改以下文件：

### src/utils/request.ts (第 56 行)
```typescript
// 当前格式
config.headers.Authorization = `Bearer ${token}`

// 改为其他格式，例如：
config.headers.token = token
// 或
config.headers['X-Token'] = token
```

### src/api/config.ts (第 24 行)
```typescript
// 保持与 request.ts 相同的格式
config.headers.Authorization = `Bearer ${token}`
```

## 🧹 清除 Token

在浏览器控制台执行：
```javascript
localStorage.removeItem('token')
```

然后刷新页面，请求将不再包含 Authorization 头。

## 📝 实际使用场景

### 登录后设置 token
```typescript
// 在登录组件中
import { setToken } from '@/utils/auth'

const handleLogin = async () => {
  try {
    const response = await loginApi({
      username: username.value,
      password: password.value
    })
    
    // 保存 token
    setToken(response.data.token)
    
    // 跳转到首页
    router.push('/')
    
    ElMessage.success('登录成功')
  } catch (error) {
    ElMessage.error('登录失败')
  }
}
```

### 登出时清除 token
```typescript
import { logout } from '@/utils/auth'

const handleLogout = () => {
  logout()
  router.push('/login')
  ElMessage.success('已退出登录')
}
```

## ⚠️ 常见问题

### 1. 请求没有带 token
**原因**: localStorage 中没有 token
**解决**: 在控制台执行 `localStorage.setItem('token', 'your-token')`

### 2. Token 格式不对
**原因**: 后端要求的格式与前端配置不一致
**解决**: 修改 `src/utils/request.ts` 和 `src/api/config.ts` 中的 header 格式

### 3. 401 错误
**原因**: Token 无效或过期
**解决**: 
- 检查 token 是否正确
- 检查后端是否正确验证 token
- Token 过期需要重新登录

## 🎯 下一步

1. 创建登录页面
2. 实现登录接口
3. 登录成功后保存 token
4. 添加路由守卫，未登录跳转到登录页
5. 实现 token 刷新机制（可选）
