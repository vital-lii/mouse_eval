<template>
  <div class="detail-container">
    <n-space vertical size="large">
      <n-page-header
        title="小鼠详情"
        @back="router.back()"
      />
      
      <n-card v-if="mouseData" title="基本信息">
        <n-descriptions bordered>
          <n-descriptions-item label="ID">
            {{ mouseData.id }}
          </n-descriptions-item>
          <n-descriptions-item label="自定义编号">
            {{ mouseData.custom_id || '未设置' }}
          </n-descriptions-item>
          <n-descriptions-item label="组别">
            {{ mouseData.group_name }}
          </n-descriptions-item>
          <n-descriptions-item label="当前重量">
            {{ mouseData.weight ? `${mouseData.weight}g` : '未记录' }}
          </n-descriptions-item>
          <n-descriptions-item label="创建时间">
            {{ formatDateTime(mouseData.created_at) }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <n-tabs type="line" animated>
        <n-tab-pane name="training" tab="训练记录">
          <n-data-table
            :loading="loadingTraining"
            :columns="trainingColumns"
            :data="trainingRecords"
            :bordered="true"
          />
        </n-tab-pane>
        
        <n-tab-pane name="evaluation" tab="评估记录">
          <n-data-table
            :loading="loadingEvaluation"
            :columns="evaluationColumns"
            :data="evaluationRecords"
            :bordered="true"
          />
        </n-tab-pane>
        
        <n-tab-pane name="acupuncture" tab="针刺记录">
          <n-data-table
            :loading="loadingAcupuncture"
            :columns="acupunctureColumns"
            :data="acupunctureRecords"
            :bordered="true"
          />
        </n-tab-pane>
      </n-tabs>
    </n-space>

    <n-spin :show="loading" description="加载中...">
      <template #icon>
        <n-icon>
          <div class="loading-spinner"></div>
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
  NTabs, NTabPane, NDataTable, NSpin, NIcon, useMessage
} from 'naive-ui'
import { miceApi } from '@/api/mice'
import { trainingApi } from '@/api/training'
import { evaluationsApi } from '@/api/evaluations'
import { acupunctureApi } from '@/api/acupuncture'

const route = useRoute()
const router = useRouter()
const message = useMessage()

const loading = ref(false)
const loadingTraining = ref(false)
const loadingEvaluation = ref(false)
const loadingAcupuncture = ref(false)

const mouseData = ref(null)
const trainingRecords = ref([])
const evaluationRecords = ref([])
const acupunctureRecords = ref([])

// 表格列定义
const trainingColumns = [
  { title: '训练日期', key: 'training_date', width: 100 },
  { title: '体重(g)', key: 'weight', width: 80 },
  { title: '进食量(g)', key: 'food_intake', width: 80 },
  { title: '饮水量(ml)', key: 'water_intake', width: 80 },
  { 
    title: '早训练',
    children: [
      { title: '响应时间', key: 'morning_response_time', width: 90 },
      { title: '进入时间', key: 'morning_entry_time', width: 90 },
      { title: '压力评分', key: 'morning_stress_score', width: 90 }
    ]
  },
  { 
    title: '晚训练',
    children: [
      { title: '响应时间', key: 'afternoon_response_time', width: 90 },
      { title: '进入时间', key: 'afternoon_entry_time', width: 90 },
      { title: '压力评分', key: 'afternoon_stress_score', width: 90 }
    ]
  },
  { title: '备注', key: 'special_notes', ellipsis: true }
]

const evaluationColumns = [
  { title: '评估日期', key: 'evaluation_date', width: 100 },
  { title: '评估时间', key: 'evaluation_time', width: 100 },
  { title: '活动评分', key: 'activity_score', width: 80 },
  { title: '梳理评分', key: 'grooming_score', width: 80 },
  { title: '总分', key: 'total_score', width: 80 },
  { title: '评估人', key: 'evaluator', width: 100 },
  { title: '备注', key: 'notes', ellipsis: true }
]

const acupunctureColumns = [
  { 
    title: '干预日期', 
    key: 'intervention_date', 
    width: 100,
    render: (row) => formatDate(row.intervention_date)
  },
  { title: '操作者', key: 'operator', width: 100 },
  { 
    title: '麻醉维持浓度(%)', 
    key: 'maintenance_concentration', 
    width: 90,
    render: (row) => {
      console.log('渲染麻醉维持浓度:', row.maintenance_concentration)
      if (row.maintenance_concentration === null) return '/'
      return row.maintenance_concentration === 0 ? '0' : row.maintenance_concentration.toFixed(1)
    }
  },
  { 
    title: '活动评分', 
    key: 'activity_score', 
    width: 90,
    render: (row) => {
      console.log('渲染活动评分:', row.activity_score)
      if (!row.activity_score && row.activity_score !== 0) return '-'
      return `${row.activity_score}/33`
    }
  },
  { title: '一般状态', key: 'general_condition', width: 90 },
  { title: '恢复质量', key: 'recovery_quality', width: 90 },
  { title: '备注', key: 'special_condition', ellipsis: true }
]

// 加载小鼠基本信息
const loadMouseData = async () => {
  loading.value = true
  try {
    const data = await miceApi.getOne(route.params.id)
    mouseData.value = data
  } catch (error) {
    handleError(error, '加载小鼠信息')
  } finally {
    loading.value = false
  }
}

// 加载训练记录
const loadTrainingRecords = async () => {
  loadingTraining.value = true
  try {
    const data = await trainingApi.getByMouseId(route.params.id)
    trainingRecords.value = data
  } catch (error) {
    handleError(error, '加载训练记录')
  } finally {
    loadingTraining.value = false
  }
}

// 加载评估记录
const loadEvaluationRecords = async () => {
  loadingEvaluation.value = true
  try {
    const data = await evaluationsApi.getByMouseId(route.params.id)
    evaluationRecords.value = data
  } catch (error) {
    handleError(error, '加载评估记录')
  } finally {
    loadingEvaluation.value = false
  }
}

// 加载针刺记录
const loadAcupunctureRecords = async () => {
  loadingAcupuncture.value = true
  try {
    console.log('开始加载针刺记录，小鼠ID:', route.params.id)
    const data = await acupunctureApi.getByMouseId(route.params.id)
    console.log('获取到的针刺记录:', data)
    acupunctureRecords.value = data
    console.log('更新后的针刺记录状态:', acupunctureRecords.value)
  } catch (error) {
    handleError(error, '加载针刺记录')
  } finally {
    loadingAcupuncture.value = false
  }
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
const formatDateTime = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).replace(/\//g, '-')
  } catch {
    return dateString
  }
}

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

onMounted(async () => {
  await loadMouseData()
  await Promise.all([
    loadTrainingRecords(),
    loadEvaluationRecords(),
    loadAcupunctureRecords()
  ])
})
</script>

<style scoped>
.detail-container {
  padding: 24px;
  position: relative;
  min-height: 400px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2080f0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 