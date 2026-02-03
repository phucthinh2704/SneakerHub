import axios from "../config/axios";

// Lấy danh sách thương hiệu
export const apiGetBrands = () => axios.get("/brand");