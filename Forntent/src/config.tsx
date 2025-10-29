import axios from "axios";

const backend_url = "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: `${backend_url}/api`, // change to your backend URL
    withCredentials: true, // needed if backend uses cookies for auth
});
api.defaults.withCredentials = true;

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access");
    if (token) {
        // console.log(token)
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})
export { backend_url };
export default api;