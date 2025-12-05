/**
 * 认证相关工具函数
 */

/**
 * 设置 token
 * @param token - JWT token 或其他认证 token
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token)
}

/**
 * 获取 token
 * @returns token 字符串或 null
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * 清除 token
 */
export const clearToken = (): void => {
  localStorage.removeItem('token')
}

/**
 * 检查是否已登录（是否有 token）
 * @returns 是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken()
}

/**
 * 登出
 * 清除 token 并跳转到登录页（如果需要）
 */
export const logout = (): void => {
  clearToken()
  // 如果需要跳转到登录页，可以在这里添加路由跳转
  // router.push('/login')
}
