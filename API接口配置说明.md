# API 接口配置说明

## 已完成的配置

### 1. Vite 代理配置
- **目标地址**: `http://10.1.23.80:8082/shiye-retail`
- **代理路径**: `/system` 开头的请求会被代理到目标地址
- **开发环境**: 使用代理（避免跨域问题）
- **生产环境**: 使用完整 URL

### 2. 用户管理接口
- **接口地址**: `/system/user/list`
- **完整地址**: `http://10.1.23.80:8082/shiye-retail/system/user/list`
- **请求参数**: 
  - `pageNum`: 页码（默认 1）
  - `pageSize`: 每页数量（默认 10）
  - `name`: 用户名（可选，搜索用）
  - `status`: 状态（可选，搜索用）
  - `department`: 部门（可选，搜索用）

### 3. 部门列表接口
- **接口地址**: `/system/department/departList`
- **完整地址**: `http://10.1.23.80:8082/shiye-retail/system/department/departList`
- **返回数据**: 部门列表数组
- **用于**: BasicSelect 组件获取部门选项

### 4. 数据格式转换

#### 分页列表（BasicTable）
后端返回格式：
```json
{
  "code": 200,
  "msg": "success",
  "rows": [...],
  "total": 100
}
```

自动转换为 BasicTable 需要的格式：
```json
{
  "data": [...],
  "total": 100
}
```

#### 普通列表（BasicSelect）
后端返回格式（直接返回数组）：
```json
[
  { "id": "1", "name": "部门A" },
  { "id": "2", "name": "部门B" }
]
```

或者包装格式：
```json
{
  "code": 200,
  "data": [
    { "id": "1", "name": "部门A" }
  ]
}
```

自动提取为：
```json
[
  { "id": "1", "name": "部门A" }
]
```

## 文件说明

### vite.config.ts
- 配置了开发服务器代理
- 将 `/system` 开头的请求代理到后端服务器
- 解决了跨域问题

### src/api/config.ts
- 创建了 axios 实例
- 添加了请求/响应拦截器
- 自动转换后端数据格式（`{rows, total}` → `{data, total}`）
- 统一处理错误提示

### src/api/user.ts
- 定义了用户管理相关的 API 接口
- 包含类型定义（TypeScript）

### src/api/department.ts
- 定义了部门相关的 API 接口
- 包含部门数据的类型定义

### src/views/UserManagementView.vue
- BasicTable 使用 `query-url="/system/user/list"` 调用用户列表接口
- BasicTable 的部门搜索列动态加载部门选项（`onMounted` 时调用接口）
- BasicSelect 使用 `list-url="/system/department/departList"` 调用部门列表接口
- 支持分页、搜索等功能

### src/main.ts
- 注释掉了 mock 数据

## 使用方法

1. 启动开发服务器：
```bash
npm run dev
```

2. 访问 http://localhost:5175/ 并进入用户管理页面

3. 表格会自动调用真实接口获取数据

4. 支持的功能：
   - 分页
   - 搜索（姓名、状态、部门）
   - 刷新

## 代理工作原理

开发环境下：
- 前端请求：`http://localhost:5175/system/user/list?pageNum=1&pageSize=10`
- Vite 代理转发到：`http://10.1.23.80:8082/shiye-retail/system/user/list?pageNum=1&pageSize=10`

生产环境下：
- 直接请求：`http://10.1.23.80:8082/shiye-retail/system/user/list?pageNum=1&pageSize=10`

## 注意事项

1. 确保后端服务 `http://10.1.23.80:8082/shiye-retail` 可访问
2. 开发环境使用代理，无需担心跨域问题
3. 生产环境需要后端配置 CORS
4. 后端返回的数据字段需要与前端列定义匹配

## 添加其他接口

如果需要配置其他接口（如商品管理、订单管理等）：

1. 在 `vite.config.ts` 中添加代理规则（如果路径不是 `/system` 开头）：
```typescript
proxy: {
  '/system': {
    target: 'http://10.1.23.80:8082/shiye-retail',
    changeOrigin: true
  },
  '/api': {  // 添加其他路径
    target: 'http://10.1.23.80:8082/shiye-retail',
    changeOrigin: true
  }
}
```

2. 在 `src/api/` 下创建对应的 API 文件

3. 在页面中使用 `query-url` 指定接口地址
