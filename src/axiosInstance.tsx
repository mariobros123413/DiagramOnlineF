import axios from 'axios';

const api = axios.create({
  baseURL: 'https://diagramonlineb-production.up.railway.app', // URL del backend
});

export default api;
