import axios from "../config/axios";

// Đăng nhập
export const apiLogin = async (data) => {
	try {
		const res = await axios.post("/user/login", data);
		return res;
	} catch (error) {
		return { success: false, message: error?.message || "Login failed" };
	}
};

// Đăng ký
export const apiRegister = async (data) => {
	try {
		const res = await axios.post("/user/register", data);
		return res;
	} catch (error) {
		return { success: false, message: error?.message || "Register failed" };
	}
};
