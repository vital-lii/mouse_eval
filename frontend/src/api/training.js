import api from './config'

const handleResponse = async (promise) => {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw { error: '网络请求失败' };
  }
};

export const trainingApi = {
  // 创建训练记录
  create(data) {
    // 确保日期格式正确
    const formattedData = {
      mouse_id: data.mouse_id,
      training_date: data.training_date ? new Date(data.training_date).toISOString().split('T')[0] : null,
      weight: data.weight,
      food_intake: data.food_intake,
      water_intake: data.water_intake,
      morning_response_time: data.morning_response_time,
      morning_entry_time: data.morning_entry_time,
      morning_stress_score: data.morning_stress_score,
      afternoon_response_time: data.afternoon_response_time,
      afternoon_entry_time: data.afternoon_entry_time,
      afternoon_stress_score: data.afternoon_stress_score,
      special_notes: data.special_notes || ''
    }
    return handleResponse(api.post('/training', formattedData))
  },

  // 获取训练记录列表
  getAll() {
    return handleResponse(api.get('/training'))
  },

  // 获取指定小鼠的训练记录
  getByMouseId(mouseId) {
    return handleResponse(api.get(`/training/mouse/${mouseId}`))
  },

  // 更新训练记录
  update(id, data) {
    const formattedData = {
      weight: data.weight,
      food_intake: data.food_intake,
      water_intake: data.water_intake,
      morning_response_time: data.morning_response_time,
      morning_entry_time: data.morning_entry_time,
      morning_stress_score: data.morning_stress_score,
      afternoon_response_time: data.afternoon_response_time,
      afternoon_entry_time: data.afternoon_entry_time,
      afternoon_stress_score: data.afternoon_stress_score,
      special_notes: data.special_notes || ''
    }
    return handleResponse(api.put(`/training/${id}`, formattedData))
  },

  // 删除训练记录
  delete(id) {
    return handleResponse(api.delete(`/training/${id}`))
  },

  // 获取单个训练记录
  getById(id) {
    return handleResponse(api.get(`/training/${id}`))
  }
}

export default trainingApi