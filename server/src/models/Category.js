const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			unique: true,
		},
		slug: {
			type: String,
			required: true,
			lowercase: true,
		},

		image: { type: String },
		description: { type: String },

		// Quan trọng: Để xác định danh mục cha (nếu có)
		parentId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
			default: null,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
