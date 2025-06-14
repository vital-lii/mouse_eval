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

export const evaluationsApi = {
  // 获取所有评估记录
  getAll() {
    console.log('调用 getAll')
    return handleResponse(api.get('/evaluations'))
  },

  // 获取单个评估记录
  getById(id) {
    console.log('调用 getById:', id)
    return handleResponse(api.get(`/evaluations/${id}`))
  },

  // 获取指定小鼠的评估记录
  getByMouseId(mouseId) {
    console.log('调用 getByMouseId:', mouseId)
    return handleResponse(api.get(`/evaluations/mouse/${mouseId}`))
  },

  // 创建评估记录
  create(data) {
    console.log('调用 create，数据:', data)
    // 确保日期格式正确
    const formattedData = {
      mouse_id: data.mouse_id,
      evaluation_date: data.evaluation_date ? new Date(data.evaluation_date).toISOString().split('T')[0] : null,
      activity_score: Number(data.activity_level || 0),
      grooming_score: Number(data.grooming_behavior || 0)
    }
    console.log('格式化后的数据:', formattedData)
    return handleResponse(api.post('/evaluations', formattedData))
  },

  // 更新评估记录
  update(id, data) {
    console.log('调用 update:', id, data)
    const formattedData = {
      activity_score: Number(data.activity_level || 0),
      grooming_score: Number(data.grooming_behavior || 0)
    }
    return handleResponse(api.put(`/evaluations/${id}`, formattedData))
  },

  // 删除评估记录
  delete(id) {
    console.log('调用 delete:', id)
    return handleResponse(api.delete(`/evaluations/${id}`))
  }
}

export default evaluationsApi
