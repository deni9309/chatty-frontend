import axios from 'axios';
import { useAuthStore } from '../store/use-auth.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().getToken()
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

export default api