import axios from "../config/axios";

// Lấy giỏ hàng
export const apiGetMyCart = () => axios.get("/cart");

// Thêm vào giỏ
export const apiAddToCart = (data) => axios.post("/cart", data);

// Cập nhật số lượng item
export const apiUpdateCartItem = (itemId, quantity) =>
	axios.put(`/cart/item/${itemId}`, { quantity });
