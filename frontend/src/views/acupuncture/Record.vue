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
          <n-select 
            v-model:value="formValue.mouse_id" 
            :options="miceOptions"
            placeholder="请选择小鼠"
            @update:value="validateField('mouse_id')"
          />
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
import { ref, onMounted } from 'vue'
import { NCard, NForm, NFormItem, NInput, NDatePicker, NInputNumber, NButton, useMessage, NSelect } from 'naive-ui'
import { acupunctureApi } from '@/api/acupuncture'
import { miceApi } from '@/api/mice'

const message = useMessage()
const formRef = ref(null)
const miceOptions = ref([])

const formValue = ref({
  mouse_id: null,
  intervention_date: null,
  temperature: 0,
  humidity: 0,
  anesthesia_concentration: 0
})

const rules = {
  mouse_id: {
    required: true,
    message: '请选择小鼠',
    trigger: ['blur', 'change']
  },
  intervention_date: {
    required: true,
    message: '请选择干预日期',
    trigger: ['blur', 'change'],
    validator: (rule, value) => {
      if (!value) {
        return new Error('请选择干预日期')
      }
      const selectedDate = new Date(value)
      const today = new Date()
      if (selectedDate > today) {
        return new Error('干预日期不能超过今天')
      }
      return true
    }
  },
  temperature: {
    required: true,
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
        formValue.value.temperature = 0
      }
      if (value < 0) {
        return new Error('温度不能小于0℃')
      }
      return true
    }
  },
  humidity: {
    required: true,
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
        formValue.value.humidity = 0
      }
      if (value < 0 || value > 100) {
        return new Error('湿度必须在0-100%之间')
      }
      return true
    }
  },
  anesthesia_concentration: {
    required: true,
    trigger: ['change'],
    validator: (rule, value) => {
      if (value === null || value === undefined) {
        formValue.value.anesthesia_concentration = 0
      }
      if (value < 0 || value > 100) {
        return new Error('浓度必须在0-100%之间')
      }
      return true
    }
  }
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
    submitting.value = true
    
    const payload = {
      mouse_id: formValue.value.mouse_id,
      intervention_date: formValue.value.intervention_date,
      temperature: Number(formValue.value.temperature || 0),
      humidity: Number(formValue.value.humidity || 0),
      anesthesia_concentration: Number(formValue.value.anesthesia_concentration || 0)
    }

    console.log('准备提交的数据:', payload)
    await acupunctureApi.create(payload)
    message.success('记录提交成功')
    
    // 重置表单
    formValue.value = {
      mouse_id: null,
      intervention_date: null,
      temperature: 0,
      humidity: 0,
      anesthesia_concentration: 0
    }
    
    // 重置表单验证状态
    formRef.value?.restoreValidation()
  } catch (error) {
    console.error('提交失败:', error)
    if (error.error) {
      message.error(error.error)
    } else if (error.response?.data?.message) {
      message.error(error.response.data.message)
    } else {
      message.error(error.message || '提交失败，请稍后重试')
    }
  } finally {
    submitting.value = false
  }
}

// 取消操作
const handleCancel = () => {
  formRef.value?.restoreValidation()
  formValue.value = {
    mouse_id: null,
    intervention_date: null,
    temperature: 0,
    humidity: 0,
    anesthesia_concentration: 0
  }
}
</script> 