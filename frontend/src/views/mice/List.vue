<template>
  <div>
    <n-card title="小鼠管理">
      <template #header-extra>
        <n-button type="primary" @click="showModal = true">添加小鼠</n-button>
      </template>
      <n-data-table 
        :columns="columns" 
        :data="tableData" 
        :loading="loading"
        :bordered="true"
      />
    </n-card>

    <!-- 添加小鼠对话框 -->
    <n-modal v-model:show="showModal" preset="card" title="添加小鼠" style="width: 600px">
      <n-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="100px"
      >
        <n-form-item label="自定义编号" path="custom_id">
          <n-input 
            v-model:value="formData.custom_id" 
            placeholder="可选（如不填将自动生成）" 
            clearable
          />
        </n-form-item>
        <n-form-item label="组别名称" path="group_name">
          <n-input 
            v-model:value="formData.group_name" 
            placeholder="请输入组别（必填）" 
            clearable
            @update:value="validateField('group_name')"
          />
        </n-form-item>
        <n-form-item label="重量(g)" path="weight">
          <n-input-number 
            v-model:value="formData.weight" 
            placeholder="请输入重量"
            :min="0"
            :step="0.1"
            :precision="1"
            @update:value="validateField('weight')"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="handleCancel">取消</n-button>
          <n-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
          >
            提交
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, h, onMounted } from 'vue'
import { 
  NCard, NButton, NDataTable, NModal, 
  NForm, NFormItem, NInput, NInputNumber,
  NSpace, useMessage, useDialog
} from 'naive-ui'
import { miceApi } from '@/api/mice'

const message = useMessage()
const dialog = useDialog()
const showModal = ref(false)
const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])

const formData = ref({
  custom_id: '',
  group_name: '',
  weight: null
})

const rules = {
  custom_id: {
    trigger: ['blur', 'input'],
    validator(rule, value) {
      if (!value) return true // 允许为空
      if (value.length > 50) {
        return new Error('编号长度不能超过50个字符')
      }
      return true
    }
  },
  group_name: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    validator(rule, value) {
      if (!value?.trim()) {
        return new Error('组别名称不能为空')
      }
      if (value.trim().length > 50) {
        return new Error('组别名称不能超过50个字符')
      }
      return true
    }
  },
  weight: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (value === null || value === undefined) {
        return new Error('请输入重量')
      }
      if (value < 0) {
        return new Error('重量不能小于0')
      }
      if (value > 100) {
        return new Error('重量不能超过100g')
      }
      return true
    }
  }
}

const columns = [
  { 
    title: 'ID', 
    key: 'id',
    width: 80,
    align: 'center'
  },
  { 
    title: '自定义编号', 
    key: 'custom_id',
    render: (row) => row.custom_id || '未设置'
  },
  { 
    title: '组别', 
    key: 'group_name',
    ellipsis: {
      tooltip: true
    }
  },
  { 
    title: '重量(g)', 
    key: 'weight',
    render: (row) => row.weight ? `${row.weight.toFixed(1)}g` : '未记录',
    align: 'right'
  },
  { 
    title: '创建时间', 
    key: 'created_at',
    width: 180,
    render: (row) => formatDateTime(row.created_at)
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
        onClick: () => handleView(row),
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

// 单独验证某个字段
const validateField = async (field) => {
  try {
    await formRef.value?.validateField(field)
  } catch (error) {
    // 忽略验证错误
  }
}

// 获取小鼠列表
const fetchMiceList = async () => {
  loading.value = true
  try {
    const data = await miceApi.getAll()
    tableData.value = data.map(item => ({
      ...item,
      // 确保null值处理
      custom_id: item.custom_id || null,
      weight: item.weight ? Number(item.weight) : null
    }))
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

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    
    const payload = {
      custom_id: formData.value.custom_id.trim() || null,
      group_name: formData.value.group_name.trim(),
      weight: Number(formData.value.weight)
    }

    await miceApi.create(payload)
    message.success('添加成功')
    showModal.value = false
    handleCancel()
    await fetchMiceList()
  } catch (error) {
    if (error.error) {
      message.error(error.error)
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('添加失败')
    }
    console.error('添加失败:', error)
  } finally {
    submitting.value = false
  }
}

// 删除小鼠
const handleDelete = async (id) => {
  dialog.warning({
    title: '确认删除',
    content: '删除后数据无法恢复，是否继续？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await miceApi.delete(id)
        message.success('删除成功')
        await fetchMiceList()
      } catch (error) {
        if (error.error) {
          message.error(error.error)
        } else {
          message.error('删除失败')
        }
        console.error('删除失败:', error)
      }
    }
  })
}

// 查看详情
const handleView = (row) => {
  // TODO: 跳转到详情页
  message.info(`查看小鼠ID: ${row.id}`)
}

// 取消操作
const handleCancel = () => {
  showModal.value = false
  formRef.value?.restoreValidation()
  formData.value = {
    custom_id: '',
    group_name: '',
    weight: null
  }
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

onMounted(() => {
  fetchMiceList()
})
</script>

<style scoped>
.action-buttons {
  display: flex;
  justify-content: center;
}
.mr-2 {
  margin-right: 8px;
}
</style>
