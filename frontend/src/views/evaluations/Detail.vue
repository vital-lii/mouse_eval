<template>
  <div class="detail-container">
    <n-space vertical size="large">
      <n-page-header
        title="评估详情"
        @back="router.back()"
      />
      
      <n-card v-if="evaluationData" title="评估信息">
        <n-descriptions bordered>
          <n-descriptions-item label="评估ID">
            {{ evaluationData.id }}
          </n-descriptions-item>
          <n-descriptions-item label="小鼠编号">
            <n-button text type="primary" @click="goToMouse(evaluationData.mouse_id)">
              {{ evaluationData.mouse_custom_id || evaluationData.mouse_id }}
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item label="评估日期">
            {{ formatDate(evaluationData.evaluation_date) }}
          </n-descriptions-item>
          <n-descriptions-item label="评估时间">
            {{ evaluationData.evaluation_time }}
          </n-descriptions-item>
          <n-descriptions-item label="评估人">
            {{ evaluationData.evaluator }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-card v-if="evaluationData" title="评分详情">
        <n-descriptions bordered>
          <n-descriptions-item label="活动评分">
            {{ evaluationData.activity_score }}
          </n-descriptions-item>
          <n-descriptions-item label="梳理评分">
            {{ evaluationData.grooming_score }}
          </n-descriptions-item>
          <n-descriptions-item label="总分">
            {{ evaluationData.total_score }}
          </n-descriptions-item>
          <n-descriptions-item label="备注" span="3">
            {{ evaluationData.notes || '无' }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-card title="评分标准说明">
        <n-space vertical>
          <div class="score-guide">
            <h3>活动评分标准</h3>
            <n-ul>
              <n-li>0分：完全无活动</n-li>
              <n-li>1分：轻微活动，主要是被动活动</n-li>
              <n-li>2分：中等活动，有主动活动但不持续</n-li>
              <n-li>3分：正常活动，持续主动活动</n-li>
            </n-ul>
          </div>
          
          <div class="score-guide">
            <h3>梳理评分标准</h3>
            <n-ul>
              <n-li>0分：完全不梳理</n-li>
              <n-li>1分：轻微梳理，频率低</n-li>
              <n-li>2分：中等梳理，频率一般</n-li>
              <n-li>3分：正常梳理，频率高</n-li>
            </n-ul>
          </div>
        </n-space>
      </n-card>
    </n-space>

    <n-spin :show="loading" description="加载中...">
      <template #icon>
        <n-icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 96v64m0 192v64m160-160h-64m-192 0H96m224-96l-48 48m-96 96l-48 48m192 0l-48-48m-96-96l-48-48"/>
          </svg>
        </n-icon>
      </template>
    </n-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { 
  NSpace, NPageHeader, NCard, NDescriptions, NDescriptionsItem,
  NSpin, NIcon, NButton, NUl, NLi, useMessage
} from 'naive-ui'
import { evaluationsApi } from '@/api/evaluations'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const evaluationData = ref(null)

// 加载评估详情
const loadEvaluationData = async () => {
  loading.value = true
  try {
    const data = await evaluationsApi.getOne(route.params.id)
    evaluationData.value = data
  } catch (error) {
    handleError(error, '加载评估信息')
  } finally {
    loading.value = false
  }
}

// 跳转到小鼠详情
const goToMouse = (mouseId) => {
  router.push(`/mice/${mouseId}`)
}

// 错误处理
const handleError = (error, action) => {
  console.error(`${action}失败:`, error)
  let msg = `${action}失败`
  if (typeof error === 'string') {
    msg = error
  } else if (error.error) {
    msg = error.error
  } else if (error.message) {
    msg = error.message
  }
  message.error(msg)
}

// 日期格式化
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-')
  } catch {
    return dateString
  }
}

onMounted(() => {
  loadEvaluationData()
})
</script>

<style scoped>
.detail-container {
  padding: 24px;
  position: relative;
  min-height: 400px;
}

.score-guide {
  padding: 12px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.02);
}

.score-guide h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--primary-color);
}
</style> 