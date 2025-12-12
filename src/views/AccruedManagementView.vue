<template>
    <div class="page-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px">
            <div>
                <h2 style="margin: 0">应收管理</h2>
            </div>
        </div>
        <BasicTable
            ref="tableRef"
            :columns="columns"
            query-url="http://10.1.23.80:8082/shiye-retail/cw/accountPayable/list"
            export-url="http://10.1.23.80:8082/shiye-retail/cw/weightedAverageCost/export"
            deleteUrl="http://10.1.23.80:8082/shiye-retail/cw/accountPayable/delete"
            :show-export="true"
            :show-create="true"
            :show-delete="true"
            :enable-column-customize="true"
            column-customize-key="accrued-management"
            :enable-column-drag="true"
            @create="handleCreate"
            @edit="handleEdit"
        >
            <template #pushStatus="{ row }">
                <el-tag :type="getStatusType(row.pushStatus)" size="small">
                {{ row.pushStatusView || '--' }}
                </el-tag>
            </template>
        </BasicTable>

        <BasicModal v-model="modalVisible" :title="modalTitle" width="60%" @confirm="handleConfirm">
            <el-form :model="form">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="应付单号" required>
                            <el-input v-model="form.payableNumber" placeholder="请输入应付单号" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="应付金额">
                            <el-input v-model="form.estimateAmount" placeholder="请输入应付金额" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </BasicModal>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue'
    import type { TableColumn, TableInstance } from 'srit-basic-components';

    const columns: TableColumn[] = [
        {
            field: 'payableNumber',
            title: '应付单号',
            visible: true,
            searchable: false,
            sortable: false,
            filterable: false,
        },
        {
            field: 'purchaseOrderNumber',
            title: '采购单号',
            visible: true,
            searchable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'inStockNumber',
            title: '入库单号',
            visible: true,
            searchable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'purchaserDepartment',
            title: '采购部门',
            visible: true,
            searchable: true,
            searchType: 'select',
            searchSelectProps: {
                listUrl:'http://10.1.23.80:8082/shiye-retail/cw/weightedAverageCost/departmentList',
                valueKey: 'mdmCode',
                labelKey: 'name'
            },
            sortable: false,
            filterable: false,
        },
        {
            field: 'businessPartnerName',
            title: '供应商',
            visible: true,
            searchable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'billDate',
            title: '单据日期',
            visible: true,
            searchable: true,
            sortable: false,
            filterable: false,
        },
        {
            field: 'pushStatus',
            title: '推送状态',
            visible: true,
            searchable: true,
            sortable: false,
            filterable: false,
            searchType: 'select',
            searchOptions: [
                {
                    label: '已推送',
                    value: 1,
                },
                {
                    label: '未推送',
                    value: 0,
                }
            ],
            slots: { default: 'pushStatus' }
        }
    ]

    const modalVisible = ref(false)
    const modalTitle = ref('新增')
    const form = ref({
        payableNumber: '',
        estimateAmount: '',
    })

    const getStatusType = (status: number) => {
        const map: Record<number, 'success' | 'danger' | 'warning'> = {
            0: 'warning',
            1: 'success',
        }
        return map[status] || 'info'
    }

    
    const handleCreate = () => {
        modalTitle.value = '新增'
        form.value = {
            payableNumber: '',
            estimateAmount: ''
        }
        modalVisible.value = true
    }

    const handleConfirm = () => {
        modalVisible.value = false
    }

    const handleEdit = (row: any) => {
        modalTitle.value = '编辑'
        form.value = { ...row }
        modalVisible.value = true
    }
</script>
