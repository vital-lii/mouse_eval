<template>
  <div class="detail-container">
    <n-space vertical size="large">
      <n-page-header
        title="针刺详情"
        @back="router.back()"
      />
      
      <n-card v-if="acupunctureData" title="基本信息">
        <n-descriptions bordered>
          <n-descriptions-item label="干预ID">
            {{ acupunctureData.id }}
          </n-descriptions-item>
          <n-descriptions-item label="小鼠编号">
            <n-button text type="primary" @click="goToMouse(acupunctureData.mouse_id)">
              {{ acupunctureData.mouse_custom_id || acupunctureData.mouse_id }}
            </n-button>
          </n-descriptions-item>
          <n-descriptions-item label="干预日期">
            {{ formatDate(acupunctureData.intervention_date) }}
          </n-descriptions-item>
          <n-descriptions-item label="操作者">
            {{ acupunctureData.operator }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-grid :cols="2" :x-gap="24">
        <n-grid-item>
          <n-card title="环境参数">
            <n-descriptions bordered>
              <n-descriptions-item label="温度">
                {{ acupunctureData?.temperature ? `${acupunctureData.temperature}℃` : '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="湿度">
                {{ acupunctureData?.humidity ? `${acupunctureData.humidity}%` : '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="麻醉浓度">
                {{ acupunctureData?.anesthesia_concentration ? `${acupunctureData.anesthesia_concentration}%` : '未记录' }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="干预参数">
            <n-descriptions bordered>
              <n-descriptions-item label="针刺深度">
                {{ acupunctureData?.needle_depth ? `${acupunctureData.needle_depth}mm` : '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="针刺时长">
                {{ acupunctureData?.intervention_duration ? `${acupunctureData.intervention_duration}分钟` : '未记录' }}
              </n-descriptions-item>
              <n-descriptions-item label="刺激频率">
                {{ acupunctureData?.stimulation_frequency ? `${acupunctureData.stimulation_frequency}Hz` : '未记录' }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>
      </n-grid>

      <n-card v-if="acupunctureData?.special_condition" title="特殊情况记录">
        <div class="notes-content">
          {{ acupunctureData.special_condition }}
        </div>
      </n-card>

      <n-card title="操作指南">
        <n-space vertical>
          <div class="guide-section">
            <h3>麻醉注意事项</h3>
            <n-ul>
              <n-li>麻醉前确保小鼠状态稳定</n-li>
              <n-li>根据小鼠体重调整麻醉剂量</n-li>
              <n-li>持续监测呼吸频率和体温</n-li>
              <n-li>保持麻醉深度适中</n-li>
            </n-ul>
          </div>
          
          <div class="guide-section">
            <h3>针刺操作要点</h3>
            <n-ul>
              <n-li>严格执行无菌操作</n-li>
              <n-li>准确定位穴位</n-li>
              <n-li>控制进针速度和深度</n-li>
              <n-li>注意观察小鼠反应</n-li>
            </n-ul>
          </div>

          <div class="guide-section">
            <h3>术后观察重点</h3>
            <n-ul>
              <n-li>观察清醒情况</n-li>
              <n-li>监测体温变化</n-li>
              <n-li>关注进食饮水</n-li>
              <n-li>记录异常反应</n-li>
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
import { acupunctureApi } from '@/api/acupuncture'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const acupunctureData = ref(null)

// 加载针刺详情
const loadAcupunctureData = async () => {
  loading.value = true
  try {
    const data = await acupunctureApi.getOne(route.params.id)
    acupunctureData.value = data
  } catch (error) {
    handleError(error, '加载针刺信息')
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
  loadAcupunctureData()
})
</script>

<style scoped>
.detail-container {
  padding: 24px;
  position: relative;
  min-height: 400px;
}

.guide-section {
  padding: 12px;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0.02);
  margin-bottom: 12px;
}

.guide-section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: var(--primary-color);
}

.guide-section:last-child {
  margin-bottom: 0;
}

.notes-content {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style> 