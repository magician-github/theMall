import axios from 'axios';

axios.interceptors.request.use(config=>{
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
  })
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
export default axios