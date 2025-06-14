<template>
  <div>
    <n-card title="响片训练记录">
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
        <n-form-item label="训练日期" path="training_date">
          <n-date-picker 
            v-model:value="formValue.training_date" 
            type="date" 
            clearable
            @update:value="validateField('training_date')"
          />
        </n-form-item>
        <n-form-item label="体重(g)" path="weight">
          <n-input-number 
            v-model:value="formValue.weight" 
            :min="0" 
            :max="100"
            :precision="1"
            placeholder="请输入体重"
            @update:value="validateField('weight')"
          />
        </n-form-item>
        <n-form-item label="进食量(g)" path="food_intake">
          <n-input-number 
            v-model:value="formValue.food_intake" 
            :min="0" 
            :max="50"
            :precision="1"
            placeholder="请输入进食量"
            @update:value="validateField('food_intake')"
          />
        </n-form-item>
        <n-form-item label="饮水量(ml)" path="water_intake">
          <n-input-number 
            v-model:value="formValue.water_intake" 
            :min="0" 
            :max="50"
            :precision="1"
            placeholder="请输入饮水量"
            @update:value="validateField('water_intake')"
          />
        </n-form-item>
        <n-form-item>
          <n-space>
            <n-button @click="handleCancel">取消</n-button>
            <n-button 
              type="primary" 
              @click="handleSubmit"
              :loading="submitting"
            >
              提交记录
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { 
  NCard, NForm, NFormItem, NInput, NDatePicker, 
  NInputNumber, NButton, NSpace, useMessage, NSelect 
} from 'naive-ui'
import { trainingApi } from '@/api/training'
import { miceApi } from '@/api/mice'

const message = useMessage()
const formRef = ref(null)
const submitting = ref(false)
const miceOptions = ref([])

const formValue = ref({
  mouse_id: null,
  training_date: null,
  weight: null,
  food_intake: null,
  water_intake: null
})

const rules = {
  mouse_id: {
    required: true,
    trigger: ['blur', 'input', 'change'],
    validator(rule, value) {
      if (!value?.trim()) {
        return new Error('请输入小鼠编号')
      }
      if (value.trim().length > 50) {
        return new Error('编号长度不能超过50个字符')
      }
      return true
    }
  },
  training_date: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (!value) {
        return new Error('请选择训练日期')
      }
      const selectedDate = new Date(value)
      const today = new Date()
      if (selectedDate > today) {
        return new Error('训练日期不能超过今天')
      }
      return true
    }
  },
  weight: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (value === null || value === undefined) {
        return new Error('请输入体重')
      }
      if (value < 0) {
        return new Error('体重不能小于0')
      }
      if (value > 100) {
        return new Error('体重不能超过100g')
      }
      return true
    }
  },
  food_intake: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (value === null || value === undefined) {
        return new Error('请输入进食量')
      }
      if (value < 0) {
        return new Error('进食量不能小于0')
      }
      if (value > 50) {
        return new Error('进食量不能超过50g')
      }
      return true
    }
  },
  water_intake: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (value === null || value === undefined) {
        return new Error('请输入饮水量')
      }
      if (value < 0) {
        return new Error('饮水量不能小于0')
      }
      if (value > 50) {
        return new Error('饮水量不能超过50ml')
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
    await formRef.value?.validate()
    submitting.value = true
    
    const payload = {
      mouse_id: formValue.value.mouse_id.trim(),
      training_date: formValue.value.training_date,
      weight: Number(formValue.value.weight),
      food_intake: Number(formValue.value.food_intake),
      water_intake: Number(formValue.value.water_intake)
    }

    await trainingApi.create(payload)
    message.success('记录提交成功')
    handleCancel()
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        message.error('小鼠编号不存在，请先添加小鼠')
      } else if (error.response.status === 400) {
        message.error(error.response.data?.message || '提交的数据格式不正确，请检查输入')
      } else {
        message.error(error.response.data?.message || '提交失败，请稍后重试')
      }
    } else if (error.error) {
      message.error(error.error)
    } else {
      message.error('提交失败，请检查网络连接')
    }
    console.error('提交失败:', error)
  } finally {
    submitting.value = false
  }
}

// 取消操作
const handleCancel = () => {
  formRef.value?.restoreValidation()
  formValue.value = {
    mouse_id: null,
    training_date: null,
    weight: null,
    food_intake: null,
    water_intake: null
  }
}
</script> 