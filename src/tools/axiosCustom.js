import axios from 'axios';

const url = import.meta.env.VITE_API_URL;
const port = import.meta.env.VITE_API_PORT;
const protocol = import.meta.env.VITE_API_PROTOCOL;
const baseURL = `${protocol}://${url}${port ? port : ''}/api`;
const axiosCustom = axios.create({
  baseURL,
  withCredentials: true
});

axiosCustom.interceptors.response.use(
  (res) => res, // Return the response if no error occurred
  (error) => {
    if (error.response && error.response.status === 401) {
      window.location.href = '/login?expired=1';
    }
    return Promise.reject(error); // Reject the promise with the error
  }
);

export default axiosCustom;
