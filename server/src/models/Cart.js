const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		cartItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				name: { type: String }, // Lưu tên để hiển thị nhanh đỡ query lại
				image: { type: String }, // Lưu ảnh đại diện của màu đã chọn
				color: { type: String, required: true }, // Màu khách chọn
				size: { type: Number, required: true }, // Size khách chọn
				quantity: { type: Number, required: true, default: 1 },
				price: { type: Number, required: true }, // Giá tại thời điểm thêm
			},
		],
		totalPrice: { type: Number, default: 0 }, // Tổng tiền tạm tính
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
