const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		}, // Ai đánh giá
		product: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "Product",
		}, // Đánh giá giày nào
		rating: { type: Number, required: true, min: 1, max: 5 },
		comment: { type: String, required: true },
		// (Nâng cao) Cho phép khách up ảnh feedback
		reviewImages: [{ type: String }],
		isApproved: { type: Boolean, default: true }, // Admin có thể ẩn review xấu/spam
	},
	{ timestamps: true }
);

// Đảm bảo 1 user chỉ review 1 sản phẩm 1 lần (Compound Index)
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
