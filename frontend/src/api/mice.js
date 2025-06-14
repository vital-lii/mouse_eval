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

export const miceApi = {
  // 获取所有小鼠
  getAll() {
    return handleResponse(api.get('/mice'));
  },

  // 添加新小鼠
  create(data) {
    return handleResponse(api.post('/mice', data));
  },

  // 获取单个小鼠
  getOne(id) {
    return handleResponse(api.get(`/mice/${id}`));
  },

  // 更新小鼠信息
  update(id, data) {
    return handleResponse(api.put(`/mice/${id}`, data));
  },

  // 删除小鼠
  delete(id) {
    return handleResponse(api.delete(`/mice/${id}`));
  }
}

export default miceApi
