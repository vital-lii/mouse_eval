import api from './config'

const handleResponse = async (promise) => {
  try {
    console.log('发送请求...')
    const response = await promise;
    console.log('收到响应:', response)
    return response.data;
  } catch (error) {
    console.error('请求失败:', error)
    if (error.response) {
      throw error.response.data;
    }
    throw { error: '网络请求失败' };
  }
};

export const trainingApi = {
  // 创建训练记录
  create(data) {
    console.log('调用 create，数据:', data)
    // 确保日期格式正确
    const formattedData = {
      mouse_id: data.mouse_id,
      training_date: data.training_date ? new Date(data.training_date).toISOString().split('T')[0] : null,
      weight: Number(data.weight || 0),
      food_intake: Number(data.food_intake || 0),
      water_intake: Number(data.water_intake || 0)
    }
    console.log('格式化后的数据:', formattedData)
    return handleResponse(api.post('/training', formattedData))
  },

  // 获取训练记录列表
  getAll() {
    console.log('调用 getAll')
    return handleResponse(api.get('/training'))
  },

  // 获取指定小鼠的训练记录
  getByMouseId(mouseId) {
    console.log('调用 getByMouseId:', mouseId)
    return handleResponse(api.get(`/training/mouse/${mouseId}`))
  },

  // 更新训练记录
  update(id, data) {
    console.log('调用 update:', id, data)
    const formattedData = {
      weight: Number(data.weight || 0),
      food_intake: Number(data.food_intake || 0),
      water_intake: Number(data.water_intake || 0)
    }
    console.log('格式化后的数据:', formattedData)
    return handleResponse(api.put(`/training/${id}`, formattedData))
  },

  // 删除训练记录
  delete(id) {
    console.log('调用 delete:', id)
    return handleResponse(api.delete(`/training/${id}`))
  },

  // 获取单个训练记录
  getById(id) {
    console.log('调用 getById:', id)
    return handleResponse(api.get(`/training/${id}`))
  }
}

export default trainingApi