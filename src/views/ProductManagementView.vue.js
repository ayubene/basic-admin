import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
// 商品状态映射
const getStatusText = (status) => {
    const map = {
        0: '下架',
        1: '上架',
        2: '缺货'
    };
    return map[status] || '未知';
};
const getStatusType = (status) => {
    const map = {
        0: 'danger',
        1: 'success',
        2: 'warning'
    };
    return map[status] || 'info';
};
// 列定义 - 完整展示所有功能
const columns = [
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
];
const tableRef = ref();
const modalVisible = ref(false);
const modalTitle = ref('新增商品');
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
});
const selectedRows = ref([]);
// 监听表格选择变化
const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
};
const handleCreate = () => {
    modalTitle.value = '新增商品';
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
    };
    modalVisible.value = true;
};
const handleEdit = (row) => {
    modalTitle.value = '编辑商品';
    form.value = { ...row };
    modalVisible.value = true;
};
const handleDelete = async (row) => {
    // 这里可以添加自定义删除逻辑
    console.log('删除商品:', row);
};
const submitForm = async () => {
    if (!form.value.name) {
        ElMessage.warning('请输入商品名称');
        return;
    }
    if (!form.value.category) {
        ElMessage.warning('请选择分类');
        return;
    }
    // 这里应该调用后端接口
    // await request.post('/api/products', form.value)
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 600));
    ElMessage.success(modalTitle.value === '新增商品' ? '新增成功' : '更新成功');
    modalVisible.value = false;
    await tableRef.value?.refresh();
};
const refresh = async () => {
    await tableRef.value?.refresh();
};
// 批量导出
const handleBatchExport = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先选择要导出的商品');
        return;
    }
    try {
        const ids = selectedRows.value.map((row) => row.id);
        // await request.download('/api/products/batch-export', { ids })
        // 模拟导出
        await new Promise((resolve) => setTimeout(resolve, 800));
        ElMessage.success(`成功导出 ${selectedRows.value.length} 条记录`);
    }
    catch (error) {
        console.error('Export error:', error);
        ElMessage.error('导出失败');
    }
};
// 批量上架
const handleBatchUpdate = async () => {
    if (selectedRows.value.length === 0) {
        ElMessage.warning('请先选择要上架的商品');
        return;
    }
    try {
        await ElMessageBox.confirm(`确定要上架选中的 ${selectedRows.value.length} 个商品吗？`, '提示', {
            type: 'warning'
        });
        const ids = selectedRows.value.map((row) => row.id);
        // await request.put('/api/products/batch-update', { ids, status: 1 })
        // 模拟更新
        await new Promise((resolve) => setTimeout(resolve, 800));
        ElMessage.success(`成功上架 ${selectedRows.value.length} 个商品`);
        await tableRef.value?.refresh();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('Batch update error:', error);
            ElMessage.error('批量上架失败');
        }
    }
};
// 查看详情
const handleViewDetail = async (row) => {
    ElMessageBox.alert(`
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
    `, '商品详情', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定'
    });
};
// 更新库存
const handleUpdateStock = async (row) => {
    try {
        const { value } = await ElMessageBox.prompt('请输入新的库存数量', '更新库存', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^\d+$/,
            inputErrorMessage: '请输入有效的数字'
        });
        const stock = Number(value);
        // await request.put('/api/products/stock', { id: row.id, stock })
        // 模拟更新
        await new Promise((resolve) => setTimeout(resolve, 600));
        ElMessage.success('库存更新成功');
        await tableRef.value?.refresh();
    }
    catch (error) {
        if (error !== 'cancel') {
            console.error('Update stock error:', error);
            ElMessage.error('库存更新失败');
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
    ...{ 'onCreate': {} },
    ...{ 'onEdit': {} },
    ...{ 'onDelete': {} },
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    queryUrl: "/api/products",
    deleteUrl: "/api/products",
    exportUrl: "/api/products/export",
    height: (600),
    pageSize: (20),
    showExport: (true),
    showCreate: (true),
    showDelete: (true),
    enableColumnCustomize: (true),
    columnCustomizeKey: "product-management",
    searchFormCols: (3),
    enableVirtualScroll: (true),
    resizable: (true),
}));
const __VLS_18 = __VLS_17({
    ...{ 'onSelectionChange': {} },
    ...{ 'onCreate': {} },
    ...{ 'onEdit': {} },
    ...{ 'onDelete': {} },
    ref: "tableRef",
    columns: (__VLS_ctx.columns),
    queryUrl: "/api/products",
    deleteUrl: "/api/products",
    exportUrl: "/api/products/export",
    height: (600),
    pageSize: (20),
    showExport: (true),
    showCreate: (true),
    showDelete: (true),
    enableColumnCustomize: (true),
    columnCustomizeKey: "product-management",
    searchFormCols: (3),
    enableVirtualScroll: (true),
    resizable: (true),
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
let __VLS_20;
let __VLS_21;
let __VLS_22;
const __VLS_23 = {
    onSelectionChange: (__VLS_ctx.handleSelectionChange)
};
const __VLS_24 = {
    onCreate: (__VLS_ctx.handleCreate)
};
const __VLS_25 = {
    onEdit: (__VLS_ctx.handleEdit)
};
const __VLS_26 = {
    onDelete: (__VLS_ctx.handleDelete)
};
/** @type {typeof __VLS_ctx.tableRef} */ ;
var __VLS_27 = {};
__VLS_19.slots.default;
{
    const { toolbar: __VLS_thisSlot } = __VLS_19.slots;
    const __VLS_29 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
        type: "info",
        onClick: (__VLS_ctx.handleBatchExport),
    }));
    const __VLS_31 = __VLS_30({
        type: "info",
        onClick: (__VLS_ctx.handleBatchExport),
    }, ...__VLS_functionalComponentArgsRest(__VLS_30));
    __VLS_32.slots.default;
    var __VLS_32;
    const __VLS_33 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        type: "warning",
        onClick: (__VLS_ctx.handleBatchUpdate),
    }));
    const __VLS_35 = __VLS_34({
        type: "warning",
        onClick: (__VLS_ctx.handleBatchUpdate),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    var __VLS_36;
}
{
    const { image: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    if (row.image) {
        const __VLS_37 = {}.ElImage;
        /** @type {[typeof __VLS_components.ElImage, typeof __VLS_components.elImage, ]} */ ;
        // @ts-ignore
        const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
            src: (row.image),
            previewSrcList: ([row.image]),
            previewTeleported: true,
            ...{ style: {} },
            fit: "cover",
        }));
        const __VLS_39 = __VLS_38({
            src: (row.image),
            previewSrcList: ([row.image]),
            previewTeleported: true,
            ...{ style: {} },
            fit: "cover",
        }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ style: {} },
        });
    }
}
{
    const { status: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_41 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
        type: (__VLS_ctx.getStatusType(row.status)),
        size: "small",
    }));
    const __VLS_43 = __VLS_42({
        type: (__VLS_ctx.getStatusType(row.status)),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_42));
    __VLS_44.slots.default;
    (__VLS_ctx.getStatusText(row.status));
    var __VLS_44;
}
{
    const { category: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_45 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
        type: "info",
        size: "small",
    }));
    const __VLS_47 = __VLS_46({
        type: "info",
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_46));
    __VLS_48.slots.default;
    (row.category || '--');
    var __VLS_48;
}
{
    const { price: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ style: {} },
    });
    (row.price || '0.00');
}
{
    const { stock: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_49 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
        type: (row.stock < 10 ? 'danger' : row.stock < 50 ? 'warning' : 'success'),
        size: "small",
    }));
    const __VLS_51 = __VLS_50({
        type: (row.stock < 10 ? 'danger' : row.stock < 50 ? 'warning' : 'success'),
        size: "small",
    }, ...__VLS_functionalComponentArgsRest(__VLS_50));
    __VLS_52.slots.default;
    (row.stock || 0);
    var __VLS_52;
}
{
    const { action: __VLS_thisSlot } = __VLS_19.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_53 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
        type: "success",
        link: true,
        size: "small",
        onClick: (() => __VLS_ctx.handleViewDetail(row)),
    }));
    const __VLS_55 = __VLS_54({
        type: "success",
        link: true,
        size: "small",
        onClick: (() => __VLS_ctx.handleViewDetail(row)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_54));
    __VLS_56.slots.default;
    var __VLS_56;
    const __VLS_57 = {}.BasicButton;
    /** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
    // @ts-ignore
    const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
        type: "warning",
        link: true,
        size: "small",
        onClick: (() => __VLS_ctx.handleUpdateStock(row)),
    }));
    const __VLS_59 = __VLS_58({
        type: "warning",
        link: true,
        size: "small",
        onClick: (() => __VLS_ctx.handleUpdateStock(row)),
    }, ...__VLS_functionalComponentArgsRest(__VLS_58));
    __VLS_60.slots.default;
    var __VLS_60;
}
var __VLS_19;
const __VLS_61 = {}.BasicModal;
/** @type {[typeof __VLS_components.BasicModal, typeof __VLS_components.BasicModal, ]} */ ;
// @ts-ignore
const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
    modelValue: (__VLS_ctx.modalVisible),
    title: (__VLS_ctx.modalTitle),
    width: "800px",
}));
const __VLS_63 = __VLS_62({
    modelValue: (__VLS_ctx.modalVisible),
    title: (__VLS_ctx.modalTitle),
    width: "800px",
}, ...__VLS_functionalComponentArgsRest(__VLS_62));
__VLS_64.slots.default;
const __VLS_65 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}));
const __VLS_67 = __VLS_66({
    model: (__VLS_ctx.form),
    labelWidth: "100px",
}, ...__VLS_functionalComponentArgsRest(__VLS_66));
__VLS_68.slots.default;
const __VLS_69 = {}.ElRow;
/** @type {[typeof __VLS_components.ElRow, typeof __VLS_components.elRow, typeof __VLS_components.ElRow, typeof __VLS_components.elRow, ]} */ ;
// @ts-ignore
const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
    gutter: (20),
}));
const __VLS_71 = __VLS_70({
    gutter: (20),
}, ...__VLS_functionalComponentArgsRest(__VLS_70));
__VLS_72.slots.default;
const __VLS_73 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
    span: (12),
}));
const __VLS_75 = __VLS_74({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_74));
__VLS_76.slots.default;
const __VLS_77 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_78 = __VLS_asFunctionalComponent(__VLS_77, new __VLS_77({
    label: "商品名称",
    required: true,
}));
const __VLS_79 = __VLS_78({
    label: "商品名称",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_78));
__VLS_80.slots.default;
const __VLS_81 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入商品名称",
}));
const __VLS_83 = __VLS_82({
    modelValue: (__VLS_ctx.form.name),
    placeholder: "请输入商品名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_82));
var __VLS_80;
var __VLS_76;
const __VLS_85 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
    span: (12),
}));
const __VLS_87 = __VLS_86({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_86));
__VLS_88.slots.default;
const __VLS_89 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
    label: "商品编码",
}));
const __VLS_91 = __VLS_90({
    label: "商品编码",
}, ...__VLS_functionalComponentArgsRest(__VLS_90));
__VLS_92.slots.default;
const __VLS_93 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "请输入商品编码",
}));
const __VLS_95 = __VLS_94({
    modelValue: (__VLS_ctx.form.code),
    placeholder: "请输入商品编码",
}, ...__VLS_functionalComponentArgsRest(__VLS_94));
var __VLS_92;
var __VLS_88;
const __VLS_97 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
    span: (12),
}));
const __VLS_99 = __VLS_98({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_98));
__VLS_100.slots.default;
const __VLS_101 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
    label: "分类",
    required: true,
}));
const __VLS_103 = __VLS_102({
    label: "分类",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_102));
__VLS_104.slots.default;
const __VLS_105 = {}.BasicSelect;
/** @type {[typeof __VLS_components.BasicSelect, ]} */ ;
// @ts-ignore
const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
    modelValue: (__VLS_ctx.form.category),
    listUrl: "/api/categories",
    valueKey: "name",
    labelKey: "name",
    placeholder: "请选择分类",
}));
const __VLS_107 = __VLS_106({
    modelValue: (__VLS_ctx.form.category),
    listUrl: "/api/categories",
    valueKey: "name",
    labelKey: "name",
    placeholder: "请选择分类",
}, ...__VLS_functionalComponentArgsRest(__VLS_106));
var __VLS_104;
var __VLS_100;
const __VLS_109 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
    span: (12),
}));
const __VLS_111 = __VLS_110({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_110));
__VLS_112.slots.default;
const __VLS_113 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
    label: "品牌",
}));
const __VLS_115 = __VLS_114({
    label: "品牌",
}, ...__VLS_functionalComponentArgsRest(__VLS_114));
__VLS_116.slots.default;
const __VLS_117 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
    modelValue: (__VLS_ctx.form.brand),
    placeholder: "请输入品牌",
}));
const __VLS_119 = __VLS_118({
    modelValue: (__VLS_ctx.form.brand),
    placeholder: "请输入品牌",
}, ...__VLS_functionalComponentArgsRest(__VLS_118));
var __VLS_116;
var __VLS_112;
const __VLS_121 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
    span: (12),
}));
const __VLS_123 = __VLS_122({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_122));
__VLS_124.slots.default;
const __VLS_125 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
    label: "价格",
    required: true,
}));
const __VLS_127 = __VLS_126({
    label: "价格",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_126));
__VLS_128.slots.default;
const __VLS_129 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
    modelValue: (__VLS_ctx.form.price),
    precision: (2),
    min: (0),
    max: (999999),
    ...{ style: {} },
    placeholder: "请输入价格",
}));
const __VLS_131 = __VLS_130({
    modelValue: (__VLS_ctx.form.price),
    precision: (2),
    min: (0),
    max: (999999),
    ...{ style: {} },
    placeholder: "请输入价格",
}, ...__VLS_functionalComponentArgsRest(__VLS_130));
var __VLS_128;
var __VLS_124;
const __VLS_133 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
    span: (12),
}));
const __VLS_135 = __VLS_134({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_134));
__VLS_136.slots.default;
const __VLS_137 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
    label: "库存",
    required: true,
}));
const __VLS_139 = __VLS_138({
    label: "库存",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_138));
__VLS_140.slots.default;
const __VLS_141 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
    modelValue: (__VLS_ctx.form.stock),
    min: (0),
    max: (999999),
    ...{ style: {} },
    placeholder: "请输入库存",
}));
const __VLS_143 = __VLS_142({
    modelValue: (__VLS_ctx.form.stock),
    min: (0),
    max: (999999),
    ...{ style: {} },
    placeholder: "请输入库存",
}, ...__VLS_functionalComponentArgsRest(__VLS_142));
var __VLS_140;
var __VLS_136;
const __VLS_145 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
    span: (12),
}));
const __VLS_147 = __VLS_146({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_146));
__VLS_148.slots.default;
const __VLS_149 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
    label: "状态",
    required: true,
}));
const __VLS_151 = __VLS_150({
    label: "状态",
    required: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_150));
__VLS_152.slots.default;
const __VLS_153 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}));
const __VLS_155 = __VLS_154({
    modelValue: (__VLS_ctx.form.status),
    placeholder: "请选择状态",
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_154));
__VLS_156.slots.default;
const __VLS_157 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_158 = __VLS_asFunctionalComponent(__VLS_157, new __VLS_157({
    label: "上架",
    value: (1),
}));
const __VLS_159 = __VLS_158({
    label: "上架",
    value: (1),
}, ...__VLS_functionalComponentArgsRest(__VLS_158));
const __VLS_161 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
    label: "下架",
    value: (0),
}));
const __VLS_163 = __VLS_162({
    label: "下架",
    value: (0),
}, ...__VLS_functionalComponentArgsRest(__VLS_162));
const __VLS_165 = {}.ElOption;
/** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
// @ts-ignore
const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
    label: "缺货",
    value: (2),
}));
const __VLS_167 = __VLS_166({
    label: "缺货",
    value: (2),
}, ...__VLS_functionalComponentArgsRest(__VLS_166));
var __VLS_156;
var __VLS_152;
var __VLS_148;
const __VLS_169 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
    span: (12),
}));
const __VLS_171 = __VLS_170({
    span: (12),
}, ...__VLS_functionalComponentArgsRest(__VLS_170));
__VLS_172.slots.default;
const __VLS_173 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
    label: "销量",
}));
const __VLS_175 = __VLS_174({
    label: "销量",
}, ...__VLS_functionalComponentArgsRest(__VLS_174));
__VLS_176.slots.default;
const __VLS_177 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
    modelValue: (__VLS_ctx.form.sales),
    min: (0),
    ...{ style: {} },
    placeholder: "请输入销量",
}));
const __VLS_179 = __VLS_178({
    modelValue: (__VLS_ctx.form.sales),
    min: (0),
    ...{ style: {} },
    placeholder: "请输入销量",
}, ...__VLS_functionalComponentArgsRest(__VLS_178));
var __VLS_176;
var __VLS_172;
const __VLS_181 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
    span: (24),
}));
const __VLS_183 = __VLS_182({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_182));
__VLS_184.slots.default;
const __VLS_185 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
    label: "商品图片",
}));
const __VLS_187 = __VLS_186({
    label: "商品图片",
}, ...__VLS_functionalComponentArgsRest(__VLS_186));
__VLS_188.slots.default;
const __VLS_189 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
    modelValue: (__VLS_ctx.form.image),
    placeholder: "请输入图片URL",
}));
const __VLS_191 = __VLS_190({
    modelValue: (__VLS_ctx.form.image),
    placeholder: "请输入图片URL",
}, ...__VLS_functionalComponentArgsRest(__VLS_190));
var __VLS_188;
var __VLS_184;
const __VLS_193 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
    span: (24),
}));
const __VLS_195 = __VLS_194({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_194));
__VLS_196.slots.default;
const __VLS_197 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
    label: "商品描述",
}));
const __VLS_199 = __VLS_198({
    label: "商品描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_198));
__VLS_200.slots.default;
const __VLS_201 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入商品描述",
}));
const __VLS_203 = __VLS_202({
    modelValue: (__VLS_ctx.form.description),
    type: "textarea",
    rows: (4),
    placeholder: "请输入商品描述",
}, ...__VLS_functionalComponentArgsRest(__VLS_202));
var __VLS_200;
var __VLS_196;
const __VLS_205 = {}.ElCol;
/** @type {[typeof __VLS_components.ElCol, typeof __VLS_components.elCol, typeof __VLS_components.ElCol, typeof __VLS_components.elCol, ]} */ ;
// @ts-ignore
const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
    span: (24),
}));
const __VLS_207 = __VLS_206({
    span: (24),
}, ...__VLS_functionalComponentArgsRest(__VLS_206));
__VLS_208.slots.default;
const __VLS_209 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({}));
const __VLS_211 = __VLS_210({}, ...__VLS_functionalComponentArgsRest(__VLS_210));
__VLS_212.slots.default;
const __VLS_213 = {}.BasicButton;
/** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
// @ts-ignore
const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
    type: "primary",
    onClick: (__VLS_ctx.submitForm),
}));
const __VLS_215 = __VLS_214({
    type: "primary",
    onClick: (__VLS_ctx.submitForm),
}, ...__VLS_functionalComponentArgsRest(__VLS_214));
__VLS_216.slots.default;
var __VLS_216;
const __VLS_217 = {}.BasicButton;
/** @type {[typeof __VLS_components.BasicButton, typeof __VLS_components.BasicButton, ]} */ ;
// @ts-ignore
const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
    ...{ 'onClick': {} },
    ...{ style: {} },
}));
const __VLS_219 = __VLS_218({
    ...{ 'onClick': {} },
    ...{ style: {} },
}, ...__VLS_functionalComponentArgsRest(__VLS_218));
let __VLS_221;
let __VLS_222;
let __VLS_223;
const __VLS_224 = {
    onClick: (...[$event]) => {
        __VLS_ctx.modalVisible = false;
    }
};
__VLS_220.slots.default;
var __VLS_220;
var __VLS_212;
var __VLS_208;
var __VLS_72;
var __VLS_68;
var __VLS_64;
/** @type {__VLS_StyleScopedClasses['page-card']} */ ;
// @ts-ignore
var __VLS_28 = __VLS_27;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            getStatusText: getStatusText,
            getStatusType: getStatusType,
            columns: columns,
            tableRef: tableRef,
            modalVisible: modalVisible,
            modalTitle: modalTitle,
            form: form,
            handleSelectionChange: handleSelectionChange,
            handleCreate: handleCreate,
            handleEdit: handleEdit,
            handleDelete: handleDelete,
            submitForm: submitForm,
            refresh: refresh,
            handleBatchExport: handleBatchExport,
            handleBatchUpdate: handleBatchUpdate,
            handleViewDetail: handleViewDetail,
            handleUpdateStock: handleUpdateStock,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
