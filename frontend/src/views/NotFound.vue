<template>
  <div class="not-found">
    <n-result
      status="404"
      title="页面未找到"
      description="抱歉，您访问的页面不存在"
    >
      <template #footer>
        <n-button type="primary" @click="router.push('/')">
          返回首页
        </n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { NResult, NButton } from 'naive-ui'

const router = useRouter()
</script>

<style scoped>
.not-found {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style> 