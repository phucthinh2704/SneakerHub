import axios from "axios";
import { store } from "../redux/store";

const instance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

// Add a request interceptor
instance.interceptors.request.use(
	function (config) {
		const state = store.getState();

		// 2. Lấy token từ slice auth
		const token = state.auth?.token;

		// 3. Gắn vào header nếu có token
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		// Do something with request error
		return Promise.reject(error);
	},
);

// Add a response interceptor
instance.interceptors.response.use(
	function (response) {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data
		return response.data;
	},
	function (error) {
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		return error.response.data;
	},
);

export default instance;
