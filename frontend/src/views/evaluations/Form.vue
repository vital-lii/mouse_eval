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
          <n-input v-model:value="formValue.mouse_id" placeholder="请输入小鼠编号" />
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
import { ref } from 'vue'
import { NCard, NForm, NFormItem, NInput, NDatePicker, NRate, NButton, useMessage } from 'naive-ui'
import { evaluationsApi } from '@/api/evaluations'

const message = useMessage()
const formRef = ref(null)

const formValue = ref({
  mouse_id: '',
  evaluation_date: null,
  activity_level: null,
  grooming_behavior: null
})

const rules = {
  mouse_id: {
    required: true,
    message: '请输入小鼠编号',
    trigger: ['blur', 'input']
  },
  evaluation_date: {
    required: true,
    message: '请选择评分日期',
    trigger: ['blur', 'change']
  },
  activity_level: {
    required: true,
    message: '请评分活动水平',
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
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
      if (value === null || value === undefined) {
        return new Error('请评分梳理行为')
      }
      return true
    }
  }
}

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
    await formRef.value?.validate()
    await evaluationsApi.create(formValue.value)
    message.success('评分提交成功')
    // 重置表单
    formValue.value = {
      mouse_id: '',
      evaluation_date: null,
      activity_level: null,
      grooming_behavior: null
    }
  } catch (error) {
    if (error.error) {
      message.error(error.error)
    } else {
      message.error('评分提交失败')
    }
    console.error('提交失败:', error)
  }
}
</script> 