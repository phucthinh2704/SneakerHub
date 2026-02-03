import axios from "../config/axios";

// Lấy danh sách sản phẩm (có lọc)
export const apiGetProducts = (params) => {
	try {
		const res = axios.get("/product", { params });
		return res;
	} catch (error) {
		return {
			success: false,
			message: error?.message || "Get products failed",
		};
	}
};

// Lấy chi tiết sản phẩm theo slug
export const apiGetProductDetail = (slug) => {
	try {
		const res = axios.get(`/product/details/${slug}`);
		return res;
	} catch (error) {
		return {
			success: false,
			message: error?.message || "Get product detail failed",
		};
	}
};

// Lấy danh mục
export const apiGetCategories = () => {
	try {
		const res = axios.get("/category");
		return res;
	} catch (error) {
		return {
			success: false,
			message: error?.message || "Get categories failed",
		};
	}
};
