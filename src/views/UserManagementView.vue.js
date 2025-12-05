import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
const columns = [
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
        searchOptions: [
            { label: '技术部', value: 'tech' },
            { label: '产品部', value: 'product' },
            { label: '运营部', value: 'operation' }
        ],
        formatter: ({ cellValue }) => {
            const map = {
                tech: '技术部',
                product: '产品部',
                operation: '运营部'
            };
            return map[cellValue] || cellValue || '--';
        }
    },
    {
        field: 'createTime',
        title: '创建时间',
        align: 'center',
        formatter: ({ cellValue }) => cellValue || '--'
    }
];
const tableRef = ref();
const modalVisible = ref(false);
const modalTitle = ref('新增用户');
const form = ref({
    name: '',
    email: '',
    department: 'tech'
});
const selectedRows = ref([]);
// 监听表格选择变化
const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
};
const handleCreate = () => {
    modalTitle.value = '新增用户';
    form.value = { name: '', email: '', department: 'tech' };
    modalVisible.value = true;
};
const submitForm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    modalVisible.value = false;
};
const refresh = async () => {
    await tableRef.value?.refresh();
};
// 导出模板
const handleExportTemplate = async () => {
    try {
        // 创建模板数据
        const templateData = [
            ['姓名', '邮箱', '部门', '状态'],
            ['示例用户', 'example@example.com', 'tech', '1']
        ];
        // 转换为 CSV 格式（简单实现，实际项目中可以用 xlsx 库）
        const csvContent = templateData.map((row) => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `用户导入模板_${new Date().getTime()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        ElMessage.success('模板导出成功');
    }
    catch (error) {
        console.error('Export template error:', error);
        ElMessage.error('模板导出失败');
    }
};
// 导入用户信息
const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.xlsx,.xls';
    input.onchange = async (e) => {
        const target = e.target;
        const file = target.files?.[0];
        if (!file)
            return;
        try {
            // 这里应该调用后端接口上传文件
            // const formData = new FormData()
            // formData.append('file', file)
            // await request.post('/api/users/import', formData, {
            //   headers: { 'Content-Type': 'multipart/form-data' }
            // })
            // 模拟上传
            await new Promise((resolve) => setTimeout(resolve, 1000));
            ElMessage.success('用户信息导入成功');
            await tableRef.value?.refresh();
        }
        catch (error) {
            console.error('Import error:', error);
            ElMessage.error('用户信息导入失败');
        }
    };
    input.click();
};
// 批量更新
const handleBatchUpdate = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先选择要更新的用户');
        return;
    }
    try {
        const { value } = await ElMessageBox.prompt('请输入要更新的状态（1-启用，0-禁用）', '批量更新', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[01]$/,
            inputErrorMessage: '请输入 0 或 1'
        });
        const status = Number(value);
        const ids = selectedRows.value.map((row) => row.id);
        // 这里应该调用后端接口进行批量更新
        // await request.put('/api/users/batch-update', { ids, status })
        // 模拟更新
        await new Promise((resolve) => setTimeout(resolve, 800));
        ElMessage.success(`成功更新 ${selectedRows.value.length} 条记录`);
        // 不清空选中状态，保持按钮可用，用户可以继续操作
        // 如果需要清除选中，可以调用: tableRef.value?.clearSelection()
        await tableRef.value?.refresh();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('Batch update error:', error);
            ElMessage.error('批量更新失败');
        }
    }
};
// 确认操作
const handleConfirm = async (row) => {
    try {
        const userName = row.name || '该用户';
        await ElMessageBox.confirm(`确定要确认用户 "${userName}" 吗？`, '提示', {
            type: 'warning'
        });
        // 这里应该调用后端接口进行确认
        // await request.post('/api/users/confirm', { id: row.id })
        // 模拟确认
        await new Promise((resolve) => setTimeout(resolve, 600));
        ElMessage.success('确认成功');
        await tableRef.value?.refresh();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('Confirm error:', error);
            ElMessage.error('确认失败');
        }
    }
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['el-pagination']} */ ;
/** @type {__VLS_StyleScopedClasses['vxe-table']} */ ;
/** @type {__VLS_StyleScopedClasses['vxe-table']} */ ;
/** @type {__VLS_StyleScopedClasses['el-button']} */ ;
/** @type {__VLS_StyleScopedClasses['el-input__inner']} */ ;
/** @type {__VLS_StyleScopedClasses['el-select']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "page-card" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({
    ...{ style: {} },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ style: {} },
});
const __VLS_0 = {}.ElSpace;
/** @type {[typeof __VLS_components.ElSpace, typeof __VLS_components.elSpace, typeof __VLS_components.ElSpace, typeof __VLS_components.elSpace, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.BasicButton;
/** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_6 = __VLS_5({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
let __VLS_8;
let __VLS_9;
let __VLS_10;
const __VLS_11 = {
    onClick: (__VLS_ctx.handleCreate)
};
__VLS_7.slots.default;
var __VLS_7;
const __VLS_12 = {}.BasicButton;
/** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    type: "success",
    onClick: (__VLS_ctx.refresh),
}));
const __VLS_14 = __VLS_13({
    type: "success",
    onClick: (__VLS_ctx.refresh),
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
var __VLS_15;
var __VLS_3;
const __VLS_16 = {}.BasicTable;
/** @type {[typeof __VLS_components.BasicTable, typeof __VLS_components.BasicTable, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    ...{ 'onSelectionChange': {} },
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    queryUrl: "/api/users",
    deleteUrl: "/api/users",
    height: (520),
    showExport: (false),
    showCreate: (false),
    enableColumnCustomize: (true),
    columnCustomizeKey: "user-management",
    searchFormCols: (3),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onSelectionChange': {} },
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    queryUrl: "/api/users",
    deleteUrl: "/api/users",
    height: (520),
    showExport: (false),
    showCreate: (false),
    enableColumnCustomize: (true),
    columnCustomizeKey: "user-management",
    searchFormCols: (3),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
/** @type {typeof __VLS_ctx.tableRef} */ ;
var __VLS_24 = {};
__VLS_19.slots.default;
{
    const { toolbar: __VLS_thisSlot } = __VLS_19.slots;
    const __VLS_26 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_27 = __VLS_asFunctionalComponent(__VLS_26, new __VLS_26({
        type: "info",
        onClick: (__VLS_ctx.handleExportTemplate),
    }));
    const __VLS_28 = __VLS_27({
        type: "info",
        onClick: (__VLS_ctx.handleExportTemplate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_27));
    __VLS_29.slots.default;
    var __VLS_29;
    const __VLS_30 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_31 = __VLS_asFunctionalComponent(__VLS_30, new __VLS_30({
        type: "warning",
        onClick: (__VLS_ctx.handleImport),
    }));
    const __VLS_32 = __VLS_31({
        type: "warning",
        onClick: (__VLS_ctx.handleImport),
    }, ...__VLS_functionalComponentArgsRest(__VLS_31));
    __VLS_33.slots.default;
    var __VLS_33;
    const __VLS_34 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_35 = __VLS_asFunctionalComponent(__VLS_34, new __VLS_34({
        type: "success",
        disabled: (__VLS_ctx.selectedRows.length === 0),
        onClick: (__VLS_ctx.handleBatchUpdate),
    }));
    const __VLS_36 = __VLS_35({
        type: "success",
        disabled: (__VLS_ctx.selectedRows.length === 0),
        onClick: (__VLS_ctx.handleBatchUpdate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_35));
    __VLS_37.slots.default;
    var __VLS_37;
}
{
    const { status: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_38 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_39 = __VLS_asFunctionalComponent(__VLS_38, new __VLS_38({
        type: (row.status === 1 ? 'success' : 'danger'),
        size: "small",
    }));
    const __VLS_40 = __VLS_39({
        type: (row.status === 1 ? 'success' : 'danger'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_39));
    __VLS_41.slots.default;
    (row.status === 1 ? '启用' : '禁用');
    var __VLS_41;
}
{
    const { action: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_42 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_43 = __VLS_asFunctionalComponent(__VLS_42, new __VLS_42({
        type: "success",
        link: true,
        size: "small",
        onClick: (() => __VLS_ctx.handleConfirm(row)),
    }));
    const __VLS_44 = __VLS_43({
        type: "success",
        link: true,
        size: "small",
        onClick: (() => __VLS_ctx.handleConfirm(row)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_43));
    __VLS_45.slots.default;
    var __VLS_45;
}
var __VLS_19;
const __VLS_46 = {}.BasicModal;
/** @type {[typeof __VLS_components.BasicModal, typeof __VLS_components.BasicModal, ]} */ ;
// @ts-ignore
const __VLS_47 = __VLS_asFunctionalComponent(__VLS_46, new __VLS_46({
    modelValue: (__VLS_ctx.modalVisible),
    title: (__VLS_ctx.modalTitle),
    width: "520px",
}));
const __VLS_48 = __VLS_47({
    modelValue: (__VLS_ctx.modalVisible),
    title: (__VLS_ctx.modalTitle),
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_47));
__VLS_49.slots.default;
const __VLS_50 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_51 = __VLS_asFunctionalComponent(__VLS_50, new __VLS_50({
    model: (__VLS_ctx.form),
    labelWidth: "80px",
}));
const __VLS_52 = __VLS_51({
    model: (__VLS_ctx.form),
    labelWidth: "80px",
}, ...__VLS_functionalComponentArgsRest(__VLS_51));
__VLS_53.slots.default;
const __VLS_54 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_55 = __VLS_asFunctionalComponent(__VLS_54, new __VLS_54({
    gutter: (20),
}));
const __VLS_56 = __VLS_55({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_55));
__VLS_57.slots.default;
const __VLS_58 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_59 = __VLS_asFunctionalComponent(__VLS_58, new __VLS_58({
    span: (24),
}));
const __VLS_60 = __VLS_59({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_59));
__VLS_61.slots.default;
const __VLS_62 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_63 = __VLS_asFunctionalComponent(__VLS_62, new __VLS_62({
    label: "姓名",
}));
const __VLS_64 = __VLS_63({
    label: "姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_63));
__VLS_65.slots.default;
const __VLS_66 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_67 = __VLS_asFunctionalComponent(__VLS_66, new __VLS_66({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入姓名",
}));
const __VLS_68 = __VLS_67({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入姓名",
}, ...__VLS_functionalComponentArgsRest(__VLS_67));
var __VLS_65;
var __VLS_61;
const __VLS_70 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_71 = __VLS_asFunctionalComponent(__VLS_70, new __VLS_70({
    span: (24),
}));
const __VLS_72 = __VLS_71({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_71));
__VLS_73.slots.default;
const __VLS_74 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_75 = __VLS_asFunctionalComponent(__VLS_74, new __VLS_74({
    label: "邮箱",
}));
const __VLS_76 = __VLS_75({
    label: "邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_75));
__VLS_77.slots.default;
const __VLS_78 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_79 = __VLS_asFunctionalComponent(__VLS_78, new __VLS_78({
    modelValue: (__VLS_ctx.form.email),
    placeholder: "请输入邮箱",
}));
const __VLS_80 = __VLS_79({
    modelValue: (__VLS_ctx.form.email),
    placeholder: "请输入邮箱",
}, ...__VLS_functionalComponentArgsRest(__VLS_79));
var __VLS_77;
var __VLS_73;
const __VLS_82 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_83 = __VLS_asFunctionalComponent(__VLS_82, new __VLS_82({
    span: (24),
}));
const __VLS_84 = __VLS_83({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_83));
__VLS_85.slots.default;
const __VLS_86 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_87 = __VLS_asFunctionalComponent(__VLS_86, new __VLS_86({
    label: "部门",
}));
const __VLS_88 = __VLS_87({
    label: "部门",
}, ...__VLS_functionalComponentArgsRest(__VLS_87));
__VLS_89.slots.default;
const __VLS_90 = {}.BasicSelect;
/** @type {[typeof __VLS_components.BasicSelect, ]} */ ;
// @ts-ignore
const __VLS_91 = __VLS_asFunctionalComponent(__VLS_90, new __VLS_90({
    modelValue: (__VLS_ctx.form.department),
    listUrl: "/api/departments",
    valueKey: "id",
    labelKey: "name",
}));
const __VLS_92 = __VLS_91({
    modelValue: (__VLS_ctx.form.department),
    listUrl: "/api/departments",
    valueKey: "id",
    labelKey: "name",
}, ...__VLS_functionalComponentArgsRest(__VLS_91));
var __VLS_89;
var __VLS_85;
const __VLS_94 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_95 = __VLS_asFunctionalComponent(__VLS_94, new __VLS_94({
    span: (24),
}));
const __VLS_96 = __VLS_95({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_95));
__VLS_97.slots.default;
const __VLS_98 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_99 = __VLS_asFunctionalComponent(__VLS_98, new __VLS_98({}));
const __VLS_100 = __VLS_99({}, ...__VLS_functionalComponentArgsRest(__VLS_99));
__VLS_101.slots.default;
const __VLS_102 = {}.BasicButton;
/** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
// @ts-ignore
const __VLS_103 = __VLS_asFunctionalComponent(__VLS_102, new __VLS_102({
    type: "primary",
    onClick: (__VLS_ctx.submitForm),
}));
const __VLS_104 = __VLS_103({
    type: "primary",
    onClick: (__VLS_ctx.submitForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_103));
__VLS_105.slots.default;
var __VLS_105;
var __VLS_101;
var __VLS_97;
var __VLS_57;
var __VLS_53;
var __VLS_49;
/** @type {__VLS_StyleScopedClasses['page-card']} */ ;
// @ts-ignore
var __VLS_25 = __VLS_24;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            columns: columns,
            tableRef: tableRef,
            modalVisible: modalVisible,
            modalTitle: modalTitle,
            form: form,
            selectedRows: selectedRows,
            handleSelectionChange: handleSelectionChange,
            handleCreate: handleCreate,
            submitForm: submitForm,
            refresh: refresh,
            handleExportTemplate: handleExportTemplate,
            handleImport: handleImport,
            handleBatchUpdate: handleBatchUpdate,
            handleConfirm: handleConfirm,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
