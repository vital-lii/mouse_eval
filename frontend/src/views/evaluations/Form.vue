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
            @update:value="validateField('mouse_id')"
          />
        </n-form-item>
        <n-form-item label="评分日期" path="evaluation_date">
          <n-date-picker v-model:value="formValue.evaluation_date" type="date" clearable />
        </n-form-item>
        <n-form-item label="活动水平" path="activity_level">
          <n-rate v-model:value="formValue.activity_level" @update:value="validateField('activity_level')" />
        </n-form-item>
        <n-form-item label="梳理行为" path="grooming_behavior">
          <n-rate v-model:value="formValue.grooming_behavior" @update:value="validateField('grooming_behavior')" />
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

// 获取小鼠列表
const fetchMiceList = async () => {
  try {
    const mice = await miceApi.getAll()
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
  fetchMiceList()
})

// 单独验证某个字段
const validateField = async (field) => {
  try {
    await formRef.value?.validateField(field)
  } catch (error) {
    // 忽略验证错误
  }
}

const handleSubmit = async () => {
  try {
    console.log('开始表单验证...')
    console.log('当前表单数据:', formValue.value)
    
    // 手动验证所有字段
    const errors = []
    for (const field of Object.keys(rules)) {
      try {
        await formRef.value?.validateField(field)
      } catch (error) {
        errors.push(error)
        console.error(`${field} 验证失败:`, error)
      }
    }

    if (errors.length > 0) {
      console.error('表单验证失败:', errors)
      throw new Error('请完整填写所有必填项')
    }

    console.log('表单验证通过')
    
    // 确保日期格式正确
    const payload = {
      mouse_id: formValue.value.mouse_id,
      evaluation_date: formValue.value.evaluation_date,
      activity_level: Number(formValue.value.activity_level || 0),
      grooming_behavior: Number(formValue.value.grooming_behavior || 0)
    }

    console.log('准备提交的数据:', payload)
    const result = await evaluationsApi.create(payload)
    console.log('提交成功，响应:', result)
    
    message.success('评分提交成功')
    // 重置表单
    formValue.value = {
      mouse_id: null,
      evaluation_date: null,
      activity_level: null,
      grooming_behavior: null
    }
  } catch (error) {
    console.error('提交失败，完整错误信息:', error)
    console.error('错误类型:', typeof error)
    console.error('错误堆栈:', error.stack)
    
    if (error.error) {
      console.error('API错误:', error.error)
      message.error(error.error)
    } else if (error.response?.data?.message) {
      console.error('服务器响应错误:', error.response.data.message)
      message.error(error.response.data.message)
    } else if (error.message) {
      console.error('验证错误:', error.message)
      message.error(error.message)
    } else {
      message.error('评分提交失败，请检查输入并重试')
    }
  }
}
</script> 