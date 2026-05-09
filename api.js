import axios from 'axios';

export const BASE_URL = 'http://192.168.1.12:4040';
console.log(" API BASE_URL:", BASE_URL);

const api = axios.create({ baseURL: BASE_URL });

export const apiFetch = async (path, method = 'GET', body = null, token = null) => {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  console.log(` API Call: ${method} ${path}`, body ? { body } : '', token ? 'WITH TOKEN' : 'NO TOKEN');
  try {
    const res = await api({ url: path, method, data: body, headers });
    console.log(` Response ${path}:`, res.data);
    return res.data;
  } catch (error) {
    console.log(` Error ${path}:`, error.message);
    if (error.response) {
      console.log(" Error response:", error.response.data);
      return error.response.data;
    }
    throw error;
  }
};

export default api;