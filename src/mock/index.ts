import { request } from 'srit-basic-components'

interface UserRecord {
  id: number
  name: string
  email: string
  status: 1 | 0
  department: string
  createTime: string
}

let users: UserRecord[] = Array.from({ length: 32 }).map((_, idx) => ({
  id: idx + 1,
  name: `用户${idx + 1}`,
  email: `user${idx + 1}@example.com`,
  status: (idx + 1) % 3 === 0 ? 0 : 1,
  department: ['tech', 'product', 'operation'][idx % 3],
  createTime: `2024-01-${(idx % 28) + 1}`.padEnd(10, '0') + ' 10:00:00'
}))

const departments = [
  { id: 'tech', name: '技术部' },
  { id: 'product', name: '产品部' },
  { id: 'operation', name: '运营部' }
]

// 商品数据
interface ProductRecord {
  id: number
  name: string
  code: string
  category: string
  brand: string
  price: number
  stock: number
  sales: number
  status: 0 | 1 | 2
  image?: string
  description?: string
  createTime: string
}

// 生成大量商品数据用于测试虚拟滚动
const categories = ['电子产品', '服装', '食品', '家居', '图书']
const brands = ['Apple', 'Samsung', 'Nike', 'Adidas', '华为', '小米', '美的', '格力']
const statuses: (0 | 1 | 2)[] = [0, 1, 2]

let products: ProductRecord[] = Array.from({ length: 500 }).map((_, idx) => ({
  id: idx + 1,
  name: `商品${idx + 1} ${['手机', '电脑', '衣服', '鞋子', '食品', '家具', '书籍'][idx % 7]}`,
  code: `PROD${String(idx + 1).padStart(6, '0')}`,
  category: categories[idx % categories.length],
  brand: brands[idx % brands.length],
  price: Math.floor(Math.random() * 10000) + 100,
  stock: Math.floor(Math.random() * 200),
  sales: Math.floor(Math.random() * 1000),
  status: statuses[idx % statuses.length],
  image: idx % 3 === 0 ? `https://picsum.photos/200/200?random=${idx}` : undefined,
  description: `这是商品${idx + 1}的详细描述信息，包含了商品的各种特点和优势。`,
  createTime: `2024-${String((idx % 12) + 1).padStart(2, '0')}-${String((idx % 28) + 1).padStart(2, '0')} ${String(10 + (idx % 14)).padStart(2, '0')}:${String(idx % 60).padStart(2, '0')}:00`
}))

const productCategories = categories.map((name) => ({ id: name, name }))

export function setupMock() {
  const originalGet = request.get.bind(request)
  const originalDelete = request.delete.bind(request)

  request.get = async (url: string, params?: any) => {
    if (url === '/api/users') {
      const page = Number(params?.page ?? 1)
      const pageSize = Number(params?.pageSize ?? 10)

      let data = [...users]
      if (params?.name) {
        data = data.filter((u) => u.name.includes(params.name))
      }
      if (params?.status !== undefined && params?.status !== '') {
        data = data.filter((u) => u.status === Number(params.status))
      }
      const start = (page - 1) * pageSize
      const list = data.slice(start, start + pageSize)
      return {
        code: 200,
        data: {
          list,
          total: data.length
        }
      }
    }

    if (url === '/api/departments') {
      return {
        code: 200,
        data: departments
      }
    }

    if (url === '/api/products') {
      const page = Number(params?.page ?? 1)
      const pageSize = Number(params?.pageSize ?? 20)

      let data = [...products]

      // 搜索过滤
      if (params?.name) {
        data = data.filter((p) => p.name.includes(params.name))
      }
      if (params?.code) {
        data = data.filter((p) => p.code.includes(params.code))
      }
      if (params?.category) {
        data = data.filter((p) => p.category === params.category)
      }
      if (params?.brand) {
        data = data.filter((p) => p.brand.includes(params.brand))
      }
      if (params?.status !== undefined && params?.status !== '') {
        data = data.filter((p) => p.status === Number(params.status))
      }
      if (params?.price !== undefined && params?.price !== '') {
        data = data.filter((p) => p.price >= Number(params.price))
      }
      if (params?.stock !== undefined && params?.stock !== '') {
        data = data.filter((p) => p.stock >= Number(params.stock))
      }
      // 日期范围过滤
      if (params?.createTimeStart) {
        data = data.filter((p) => p.createTime >= params.createTimeStart)
      }
      if (params?.createTimeEnd) {
        data = data.filter((p) => p.createTime <= params.createTimeEnd)
      }

      const start = (page - 1) * pageSize
      const list = data.slice(start, start + pageSize)

      return {
        code: 200,
        data: {
          list,
          total: data.length
        }
      }
    }

    if (url === '/api/categories') {
      return {
        code: 200,
        data: productCategories
      }
    }

    return originalGet(url, params)
  }

  request.delete = async (url: string, params?: any) => {
    if (url === '/api/users') {
      if (params?.ids) {
        users = users.filter((u) => !params.ids.includes(u.id))
      }
      if (params?.id) {
        users = users.filter((u) => u.id !== params.id)
      }
      return {
        code: 200,
        data: null,
        message: '删除成功'
      }
    }

    if (url === '/api/products') {
      if (params?.ids) {
        products = products.filter((p) => !params.ids.includes(p.id))
      }
      if (params?.id) {
        products = products.filter((p) => p.id !== params.id)
      }
      return {
        code: 200,
        data: null,
        message: '删除成功'
      }
    }

    return originalDelete(url, params)
  }
}

setupMock()
