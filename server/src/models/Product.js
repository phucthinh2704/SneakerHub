const mongoose = require("mongoose");

// Schema con: Quản lý chi tiết từng màu (Variant)
const productVariantSchema = new mongoose.Schema({
	color: { type: String, required: true }, // Ví dụ: "Red", "Black/White"
	hexCode: { type: String }, // Mã màu hiển thị (VD: #FF0000)
	images: [{ type: String, required: true }], // Mảng URL ảnh riêng cho màu này
	// Quan trọng: Mỗi màu sẽ có kho size riêng
	sizes: [
		{
			size: { type: Number, required: true }, // Size 39, 40, 41
			quantity: { type: Number, required: true, default: 0 }, // Tồn kho của size này màu này
		},
	],
	price: { type: Number }, // (Tùy chọn) Nếu màu hiếm giá đắt hơn thì điền, không thì lấy giá gốc
	sku: { type: String }, // Mã quản lý kho (VD: NIKE-AIR-RED-40)
});

const productSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		name: { type: String, required: true },
		brand: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Brand",
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Category",
		},
		description: { type: String, required: true },

		// Giá niêm yết chung (Base Price)
		price: { type: Number, required: true, default: 0 },
		// Giá khuyến mãi (nếu có)
		discountPrice: { type: Number, default: 0 },

		// Mảng các biến thể (Màu sắc)
		variants: [productVariantSchema],

		// Tổng hợp thông tin rating (được tính toán từ bảng Reviews)
		rating: { type: Number, required: true, default: 0 },
		numReviews: { type: Number, required: true, default: 0 },

		// Slug để làm đường dẫn đẹp (VD: giay-nike-air-force-1)
		slug: { type: String, required: true, unique: true },

		isPublished: { type: Boolean, default: true }, // Ẩn/Hiện sản phẩm
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
