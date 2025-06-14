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

export const evaluationsApi = {
  // 获取所有评估记录
  getAll() {
    return handleResponse(api.get('/evaluations'))
  },

  // 获取单个评估记录
  getById(id) {
    return handleResponse(api.get(`/evaluations/${id}`))
  },

  // 获取指定小鼠的评估记录
  getByMouseId(mouseId) {
    return handleResponse(api.get(`/evaluations/mouse/${mouseId}`))
  },

  // 创建评估记录
  create(data) {
    const payload = {
      mouse_id: data.mouse_id,
      evaluation_date: data.evaluation_date,
      evaluation_time: data.evaluation_time || new Date().toLocaleTimeString(),
      operator: data.operator,
      evaluator: data.evaluator,
      activity_score: Number(data.activity_level || 0),
      grooming_score: Number(data.grooming_behavior || 0),
      fur_score: Number(data.fur_score || 0),
      defecation_score: Number(data.defecation_score || 0),
      escape_score: Number(data.escape_score || 0),
      vocalization_score: Number(data.vocalization_score || 0),
      attack_score: Number(data.attack_score || 0),
      freezing_score: Number(data.freezing_score || 0),
      response_time_score: Number(data.response_time_score || 0),
      feeding_willingness_score: Number(data.feeding_willingness_score || 0),
      exploration_score: Number(data.exploration_score || 0),
      notes: data.notes || ''
    }
    return handleResponse(api.post('/evaluations', payload))
  },

  // 更新评估记录
  update(id, data) {
    const payload = {
      activity_score: Number(data.activity_level || 0),
      grooming_score: Number(data.grooming_behavior || 0),
      fur_score: Number(data.fur_score || 0),
      defecation_score: Number(data.defecation_score || 0),
      escape_score: Number(data.escape_score || 0),
      vocalization_score: Number(data.vocalization_score || 0),
      attack_score: Number(data.attack_score || 0),
      freezing_score: Number(data.freezing_score || 0),
      response_time_score: Number(data.response_time_score || 0),
      feeding_willingness_score: Number(data.feeding_willingness_score || 0),
      exploration_score: Number(data.exploration_score || 0),
      notes: data.notes || ''
    }
    return handleResponse(api.put(`/evaluations/${id}`, payload))
  },

  // 删除评估记录
  delete(id) {
    return handleResponse(api.delete(`/evaluations/${id}`))
  }
}

export default evaluationsApi
