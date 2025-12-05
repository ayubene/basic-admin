<template>
  <div class="page-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">用户管理</h2>
        <p style="margin: 4px 0 0; color: #909399">演示如何结合 BasicTable、BasicSelect 与 BasicModal</p>
      </div>
      <el-space>
        <BasicButton type="primary" @click="handleCreate">
          新增用户
        </BasicButton>
        <BasicButton type="success" :on-click="refresh">
          手动刷新
        </BasicButton>
      </el-space>
    </div>

    <BasicTable
      ref="tableRef"
      :columns="columns"
      query-url="/system/user/list"
      :height="520"
      :show-export="false"
      :show-create="false"
      :enable-column-customize="true"
      column-customize-key="user-management"
      :search-form-cols="3"
      @selection-change="handleSelectionChange"
    >
      <!-- 工具栏插槽：添加批量操作按钮 -->
      <template #toolbar>
        <BasicButton type="info" :on-click="handleExportTemplate">导出模板</BasicButton>
        <BasicButton type="warning" :on-click="handleImport">导入用户信息</BasicButton>
        <BasicButton type="success" :disabled="selectedRows.length === 0" :on-click="handleBatchUpdate">
          批量更新
        </BasicButton>
      </template>

      <!-- 状态列自定义渲染 -->
      <template #status="{ row }">
        <el-tag :type="row.status === 1 ? 'success' : 'danger'" size="small">
          {{ row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <!-- 操作栏插槽：添加确认按钮 -->
      <template #action="{ row }">
        <BasicButton type="success" link size="small" :on-click="() => handleConfirm(row)">
          确认
        </BasicButton>
      </template>
    </BasicTable>
  </div>

  <BasicModal v-model="modalVisible" :title="modalTitle" width="520px">
    <el-form :model="form" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="部门">
            <BasicSelect
              v-model="form.department"
              list-url="/system/department/departList"
              value-key="id"
              label-key="name"
              @data-loaded="handleDeptLoaded"
              placeholder="请选择部门"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <BasicButton type="primary" :on-click="submitForm">提交</BasicButton>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { TableColumn, TableInstance } from 'srit-basic-components'

// 部门选项（动态加载）
const departmentOptions = ref<{ label: string; value: string }[]>([])

// 部门映射（用于显示）
const departmentMap = ref<Record<string, string>>({})

const columns: TableColumn[] = [
  { field: 'id', title: 'ID', width: 80, align: 'center' },
  {
    field: 'name',
    title: '姓名',
    align: 'center',
    searchable: true,
    searchType: 'input',
    formatter: ({ cellValue }) => cellValue || '--'
  },
  {
    field: 'email',
    title: '邮箱',
    align: 'center',
    formatter: ({ cellValue }) => cellValue || '--'
  },
  {
    field: 'status',
    title: '状态',
    align: 'center',
    searchable: true,
    searchType: 'select',
    searchOptions: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ],
    slots: { default: 'status' }
  },
  {
    field: 'department',
    title: '部门',
    align: 'center',
    searchable: true,
    searchType: 'select',
    searchOptions: departmentOptions,
    formatter: ({ cellValue }) => {
      return departmentMap.value[cellValue] || cellValue || '--'
    }
  },
  {
    field: 'createTime',
    title: '创建时间',
    align: 'center',
    formatter: ({ cellValue }) => cellValue || '--'
  }
]

// BasicSelect 自拉数据后回填表格搜索与映射
const handleDeptLoaded = (payload: { options: { label: string; value: string }[]; raw: any }) => {
  departmentOptions.value = payload.options || []
  departmentMap.value = (payload.options || []).reduce((map: Record<string, string>, item) => {
    map[item.value] = item.label
    return map
  }, {})
}

const tableRef = ref<TableInstance>()
const modalVisible = ref(false)
const modalTitle = ref('新增用户')
const form = ref({
  name: '',
  email: '',
  department: ''
})
const selectedRows = ref<any[]>([])

// 监听表格选择变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleCreate = () => {
  modalTitle.value = '新增用户'
  form.value = { name: '', email: '', department: '' }
  modalVisible.value = true
}

const submitForm = async () => {
  await new Promise((resolve) => setTimeout(resolve, 600))
  modalVisible.value = false
}

const refresh = async () => {
  await tableRef.value?.refresh()
}

// 导出模板
const handleExportTemplate = async () => {
  try {
    // 创建模板数据
    const templateData = [
      ['姓名', '邮箱', '部门', '状态'],
      ['示例用户', 'example@example.com', 'tech', '1']
    ]

    // 转换为 CSV 格式（简单实现，实际项目中可以用 xlsx 库）
    const csvContent = templateData.map((row) => row.join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `用户导入模板_${new Date().getTime()}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('模板导出成功')
  } catch (error) {
    console.error('Export template error:', error)
    ElMessage.error('模板导出失败')
  }
}

// 导入用户信息
const handleImport = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv,.xlsx,.xls'
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    try {
      // 这里应该调用后端接口上传文件
      // const formData = new FormData()
      // formData.append('file', file)
      // await request.post('/api/users/import', formData, {
      //   headers: { 'Content-Type': 'multipart/form-data' }
      // })

      // 模拟上传
      await new Promise((resolve) => setTimeout(resolve, 1000))

      ElMessage.success('用户信息导入成功')
      await tableRef.value?.refresh()
    } catch (error) {
      console.error('Import error:', error)
      ElMessage.error('用户信息导入失败')
    }
  }
  input.click()
}

// 批量更新
const handleBatchUpdate = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要更新的用户')
    return
  }

  try {
    const { value } = await ElMessageBox.prompt('请输入要更新的状态（1-启用，0-禁用）', '批量更新', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^[01]$/,
      inputErrorMessage: '请输入 0 或 1'
    })

    const status = Number(value)
    const ids = selectedRows.value.map((row) => row.id)

    // 这里应该调用后端接口进行批量更新
    // await request.put('/api/users/batch-update', { ids, status })

    // 模拟更新
    await new Promise((resolve) => setTimeout(resolve, 800))

    ElMessage.success(`成功更新 ${selectedRows.value.length} 条记录`)
    // 不清空选中状态，保持按钮可用，用户可以继续操作
    // 如果需要清除选中，可以调用: tableRef.value?.clearSelection()
    await tableRef.value?.refresh()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Batch update error:', error)
      ElMessage.error('批量更新失败')
    }
  }
}

// 确认操作
const handleConfirm = async (row: any) => {
  try {
    const userName = row.name || '该用户'
    await ElMessageBox.confirm(`确定要确认用户 "${userName}" 吗？`, '提示', {
      type: 'warning'
    })

    // 这里应该调用后端接口进行确认
    // await request.post('/api/users/confirm', { id: row.id })

    // 模拟确认
    await new Promise((resolve) => setTimeout(resolve, 600))

    ElMessage.success('确认成功')
    await tableRef.value?.refresh()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Confirm error:', error)
      ElMessage.error('确认失败')
    }
  }
}
</script>

<style scoped>
/* 交互元素添加 cursor:pointer */
:deep(.el-button),
:deep(.el-tag),
:deep(.el-link),
:deep(.el-checkbox__input),
:deep(.el-radio__input),
:deep(.el-switch),
:deep(.el-select),
:deep(.el-input__inner),
:deep(.el-pagination button),
:deep(.el-pagination .number),
:deep(.vxe-table .vxe-checkbox),
:deep(.vxe-table .vxe-cell),
:deep(.vxe-table .vxe-header--column) {
  cursor: pointer;
}

:deep(.el-button:disabled),
:deep(.el-input__inner:disabled),
:deep(.el-select.is-disabled) {
  cursor: not-allowed;
}
</style>
