import axios from "../config/axios";

// --- API UPLOAD ẢNH ---
export const apiUploadImage = (formData) =>
	axios.post("/upload/single", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

export const apiUploadMultipleImages = (formData) =>
	axios.post("/upload/multiple", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

// --- CATEGORY ---
export const apiGetAllCategoriesAdmin = () => axios.get("/category");
export const apiCreateCategory = (data) => axios.post("/category", data);
export const apiUpdateCategory = (id, data) =>
	axios.put(`/category/${id}`, data);
export const apiDeleteCategory = (id) => axios.delete(`/category/${id}`);

// --- BRAND ---
export const apiGetAllBrandsAdmin = () => axios.get("/brand");
export const apiCreateBrand = (data) => axios.post("/brand", data);
export const apiUpdateBrand = (id, data) => axios.put(`/brand/${id}`, data);
export const apiDeleteBrand = (id) => axios.delete(`/brand/${id}`);

// Đơn hàng
export const apiGetAllOrdersForAdmin = () => axios.get("/order/admin/all");
export const apiUpdateOrderStatus = (orderId, status) =>
	axios.put(`/order/${orderId}`, { status });

// Sản phẩm
export const apiDeleteProduct = (productId) =>
	axios.delete(`/product/${productId}`);
export const apiCreateProduct = (data) => axios.post(`/product`, data);
export const apiUpdateProduct = (productId, data) =>
	axios.put(`/product/${productId}`, data);
export const apiGetAdminProducts = (params) =>
	axios.get("/product/admin/all", { params });

// User
export const apiGetAllUsers = (params) =>
	axios.get("/user/admin/all", { params });
export const apiDeleteUser = (id) => axios.delete(`/user/admin/${id}`);
export const apiUpdateUserRole = (id, role) =>
	axios.put(`/user/admin/${id}`, { role });
