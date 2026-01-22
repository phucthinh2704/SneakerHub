const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
			unique: true,
		},
		logo: {
			type: String,
			required: true,
		}, // URL ảnh logo
		description: {
			type: String,
		},
		isActive: {
			type: Boolean,
			default: true,
		}, // Để ẩn thương hiệu nếu không còn kinh doanh
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
