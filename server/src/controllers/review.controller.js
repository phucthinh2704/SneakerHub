const Review = require("../models/Review");
const Product = require("../models/Product");

// --- TẠO REVIEW ---
const createReview = async (req, res) => {
	const { rating, comment, reviewImages } = req.body;
	const productId = req.params.id; // Lấy ID sản phẩm từ URL

	try {
		const product = await Product.findById(productId);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Sản phẩm không tồn tại" });

		// Kiểm tra xem user đã review sản phẩm này chưa
		const alreadyReviewed = await Review.findOne({
			user: req.user._id,
			product: productId,
		});

		if (alreadyReviewed) {
			return res
				.status(400)
				.json({
					success: false,
					message: "Bạn đã đánh giá sản phẩm này rồi",
				});
		}

		// 1. Tạo Review
		const review = await Review.create({
			user: req.user._id,
			product: productId,
			rating: Number(rating),
			comment,
			reviewImages,
		});

		// 2. Tính toán lại Rating trung bình cho Product
		// Công thức: ((Rating cũ * số lượng cũ) + Rating mới) / (Số lượng cũ + 1)
		const totalReviews = product.numReviews + 1;
		const newRating =
			(product.rating * product.numReviews + Number(rating)) /
			totalReviews;

		product.rating = newRating;
		product.numReviews = totalReviews;

		await product.save();

		res.status(201).json({
			success: true,
			message: "Đánh giá thành công",
			result: review,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- LẤY REVIEW CỦA SẢN PHẨM ---
const getProductReviews = async (req, res) => {
	try {
		const reviews = await Review.find({
			product: req.params.id,
			isApproved: true,
		})
			.populate("user", "name") // Lấy tên người review
			.sort({ createdAt: -1 });

		res.json({ success: true, result: reviews });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { createReview, getProductReviews };
