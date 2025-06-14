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

export const acupunctureApi = {
  // 获取所有针灸记录
  getAll() {
    return handleResponse(api.get('/acupuncture'))
  },

  // 获取单个针灸记录
  getById(id) {
    return handleResponse(api.get(`/acupuncture/${id}`))
  },

  // 获取指定小鼠的针灸记录
  getByMouseId(mouseId) {
    return handleResponse(api.get(`/acupuncture/mouse/${mouseId}`))
  },

  // 创建针灸记录
  create(data) {
    // 确保日期格式正确
    const formattedData = {
      mouse_id: data.mouse_id,
      intervention_date: data.intervention_date ? new Date(data.intervention_date).toISOString().split('T')[0] : null,
      temperature: data.temperature,
      humidity: data.humidity,
      anesthesia_concentration: data.anesthesia_concentration
    }
    return handleResponse(api.post('/acupuncture', formattedData))
  },

  // 更新针灸记录
  update(id, data) {
    return handleResponse(api.put(`/acupuncture/${id}`, data))
  },

  // 删除针灸记录
  delete(id) {
    return handleResponse(api.delete(`/acupuncture/${id}`))
  }
}

export default acupunctureApi