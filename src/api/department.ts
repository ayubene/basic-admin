import request from './config'

// 部门信息接口
export interface DepartmentInfo {
  id: string
  mdmId: string
  code: string
  name: string
  mdmCode: string
  isused: string
  fatherDept: string
  fatherDeptName: string
  shortname: string
  org: string
  orgName: string
  def1Name: string
  def1Code: string
  hrcanceled: string
  def1: string
  def2: string
  def3: string
  def4: string
  def5: string
  deptFatherLeaderCode: string
  deptFatherLeaderName: string
  order: number
  childList: any
}

/**
 * 获取部门列表
 */
export const getDepartmentList = () => {
  return request.get<any, DepartmentInfo[]>('/system/department/departList')
}
