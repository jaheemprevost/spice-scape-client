import axios from 'axios';

const devURL = 'http://localhost:3000/api/v1/';
const prodURL = 'https://spice-scape-server.onrender.com/api/v1/';

const instance = axios.create({
  baseURL: prodURL,
  timeout: 50000, // 20 seconds
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

instance.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
