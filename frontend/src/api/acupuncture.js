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

export const acupunctureApi = {
  // 获取所有针灸记录
  getAll() {
    console.log('调用 getAll')
    return handleResponse(api.get('/acupuncture'))
  },

  // 获取单个针灸记录
  getById(id) {
    console.log('调用 getById:', id)
    return handleResponse(api.get(`/acupuncture/${id}`))
  },

  // 获取指定小鼠的针灸记录
  getByMouseId(mouseId) {
    console.log('调用 getByMouseId:', mouseId)
    return handleResponse(api.get(`/acupuncture/mouse/${mouseId}`))
      .then(data => {
        console.log('获取到的针刺记录原始数据:', data)
        // 确保数值字段的类型正确
        return data.map(record => ({
          ...record,
          maintenance_concentration: record.maintenance_concentration === null ? null : Number(record.maintenance_concentration),
          activity_score: record.activity_score === null ? null : Number(record.activity_score)
        }))
      })
  },

  // 创建针灸记录
  create(data) {
    console.log('调用 create，原始数据:', data)
    // 确保日期格式正确
    const formattedData = {
      mouse_id: data.mouse_id,
      intervention_date: data.intervention_date ? new Date(data.intervention_date).toISOString().split('T')[0] : null,
      maintenance_concentration: data.maintenance_concentration === '/' ? null : Number(data.maintenance_concentration || 0),
      activity_score: Number(data.activity_score || 0),
      general_condition: data.general_condition || '良好',
      recovery_quality: data.recovery_quality || '良好',
      operator: data.operator || '操作员',
      special_condition: data.special_condition || null
    }
    console.log('格式化后的数据:', formattedData)
    return handleResponse(api.post('/acupuncture', formattedData))
  },

  // 更新针灸记录
  update(id, data) {
    console.log('调用 update:', id, data)
    const formattedData = {
      temperature: Number(data.temperature || 0),
      humidity: Number(data.humidity || 0),
      anesthesia_concentration: Number(data.anesthesia_concentration || 0)
    }
    console.log('格式化后的数据:', formattedData)
    return handleResponse(api.put(`/acupuncture/${id}`, formattedData))
  },

  // 删除针灸记录
  delete(id) {
    console.log('调用 delete:', id)
    return handleResponse(api.delete(`/acupuncture/${id}`))
  }
}

export default acupunctureApi