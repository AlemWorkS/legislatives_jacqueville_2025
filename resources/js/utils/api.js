// resources/js/utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: '/', // utilise des URL relatives pour éviter SSRF
  headers: {
    'Accept': 'application/json',
  },
  withCredentials: true, // si tu utilises sanctum et cookies
});
export default api;
