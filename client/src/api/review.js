import axios from "../config/axios";

// Lấy danh sách review của 1 sản phẩm
export const apiGetProductReviews = async (productId) => {
	const response = await axios.get(`/product/${productId}/reviews`);
	return response;
};

// Gửi review mới (Cần gửi kèm Token Header)
export const apiCreateReview = async (productId, data) => {
	const response = await axios.post(
		`/product/${productId}/reviews`,
		data,
	);
	return response;
};
