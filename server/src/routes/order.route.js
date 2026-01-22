const express = require("express");
const router = express.Router();
const {
	createOrder,
	getMyOrders,
	getOrderById,
	updateOrderStatus,
} = require("../controllers/order.controller");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrder); // Tạo đơn

router.route("/myorders").get(protect, getMyOrders); // Xem lịch sử đơn

router
	.route("/:id")
	.get(protect, getOrderById) // Xem chi tiết
	.put(protect, admin, updateOrderStatus); // Admin update trạng thái

module.exports = router;
