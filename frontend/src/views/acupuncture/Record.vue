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
        <n-form-item label="麻醉维持浓度(%)" path="maintenance_concentration">
          <n-input-group>
            <n-input 
              v-model:value="formValue.maintenance_concentration" 
              placeholder="输入浓度或斜杠(/)"
              @update:value="handleMaintenanceConcentrationChange"
            />
            <n-text depth="3" style="margin-left: 8px">输入0或/表示未使用麻醉</n-text>
          </n-input-group>
        </n-form-item>

        <n-card title="针刺后行为评分" embedded>
          <n-grid :cols="2" :x-gap="12">
            <n-gi>
              <n-form-item label="1. 基础行为评分">
                <n-grid :cols="2" :x-gap="12">
                  <n-gi>
                    <n-form-item label="活动度" path="activity_scores.activity">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.activity" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="理毛行为" path="activity_scores.grooming">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.grooming" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="竖毛反应" path="activity_scores.fur">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.fur" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="排便情况" path="activity_scores.defecation">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.defecation" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="2. 操作相关评分">
                <n-grid :cols="2" :x-gap="12">
                  <n-gi>
                    <n-form-item label="逃避反应" path="activity_scores.escape">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.escape" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="发声情况" path="activity_scores.vocalization">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.vocalization" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="攻击行为" path="activity_scores.attack">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.attack" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="僵直反应" path="activity_scores.freezing">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.freezing" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item label="3. 训练相关评分">
                <n-grid :cols="2" :x-gap="12">
                  <n-gi>
                    <n-form-item label="响应时间" path="activity_scores.response_time">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.response_time" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="进食意愿" path="activity_scores.feeding">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.feeding" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                  <n-gi>
                    <n-form-item label="探索行为" path="activity_scores.exploration">
                      <n-input-number 
                        v-model:value="formValue.activity_scores.exploration" 
                        :min="0" 
                        :max="3" 
                        :precision="0"
                      />
                    </n-form-item>
                  </n-gi>
                </n-grid>
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-statistic label="总分" :value="totalScore" />
              <n-text depth="3">满分：33分</n-text>
            </n-gi>
          </n-grid>

          <n-collapse>
            <n-collapse-item title="评分标准说明" name="1">
              <n-space vertical>
                <n-text>1. 基础行为评分（0-3分）</n-text>
                <n-table :bordered="false" size="small">
                  <thead>
                    <tr>
                      <th>评分项目</th>
                      <th>0分</th>
                      <th>1分</th>
                      <th>2分</th>
                      <th>3分</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>活动度</td>
                      <td>正常活动</td>
                      <td>活动减少</td>
                      <td>显著减少</td>
                      <td>几乎不动</td>
                    </tr>
                    <tr>
                      <td>理毛行为</td>
                      <td>正常理毛</td>
                      <td>理毛减少</td>
                      <td>很少理毛</td>
                      <td>不理毛</td>
                    </tr>
                    <tr>
                      <td>竖毛反应</td>
                      <td>毛发平顺</td>
                      <td>轻微竖毛</td>
                      <td>明显竖毛</td>
                      <td>全身竖毛</td>
                    </tr>
                    <tr>
                      <td>排便情况</td>
                      <td>正常排便</td>
                      <td>轻度增加</td>
                      <td>频繁</td>
                      <td>腹泻</td>
                    </tr>
                  </tbody>
                </n-table>

                <n-text>2. 操作相关评分（0-3分）</n-text>
                <n-table :bordered="false" size="small">
                  <thead>
                    <tr>
                      <th>评分项目</th>
                      <th>0分</th>
                      <th>1分</th>
                      <th>2分</th>
                      <th>3分</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>逃避反应</td>
                      <td>无逃避</td>
                      <td>轻微逃避</td>
                      <td>明显逃避</td>
                      <td>剧烈挣扎</td>
                    </tr>
                    <tr>
                      <td>发声情况</td>
                      <td>无发声</td>
                      <td>偶尔发声</td>
                      <td>频繁发声</td>
                      <td>持续发声</td>
                    </tr>
                    <tr>
                      <td>攻击行为</td>
                      <td>无攻击</td>
                      <td>轻微防御</td>
                      <td>尝试咬人</td>
                      <td>主动攻击</td>
                    </tr>
                    <tr>
                      <td>僵直反应</td>
                      <td>无僵直</td>
                      <td>短暂僵直</td>
                      <td>间歇僵直</td>
                      <td>持续僵直</td>
                    </tr>
                  </tbody>
                </n-table>

                <n-text>3. 训练相关评分（0-3分）</n-text>
                <n-table :bordered="false" size="small">
                  <thead>
                    <tr>
                      <th>评分项目</th>
                      <th>0分</th>
                      <th>1分</th>
                      <th>2分</th>
                      <th>3分</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>响应时间</td>
                      <td>≤5秒</td>
                      <td>5-15秒</td>
                      <td>15-30秒</td>
                      <td>>30秒</td>
                    </tr>
                    <tr>
                      <td>进食意愿</td>
                      <td>主动进食</td>
                      <td>犹豫进食</td>
                      <td>勉强进食</td>
                      <td>拒绝进食</td>
                    </tr>
                    <tr>
                      <td>探索行为</td>
                      <td>主动探索</td>
                      <td>谨慎探索</td>
                      <td>很少探索</td>
                      <td>拒绝探索</td>
                    </tr>
                  </tbody>
                </n-table>
              </n-space>
            </n-collapse-item>
          </n-collapse>
        </n-card>

        <n-form-item>
          <n-button 
            type="primary" 
            @click="handleSubmit"
            :loading="submitting"
          >
            提交记录
          </n-button>
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  NCard, NForm, NFormItem, NInput, NDatePicker, NInputNumber, 
  NButton, useMessage, NSelect, NGrid, NGi, NSpace, NTable,
  NCollapse, NCollapseItem, NText, NStatistic
} from 'naive-ui'
import { acupunctureApi } from '@/api/acupuncture'
import { miceApi } from '@/api/mice'

const message = useMessage()
const formRef = ref(null)
const miceOptions = ref([])
const submitting = ref(false)

const formValue = ref({
  mouse_id: null,
  intervention_date: null,
  maintenance_concentration: '',
  activity_scores: {
    // 基础行为评分
    activity: 0,
    grooming: 0,
    fur: 0,
    defecation: 0,
    // 操作相关评分
    escape: 0,
    vocalization: 0,
    attack: 0,
    freezing: 0,
    // 训练相关评分
    response_time: 0,
    feeding: 0,
    exploration: 0
  }
})

// 计算总分
const totalScore = computed(() => {
  const scores = formValue.value.activity_scores
  return Object.values(scores).reduce((sum, score) => sum + score, 0)
})

const rules = {
  mouse_id: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
      if (!value) {
        return new Error('请选择小鼠')
      }
      return true
    }
  },
  intervention_date: {
    required: true,
    trigger: ['blur', 'change'],
    validator(rule, value) {
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
  maintenance_concentration: {
    required: true,
    trigger: ['change', 'blur'],
    validator: (rule, value) => {
      if (!value && value !== 0) {
        return new Error('请输入麻醉维持浓度或斜杠')
      }
      if (value === '/') {
        return true
      }
      const num = parseFloat(value)
      if (isNaN(num)) {
        return new Error('请输入有效的数字或斜杠')
      }
      if (num < 0 || num > 100) {
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

const handleMaintenanceConcentrationChange = (value) => {
  // 如果输入斜杠，将值设为'/'
  if (value === '/') {
    formValue.value.maintenance_concentration = '/'
    return
  }
  
  // 如果是数字字符串，尝试转换为数字
  const num = parseFloat(value)
  if (!isNaN(num)) {
    // 限制在0-100之间，保留一位小数
    formValue.value.maintenance_concentration = Math.min(100, Math.max(0, num)).toFixed(1)
  } else if (value === '') {
    formValue.value.maintenance_concentration = ''
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true
    
    const payload = {
      mouse_id: formValue.value.mouse_id,
      intervention_date: formValue.value.intervention_date,
      maintenance_concentration: formValue.value.maintenance_concentration === '/' ? null : Number(formValue.value.maintenance_concentration || 0),
      activity_score: totalScore.value
    }

    console.log('准备提交的数据:', payload)
    await acupunctureApi.create(payload)
    message.success('记录提交成功')
    
    // 重置表单
    formValue.value = {
      mouse_id: null,
      intervention_date: null,
      maintenance_concentration: '',
      activity_scores: {
        activity: 0,
        grooming: 0,
        fur: 0,
        defecation: 0,
        escape: 0,
        vocalization: 0,
        attack: 0,
        freezing: 0,
        response_time: 0,
        feeding: 0,
        exploration: 0
      }
    }
  } catch (error) {
    console.error('提交记录失败:', error)
    if (error.error) {
      message.error(error.error)
    } else if (error.message) {
      message.error(error.message)
    } else {
      message.error('提交记录失败')
    }
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.n-form {
  max-width: 800px;
  margin: 0 auto;
}

.n-collapse {
  margin-top: 16px;
}

:deep(.n-statistic) {
  margin-top: 16px;
}

:deep(.n-table) {
  margin: 8px 0;
}
</style> 