import request from './config'

// 用户列表查询参数接口
export interface UserListParams {
  pageNum: number
  pageSize: number
  name?: string
  status?: number
  department?: string
}

// 用户信息接口
export interface UserInfo {
  id: number
  name: string
  email: string
  status: number
  department: string
  createTime: string
}

// 分页响应接口
export interface PageResponse<T> {
  code: number
  msg: string
  rows: T[]
  total: number
}

/**
 * 获取用户列表
 */
export const getUserList = (params: UserListParams) => {
  return request.get<any, PageResponse<UserInfo>>('/system/user/list', { params })
}

/**
 * 创建用户
 */
export const createUser = (data: Partial<UserInfo>) => {
  return request.post('/system/user', data)
}

/**
 * 更新用户
 */
export const updateUser = (id: number, data: Partial<UserInfo>) => {
  return request.put(`/system/user/${id}`, data)
}

/**
 * 删除用户
 */
export const deleteUser = (id: number) => {
  return request.delete(`/system/user/${id}`)
}

/**
 * 批量删除用户
 */
export const batchDeleteUser = (ids: number[]) => {
  return request.delete('/system/user/batch', { data: { ids } })
}
