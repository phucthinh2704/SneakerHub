import axios from "../config/axios";

// Tạo đơn hàng
export const apiCreateOrder = (data) => axios.post("/order", data);

// Lấy lịch sử đơn hàng
export const apiGetMyOrders = () => axios.get("/order/myorders");

// Chi tiết đơn hàng
export const apiGetOrderDetail = (id) => axios.get(`/order/${id}`);