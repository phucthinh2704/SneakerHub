import axios from "../config/axios";

// Lấy thông tin Profile
export const apiGetUserProfile = () => axios.get("/user/profile");

// Cập nhật thông tin Profile (trả về token mới)
export const apiUpdateUserProfile = (data) => axios.put("/user/profile", data);

// Lấy lịch sử mua hàng (Gọi qua route Order)
export const apiGetMyOrders = () => axios.get("/order/myorders");