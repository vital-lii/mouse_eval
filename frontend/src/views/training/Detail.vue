<template>
  <div class="detail-container">
    <n-space vertical size="large">
      <n-page-header
        title="训练详情"
        @back="router.back()"
      />
      
      <n-card v-if="trainingData" title="基本信息">
        <n-descriptions bordered>
          <n-descriptions-item label="训练ID">
            {{ trainingData.id }}
          </n-descriptions-item>
          <n-descriptions-item label="小鼠编号">
            <n-button text type="primary" @click="goToMouse(trainingData.mouse_id)">
              {{ trainingData.mouse_custom_id || trainingData.mouse_id }}
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item label="训练日期">
            {{ formatDate(trainingData.training_date) }}
          </n-descriptions-item>
          <n-descriptions-item label="体重">
            {{ trainingData.weight ? `${trainingData.weight}g` : '未记录' }}
          </n-descriptions-item>
          <n-descriptions-item label="进食量">
            {{ trainingData.food_intake ? `${trainingData.food_intake}g` : '未记录' }}
          </n-descriptions-item>
          <n-descriptions-item label="饮水量">
            {{ trainingData.water_intake ? `${trainingData.water_intake}ml` : '未记录' }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-grid :cols="2" :x-gap="24">
        <n-grid-item>
          <n-card title="早训练记录">
            <n-descriptions bordered>
              <n-descriptions-item label="响应时间">
                {{ trainingData?.morning_response_time || '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="进入时间">
                {{ trainingData?.morning_entry_time || '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="压力评分">
                {{ trainingData?.morning_stress_score || '未记录' }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="晚训练记录">
            <n-descriptions bordered>
              <n-descriptions-item label="响应时间">
                {{ trainingData?.afternoon_response_time || '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="进入时间">
                {{ trainingData?.afternoon_entry_time || '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="压力评分">
                {{ trainingData?.afternoon_stress_score || '未记录' }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>
      </n-grid>

      <n-card v-if="trainingData?.special_notes" title="特殊情况记录">
        <div class="notes-content">
          {{ trainingData.special_notes }}
        </div>
      </n-card>

      <n-card title="评分标准说明">
        <n-space vertical>
          <div class="score-guide">
            <h3>压力评分标准</h3>
            <n-ul>
              <n-li>0分：无明显压力表现</n-li>
              <n-li>1分：轻微压力，偶尔出现紧张行为</n-li>
              <n-li>2分：中等压力，经常出现紧张行为</n-li>
              <n-li>3分：重度压力，持续性紧张行为</n-li>
            </n-ul>
          </div>
          
          <div class="score-guide">
            <h3>时间记录说明</h3>
            <n-ul>
              <n-li>响应时间：从开始训练到小鼠首次响应的时间</n-li>
              <n-li>进入时间：从小鼠响应到完全进入训练装置的时间</n-li>
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
  NSpin, NIcon, NButton, NUl, NLi, NGrid, NGridItem, useMessage
} from 'naive-ui'
import { trainingApi } from '@/api/training'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const trainingData = ref(null)

// 加载训练详情
const loadTrainingData = async () => {
  loading.value = true
  try {
    const data = await trainingApi.getOne(route.params.id)
    trainingData.value = data
  } catch (error) {
    handleError(error, '加载训练信息')
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
  loadTrainingData()
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

.notes-content {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style> 