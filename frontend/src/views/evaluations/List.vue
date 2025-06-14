<template>
  <div>
    <n-card title="评估记录">
      <template #header-extra>
        <n-button type="primary" @click="router.push('/evaluations/new')">添加评分</n-button>
      </template>
      <n-data-table 
        :columns="columns" 
        :data="tableData" 
        :loading="loading"
        :bordered="true"
      />
    </n-card>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  NCard, NButton, NDataTable, NRate,
  useMessage
} from 'naive-ui'
import { evaluationsApi } from '@/api/evaluations'

const router = useRouter()
const message = useMessage()
const loading = ref(false)
const tableData = ref([])

const columns = [
  { 
    title: 'ID', 
    key: 'id',
    width: 80,
    align: 'center'
  },
  { 
    title: '小鼠编号', 
    key: 'mouse_id',
    render: (row) => h('a', {
      href: 'javascript:void(0)',
      onClick: () => router.push(`/mice/${row.mouse_id}`)
    }, row.mouse_custom_id || row.mouse_id)
  },
  { 
    title: '评估日期', 
    key: 'evaluation_date',
    render: (row) => formatDate(row.evaluation_date)
  },
  {
    title: '活动水平',
    key: 'activity_score',
    render(row) {
      return h(NRate, {
        value: row.activity_score,
        readonly: true,
        count: 3
      })
    }
  },
  {
    title: '梳理行为',
    key: 'grooming_score',
    render(row) {
      return h(NRate, {
        value: row.grooming_score,
        readonly: true,
        count: 3
      })
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    fixed: 'right',
    render: (row) => h('div', { class: 'action-buttons' }, [
      h(NButton, { 
        type: 'info', 
        size: 'small',
        onClick: () => router.push(`/evaluations/${row.id}`),
        class: 'mr-2'
      }, { default: () => '详情' }),
      h(NButton, { 
        type: 'error', 
        size: 'small',
        onClick: () => handleDelete(row.id)
      }, { default: () => '删除' })
    ])
  }
]

// 获取评估记录列表
const fetchEvaluationList = async () => {
  loading.value = true
  try {
    const data = await evaluationsApi.getAll()
    tableData.value = data
  } catch (error) {
    if (error.error) {
      message.error(error.error)
    } else {
      message.error('获取列表失败')
    }
    console.error('获取列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 删除记录
const handleDelete = async (id) => {
  try {
    await evaluationsApi.delete(id)
    message.success('删除成功')
    await fetchEvaluationList()
  } catch (error) {
    message.error('删除失败')
    console.error('删除失败:', error)
  }
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
  fetchEvaluationList()
})
</script> 