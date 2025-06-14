<template>
  <div class="home-container">
    <n-space vertical size="large">
      <n-h1>小鼠评估系统</n-h1>
      
      <n-grid :cols="2" :x-gap="12" :y-gap="8">
        <n-grid-item>
          <n-card title="小鼠管理" :segmented="{ content: true }">
            <template #header-extra>
              <n-button text type="primary" @click="router.push('/mice')">
                查看详情
              </n-button>
            </template>
            <n-thing title="功能概述">
              <template #description>
                <n-space vertical>
                  <span>• 小鼠基本信息管理</span>
                  <span>• 分组管理</span>
                  <span>• 体重记录</span>
                </n-space>
              </template>
            </n-thing>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="评估记录" :segmented="{ content: true }">
            <template #header-extra>
              <n-button text type="primary" @click="router.push('/evaluations')">
                查看详情
              </n-button>
            </template>
            <n-thing title="功能概述">
              <template #description>
                <n-space vertical>
                  <span>• 行为评分</span>
                  <span>• 状态评估</span>
                  <span>• 评分历史</span>
                </n-space>
              </template>
            </n-thing>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="训练记录" :segmented="{ content: true }">
            <template #header-extra>
              <n-button text type="primary" @click="router.push('/training')">
                查看详情
              </n-button>
            </template>
            <n-thing title="功能概述">
              <template #description>
                <n-space vertical>
                  <span>• 响片训练记录</span>
                  <span>• 进食饮水记录</span>
                  <span>• 训练进度追踪</span>
                </n-space>
              </template>
            </n-thing>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="针刺记录" :segmented="{ content: true }">
            <template #header-extra>
              <n-button text type="primary" @click="router.push('/acupuncture')">
                查看详情
              </n-button>
            </template>
            <n-thing title="功能概述">
              <template #description>
                <n-space vertical>
                  <span>• 针刺干预记录</span>
                  <span>• 麻醉记录</span>
                  <span>• 环境参数记录</span>
                </n-space>
              </template>
            </n-thing>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-space>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { 
  NSpace, NH1, NGrid, NGridItem, 
  NCard, NThing, NButton 
} from 'naive-ui'

const router = useRouter()
</script>

<style scoped>
.home-container {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style> 