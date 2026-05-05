import axios from 'axios';

export const BASE_URL = 'http://192.168.1.13:4040';

const api = axios.create({ baseURL: BASE_URL });

export const apiFetch = async (path, method = 'GET', body = null, token = null) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  try {
    const res = await api({ url: path, method, data: body, headers });
    return res.data;
  } catch (error) {
    console.log("axios : ",error)
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
};

export default api;