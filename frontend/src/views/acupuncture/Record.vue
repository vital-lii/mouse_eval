<template>
  <div>
    <n-card title="针刺干预记录">
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
        <n-form-item label="干预日期" path="intervention_date">
          <n-date-picker v-model:value="formValue.intervention_date" type="date" clearable />
        </n-form-item>
        <n-form-item label="环境温度(℃)" path="temperature">
          <n-input-number 
            v-model:value="formValue.temperature" 
            :min="0" 
            :precision="1"
            @update:value="validateField('temperature')"
          />
        </n-form-item>
        <n-form-item label="环境湿度(%)" path="humidity">
          <n-input-number 
            v-model:value="formValue.humidity" 
            :min="0" 
            :max="100" 
            :precision="1"
            @update:value="validateField('humidity')"
          />
        </n-form-item>
        <n-form-item label="麻醉维持浓度(%)" path="anesthesia_concentration">
          <n-input-number 
            v-model:value="formValue.anesthesia_concentration" 
            :min="0" 
            :max="100" 
            :precision="1"
            @update:value="validateField('anesthesia_concentration')"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSubmit">提交记录</n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NForm, NFormItem, NInput, NDatePicker, NInputNumber, NButton, useMessage } from 'naive-ui'
import { acupunctureApi } from '@/api/acupuncture'

const message = useMessage()
const formRef = ref(null)

const formValue = ref({
  mouse_id: '',
  intervention_date: null,
  temperature: null,
  humidity: null,
  anesthesia_concentration: null
})

const rules = {
  mouse_id: {
    required: true,
    message: '请输入小鼠编号',
    trigger: ['blur', 'input']
  },
  intervention_date: {
    required: true,
    message: '请选择干预日期',
    trigger: ['blur', 'change']
  },
  temperature: {
    required: true,
    message: '请输入环境温度',
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
        return new Error('请输入环境温度')
      }
      if (value < 0) {
        return new Error('温度不能小于0℃')
      }
      return true
    }
  },
  humidity: {
    required: true,
    message: '请输入环境湿度',
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
        return new Error('请输入环境湿度')
      }
      if (value < 0 || value > 100) {
        return new Error('湿度必须在0-100%之间')
      }
      return true
    }
  },
  anesthesia_concentration: {
    required: true,
    message: '请输入麻醉维持浓度',
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
        return new Error('请输入麻醉维持浓度')
      }
      if (value < 0 || value > 100) {
        return new Error('浓度必须在0-100%之间')
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
    const response = await acupunctureApi.create(formValue.value)
    message.success('记录提交成功')
    // 重置表单
    formValue.value = {
      mouse_id: '',
      intervention_date: null,
      temperature: null,
      humidity: null,
      anesthesia_concentration: null
    }
  } catch (error) {
    if (error.error) {
      message.error(error.error)
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error('记录提交失败')
    }
    console.error('提交失败:', error)
  }
}
</script> 