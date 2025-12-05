<template>
  <div class="page-card" style="max-width: 640px">
    <h2>系统设置</h2>
    <el-form label-width="100px" :model="form">
      <el-form-item label="主题">
        <el-select v-model="form.theme" placeholder="请选择主题">
          <el-option label="浅色" value="light" />
          <el-option label="深色" value="dark" />
        </el-select>
      </el-form-item>
      <el-form-item label="通知方式">
        <el-checkbox-group v-model="form.notifications">
          <el-checkbox label="邮件" />
          <el-checkbox label="短信" />
          <el-checkbox label="站内信" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="数据导出">
        <BasicButton type="success" :on-click="handleExport">导出数据</BasicButton>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const form = ref({
  theme: 'light',
  notifications: ['邮件']
})

const handleExport = async () => {
  await new Promise((resolve) => setTimeout(resolve, 500))
}
</script>
