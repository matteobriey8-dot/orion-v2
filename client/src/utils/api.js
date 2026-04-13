import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Intercepteur réponse — gestion globale des erreurs
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('orion_token');
      localStorage.removeItem('orion_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
