const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		orderItems: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				name: { type: String, required: true },
				qty: { type: Number, required: true },
				image: { type: String, required: true }, // Ảnh của màu đã chọn
				price: { type: Number, required: true },
				// Quan trọng: Lưu thuộc tính variant
				selectedColor: { type: String, required: true },
				selectedSize: { type: Number, required: true },
			},
		],
		shippingAddress: {
			fullName: { type: String, required: true }, // Người nhận
			phone: { type: String, required: true },
			address: { type: String, required: true },
		},
		paymentMethod: { type: String, enum: ["COD", "Paypal", "Banking"], required: true }, // COD, Paypal, Banking
		itemsPrice: { type: Number, required: true }, // Tiền hàng
		shippingPrice: { type: Number, required: true }, // Tiền ship
		totalPrice: { type: Number, required: true }, // Tổng thu

		// Trạng thái đơn hàng
		status: {
			type: String,
			enum: [
				"Pending",
				"Shipping",
				"Delivered",
				"Cancelled",
			],
			default: "Pending",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
