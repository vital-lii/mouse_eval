<template>
  <div>
    <n-card title="评分记录">
      <n-form
        ref="formRef"
        :model="formValue"
        :rules="rules"
        label-placement="left"
        label-width="auto"
        require-mark-placement="right-hanging"
      >
        <n-form-item label="小鼠编号" path="mouse_id">
          <n-select 
            v-model:value="formValue.mouse_id" 
            :options="miceOptions"
            placeholder="请选择小鼠"
            @update:value="handleFieldChange('mouse_id', $event)"
          />
        </n-form-item>
        <n-form-item label="评分日期" path="evaluation_date">
          <n-date-picker 
            v-model:value="formValue.evaluation_date" 
            type="date" 
            clearable
            @update:value="handleFieldChange('evaluation_date', $event)"
          />
        </n-form-item>
        <n-form-item label="活动水平" path="activity_level">
          <n-rate 
            v-model:value="formValue.activity_level" 
            @update:value="handleFieldChange('activity_level', $event)"
          />
        </n-form-item>
        <n-form-item label="梳理行为" path="grooming_behavior">
          <n-rate 
            v-model:value="formValue.grooming_behavior" 
            @update:value="handleFieldChange('grooming_behavior', $event)"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSubmit">提交评分</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  NCard, NForm, NFormItem, NInput, NDatePicker, 
  NRate, NButton, useMessage, NSelect 
} from 'naive-ui'
import { evaluationsApi } from '@/api/evaluations'
import { miceApi } from '@/api/mice'

const message = useMessage()
const formRef = ref(null)
const miceOptions = ref([])

const formValue = ref({
  mouse_id: null,
  evaluation_date: null,
  activity_level: null,
  grooming_behavior: null
})

const rules = {
  mouse_id: {
    required: true,
    message: '请选择小鼠',
    trigger: ['blur', 'change'],
    validator: (rule, value) => {
      if (!value) {
        return new Error('请选择小鼠')
      }
      return true
    }
  },
  evaluation_date: {
    required: true,
    message: '请选择评分日期',
    trigger: ['blur', 'change'],
    validator: (rule, value) => {
      if (!value) {
        return new Error('请选择评分日期')
      }
      const selectedDate = new Date(value)
      const today = new Date()
      if (selectedDate > today) {
        return new Error('评分日期不能超过今天')
      }
      return true
    }
  },
  activity_level: {
    required: true,
    message: '请评分活动水平',
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined || value === 0) {
        return new Error('请评分活动水平')
      }
      return true
    }
  },
  grooming_behavior: {
    required: true,
    message: '请评分梳理行为',
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined || value === 0) {
        return new Error('请评分梳理行为')
      }
      return true
    }
  }
}

// 字段变化处理
const handleFieldChange = (field, value) => {
  console.log(`字段 ${field} 变化:`, value)
  formValue.value[field] = value
}

// 获取小鼠列表
const fetchMiceList = async () => {
  try {
    console.log('获取小鼠列表...')
    const mice = await miceApi.getAll()
    console.log('小鼠列表:', mice)
    miceOptions.value = mice.map(mouse => ({
      label: `${mouse.custom_id || mouse.id} (${mouse.group_name})`,
      value: mouse.id
    }))
  } catch (error) {
    console.error('获取小鼠列表失败:', error)
    message.error('获取小鼠列表失败')
  }
}

onMounted(() => {
  console.log('组件已挂载')
  fetchMiceList()
})

const handleSubmit = async (e) => {
  // 阻止默认行为
  e?.preventDefault?.()
  
  try {
    console.log('开始表单提交...')
    console.log('当前表单数据:', {
      mouse_id: formValue.value.mouse_id,
      evaluation_date: formValue.value.evaluation_date,
      activity_level: formValue.value.activity_level,
      grooming_behavior: formValue.value.grooming_behavior
    })
    
    // 检查所有字段是否已填写
    if (!formValue.value.mouse_id) {
      throw new Error('请选择小鼠')
    }
    if (!formValue.value.evaluation_date) {
      throw new Error('请选择评分日期')
    }
    if (!formValue.value.activity_level) {
      throw new Error('请评分活动水平')
    }
    if (!formValue.value.grooming_behavior) {
      throw new Error('请评分梳理行为')
    }

    console.log('字段检查通过')
    
    // 格式化日期
    const dateObj = new Date(formValue.value.evaluation_date)
    const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
    
    // 构建提交数据
    const payload = {
      mouse_id: formValue.value.mouse_id,
      evaluation_date: formattedDate,
      activity_level: Number(formValue.value.activity_level),
      grooming_behavior: Number(formValue.value.grooming_behavior)
    }

    console.log('准备提交的数据:', payload)
    
    try {
      console.log('调用 API...')
      const result = await evaluationsApi.create(payload)
      console.log('API调用成功，响应:', result)
      message.success('评分提交成功')
      
      // 重置表单
      formValue.value = {
        mouse_id: null,
        evaluation_date: null,
        activity_level: null,
        grooming_behavior: null
      }
    } catch (apiError) {
      console.error('API调用失败:', apiError)
      if (apiError.error) {
        message.error(apiError.error)
      } else if (apiError.response?.data?.message) {
        message.error(apiError.response.data.message)
      } else {
        message.error('提交失败，请稍后重试')
      }
    }
  } catch (error) {
    console.error('验证失败:', error.message)
    message.error(error.message)
  }
}
</script> 