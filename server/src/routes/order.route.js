const express = require("express");
const router = express.Router();
const {
	createOrder,
	getMyOrders,
	getOrderById,
	updateOrderStatus,
	getAllOrders,
	cancelMyOrder
} = require("../controllers/order.controller");
const { protect, admin } = require("../middleware/authMiddleware");

router.route("/").post(protect, createOrder); // Tạo đơn

router.route("/myorders").get(protect, getMyOrders); // Xem lịch sử đơn

router
	.route("/:id")
	.get(protect, getOrderById) // Xem chi tiết
	.put(protect, admin, updateOrderStatus); // Admin update trạng thái

// Admin routes
router.get("/admin/all", protect, admin, getAllOrders);

router.put("/:id/cancel", protect, cancelMyOrder);
module.exports = router;
