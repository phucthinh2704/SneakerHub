const express = require("express");
const router = express.Router();
const {
	getProducts,
	getProductBySlug,
	getProductById,
	createProduct,
	updateProduct,
	deleteProduct,
	updateStock,
} = require("../controllers/product.controller");
const {
	createReview,
	getProductReviews,
} = require("../controllers/review.controller");

const { protect, admin } = require("../middleware/authMiddleware");

// --- PUBLIC ROUTES ---

// 1. Lấy danh sách sản phẩm (Lọc, Phân trang, Sort)
// GET /api/products
router.route("/").get(getProducts);

// 2. Lấy chi tiết theo Slug (Cho trang chi tiết sản phẩm)
// GET /api/products/details/:slug
router.route("/details/:slug").get(getProductBySlug);
router
	.route("/:id/reviews")
	.post(protect, createReview) // User đã đăng nhập mới được đánh giá
	.get(getProductReviews);

// --- ADMIN ROUTES (Phải có Token Admin) ---

// 3. Tạo sản phẩm mới
// POST /api/products
router.route("/").post(protect, admin, createProduct);

// 4. Lấy chi tiết (theo ID), Cập nhật, Xóa
// GET, PUT, DELETE /api/products/:id
router
	.route("/:id")
	.get(protect, admin, getProductById) // Admin lấy dữ liệu cũ để sửa
	.put(protect, admin, updateProduct)
	.delete(protect, admin, deleteProduct);

// 5. Cập nhật kho nhanh
// PATCH /api/products/stock/update
router.route("/stock/update").patch(protect, admin, updateStock);

module.exports = router;
