const express = require("express");
const router = express.Router();
const {
	getMyCart,
	addToCart,
	updateCartItem,
} = require("../controllers/cart.controller");
const { protect } = require("../middleware/authMiddleware");

router
	.route("/")
	.get(protect, getMyCart) // Xem giỏ
	.post(protect, addToCart); // Thêm vào giỏ

router.route("/item/:itemId").put(protect, updateCartItem); // Sửa số lượng item
// Quan trọng: :itemId ở đây là _id của item trong mảng cartItems (được sinh ra sau khi thêm vào giỏ), KHÔNG PHẢI là productId.
module.exports = router;
