<template>
  <div class="page-card">
    <h2>Dashboard Overview</h2>
    <el-row :gutter="20" style="margin-bottom: 24px">
      <el-col :span="8" v-for="card in stats" :key="card.title">
        <el-card shadow="hover">
          <div style="font-size: 14px; color: #909399">{{ card.title }}</div>
          <div style="font-size: 28px; font-weight: 600; margin-top: 8px">{{ card.value }}</div>
          <div style="color: #67c23a">{{ card.trend }}</div>
        </el-card>
      </el-col>
    </el-row>
    <BasicButton type="primary" :on-click="handleSync">
      同步最新数据
    </BasicButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: '今日新增用户', value: '128', trend: '+12% vs Yesterday' },
  { title: '本月活跃', value: '2,431', trend: '+4.5% MoM' },
  { title: '待办任务', value: '37', trend: '5 超时未完成' }
])

const handleSync = async () => {
  await new Promise((resolve) => setTimeout(resolve, 800))
}
</script>
