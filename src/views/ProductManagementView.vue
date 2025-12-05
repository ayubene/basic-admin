<template>
  <div class="page-card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
      <div>
        <h2 style="margin: 0">商品管理</h2>
        <p style="margin: 4px 0 0; color: #909399">
          完整展示 BasicTable 组件的所有功能：搜索、导出、创建、删除、列自定义、虚拟滚动等
        </p>
      </div>
      <el-space>
        <BasicButton type="primary" @click="handleCreate">新增商品</BasicButton>
        <BasicButton type="success" :on-click="refresh">手动刷新</BasicButton>
      </el-space>
    </div>

    <BasicTable
      ref="tableRef"
      :columns="columns"
      query-url="/api/products"
      delete-url="/api/products"
      export-url="/api/products/export"
      :height="600"
      :page-size="20"
      :show-export="true"
      :show-create="true"
      :show-delete="true"
      :enable-column-customize="true"
      column-customize-key="product-management"
      :search-form-cols="3"
      :enable-virtual-scroll="true"
      :resizable="true"
      @selection-change="handleSelectionChange"
      @create="handleCreate"
      @edit="handleEdit"
      @delete="handleDelete"
    >
      <!-- 工具栏插槽：添加自定义按钮 -->
      <template #toolbar>
        <BasicButton type="info" :on-click="handleBatchExport">批量导出</BasicButton>
        <BasicButton type="warning" :on-click="handleBatchUpdate">批量上架</BasicButton>
      </template>

      <!-- 商品图片列自定义渲染 -->
      <template #image="{ row }">
        <el-image
          v-if="row.image"
          :src="row.image"
          :preview-src-list="[row.image]"
          preview-teleported
          style="width: 60px; height: 60px; border-radius: 4px"
          fit="cover"
        />
        <span v-else style="color: #909399">--</span>
      </template>

      <!-- 状态列自定义渲染 -->
      <template #status="{ row }">
        <el-tag :type="getStatusType(row.status)" size="small">
          {{ getStatusText(row.status) }}
        </el-tag>
      </template>

      <!-- 分类列自定义渲染 -->
      <template #category="{ row }">
        <el-tag type="info" size="small">{{ row.category || '--' }}</el-tag>
      </template>

      <!-- 价格列自定义渲染 -->
      <template #price="{ row }">
        <span style="color: #f56c6c; font-weight: 600">¥{{ row.price || '0.00' }}</span>
      </template>

      <!-- 库存列自定义渲染 -->
      <template #stock="{ row }">
        <el-tag :type="row.stock < 10 ? 'danger' : row.stock < 50 ? 'warning' : 'success'" size="small">
          {{ row.stock || 0 }}
        </el-tag>
      </template>

      <!-- 操作栏插槽：添加更多操作 -->
      <template #action="{ row }">
        <BasicButton type="success" link size="small" :on-click="() => handleViewDetail(row)">
          详情
        </BasicButton>
        <BasicButton type="warning" link size="small" :on-click="() => handleUpdateStock(row)">
          库存
        </BasicButton>
      </template>
    </BasicTable>
  </div>

  <!-- 新增/编辑商品弹窗 -->
  <BasicModal v-model="modalVisible" :title="modalTitle" width="800px">
    <el-form :model="form" label-width="100px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="商品名称" required>
            <el-input v-model="form.name" placeholder="请输入商品名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品编码">
            <el-input v-model="form.code" placeholder="请输入商品编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" required>
            <BasicSelect
              v-model="form.category"
              list-url="/api/categories"
              value-key="name"
              label-key="name"
              placeholder="请选择分类"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="品牌">
            <el-input v-model="form.brand" placeholder="请输入品牌" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="价格" required>
            <el-input-number
              v-model="form.price"
              :precision="2"
              :min="0"
              :max="999999"
              style="width: 100%"
              placeholder="请输入价格"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="库存" required>
            <el-input-number
              v-model="form.stock"
              :min="0"
              :max="999999"
              style="width: 100%"
              placeholder="请输入库存"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" required>
            <el-select v-model="form.status" placeholder="请选择状态" style="width: 100%">
              <el-option label="上架" :value="1" />
              <el-option label="下架" :value="0" />
              <el-option label="缺货" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销量">
            <el-input-number
              v-model="form.sales"
              :min="0"
              style="width: 100%"
              placeholder="请输入销量"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品图片">
            <el-input v-model="form.image" placeholder="请输入图片URL" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="商品描述">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="4"
              placeholder="请输入商品描述"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <BasicButton type="primary" :on-click="submitForm">提交</BasicButton>
            <BasicButton style="margin-left: 12px" @click="modalVisible = false">取消</BasicButton>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </BasicModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { request } from 'srit-basic-components'
import type { TableColumn, TableInstance } from 'srit-basic-components'

// 商品状态映射
const getStatusText = (status: number) => {
  const map: Record<number, string> = {
    0: '下架',
    1: '上架',
    2: '缺货'
  }
  return map[status] || '未知'
}

const getStatusType = (status: number) => {
  const map: Record<number, 'success' | 'danger' | 'warning'> = {
    0: 'danger',
    1: 'success',
    2: 'warning'
  }
  return map[status] || 'info'
}

// 列定义 - 完整展示所有功能
const columns: TableColumn[] = [
  { 
    field: 'id', 
    title: 'ID', 
    width: 80, 
    align: 'center',
    sortable: true
  },
  {
    field: 'image',
    title: '商品图片',
    width: 100,
    align: 'center',
    slots: { default: 'image' },
    sortable: false
  },
  {
    field: 'name',
    title: '商品名称',
    minWidth: 150,
    align: 'center',
    searchable: true,
    searchType: 'input',
    sortable: true,
    filterable: true,
    formatter: ({ cellValue }) => cellValue || '--'
  },
  {
    field: 'code',
    title: '商品编码',
    width: 120,
    align: 'center',
    searchable: true,
    searchType: 'input',
    sortable: true,
    formatter: ({ cellValue }) => cellValue || '--'
  },
  {
    field: 'category',
    title: '分类',
    width: 120,
    align: 'center',
    searchable: true,
    searchType: 'select',
    sortable: true,
    searchOptions: [
      { label: '电子产品', value: '电子产品' },
      { label: '服装', value: '服装' },
      { label: '食品', value: '食品' },
      { label: '家居', value: '家居' },
      { label: '图书', value: '图书' }
    ],
    slots: { default: 'category' }
  },
  {
    field: 'brand',
    title: '品牌',
    width: 120,
    align: 'center',
    searchable: true,
    searchType: 'input',
    sortable: true,
    formatter: ({ cellValue }) => cellValue || '--'
  },
  {
    field: 'price',
    title: '价格',
    width: 120,
    align: 'center',
    searchable: true,
    searchType: 'number',
    sortable: true,
    slots: { default: 'price' }
  },
  {
    field: 'stock',
    title: '库存',
    width: 100,
    align: 'center',
    searchable: true,
    searchType: 'number',
    sortable: true,
    slots: { default: 'stock' }
  },
  {
    field: 'sales',
    title: '销量',
    width: 100,
    align: 'center',
    sortable: true,
    formatter: ({ cellValue }) => cellValue || 0
  },
  {
    field: 'status',
    title: '状态',
    width: 100,
    align: 'center',
    searchable: true,
    searchType: 'select',
    sortable: true,
    searchOptions: [
      { label: '上架', value: 1 },
      { label: '下架', value: 0 },
      { label: '缺货', value: 2 }
    ],
    slots: { default: 'status' }
  },
  {
    field: 'createTime',
    title: '创建时间',
    width: 180,
    align: 'center',
    searchable: true,
    searchType: 'daterange',
    sortable: true,
    formatter: ({ cellValue }) => cellValue || '--'
  }
]

const tableRef = ref<TableInstance>()
const modalVisible = ref(false)
const modalTitle = ref('新增商品')
const form = ref({
  name: '',
  code: '',
  category: '',
  brand: '',
  price: 0,
  stock: 0,
  sales: 0,
  status: 1,
  image: '',
  description: ''
})
const selectedRows = ref<any[]>([])

// 监听表格选择变化
const handleSelectionChange = (rows: any[]) => {
  selectedRows.value = rows
}

const handleCreate = () => {
  modalTitle.value = '新增商品'
  form.value = {
    name: '',
    code: '',
    category: '',
    brand: '',
    price: 0,
    stock: 0,
    sales: 0,
    status: 1,
    image: '',
    description: ''
  }
  modalVisible.value = true
}

const handleEdit = (row: any) => {
  modalTitle.value = '编辑商品'
  form.value = { ...row }
  modalVisible.value = true
}

const handleDelete = async (row: any) => {
  // 这里可以添加自定义删除逻辑
  console.log('删除商品:', row)
}

const submitForm = async () => {
  if (!form.value.name) {
    ElMessage.warning('请输入商品名称')
    return
  }
  if (!form.value.category) {
    ElMessage.warning('请选择分类')
    return
  }

  // 这里应该调用后端接口
  // await request.post('/api/products', form.value)

  // 模拟提交
  await new Promise((resolve) => setTimeout(resolve, 600))

  ElMessage.success(modalTitle.value === '新增商品' ? '新增成功' : '更新成功')
  modalVisible.value = false
  await tableRef.value?.refresh()
}

const refresh = async () => {
  await tableRef.value?.refresh()
}

// 批量导出
const handleBatchExport = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要导出的商品')
    return
  }

  try {
    const ids = selectedRows.value.map((row) => row.id)
    // await request.download('/api/products/batch-export', { ids })

    // 模拟导出
    await new Promise((resolve) => setTimeout(resolve, 800))
    ElMessage.success(`成功导出 ${selectedRows.value.length} 条记录`)
  } catch (error) {
    console.error('Export error:', error)
    ElMessage.error('导出失败')
  }
}

// 批量上架
const handleBatchUpdate = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请先选择要上架的商品')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要上架选中的 ${selectedRows.value.length} 个商品吗？`, '提示', {
      type: 'warning'
    })

    const ids = selectedRows.value.map((row) => row.id)
    // await request.put('/api/products/batch-update', { ids, status: 1 })

    // 模拟更新
    await new Promise((resolve) => setTimeout(resolve, 800))
    ElMessage.success(`成功上架 ${selectedRows.value.length} 个商品`)
    await tableRef.value?.refresh()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Batch update error:', error)
      ElMessage.error('批量上架失败')
    }
  }
}

// 查看详情
const handleViewDetail = async (row: any) => {
  ElMessageBox.alert(
    `
    <div style="text-align: left;">
      <p><strong>商品名称：</strong>${row.name || '--'}</p>
      <p><strong>商品编码：</strong>${row.code || '--'}</p>
      <p><strong>分类：</strong>${row.category || '--'}</p>
      <p><strong>品牌：</strong>${row.brand || '--'}</p>
      <p><strong>价格：</strong>¥${row.price || '0.00'}</p>
      <p><strong>库存：</strong>${row.stock || 0}</p>
      <p><strong>销量：</strong>${row.sales || 0}</p>
      <p><strong>状态：</strong>${getStatusText(row.status)}</p>
      <p><strong>描述：</strong>${row.description || '--'}</p>
    </div>
    `,
    '商品详情',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '确定'
    }
  )
}

// 更新库存
const handleUpdateStock = async (row: any) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入新的库存数量', '更新库存', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^\d+$/,
      inputErrorMessage: '请输入有效的数字'
    })

    const stock = Number(value)
    // await request.put('/api/products/stock', { id: row.id, stock })

    // 模拟更新
    await new Promise((resolve) => setTimeout(resolve, 600))
    ElMessage.success('库存更新成功')
    await tableRef.value?.refresh()
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('Update stock error:', error)
      ElMessage.error('库存更新失败')
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
:deep(.vxe-table .vxe-header--column),
:deep(.el-image) {
  cursor: pointer;
}

:deep(.el-button:disabled),
:deep(.el-input__inner:disabled),
:deep(.el-select.is-disabled) {
  cursor: not-allowed;
}
</style>



