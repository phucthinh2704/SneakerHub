const express = require("express");
const router = express.Router();
const {
	registerUser,
	authUser,
	getUserProfile,
	updateUserProfile,
	getAllUsers,
	deleteUser,
	updateUserRole,
} = require("../controllers/user.controller");

// Import middleware bảo vệ route
const { protect, admin } = require("../middleware/authMiddleware");

// Route Đăng ký (Public)
router.post("/register", registerUser);

// Route Đăng nhập (Public)
router.post("/login", authUser);

// Route Profile (Private - Cần Token)
router
	.route("/profile")
	.get(protect, getUserProfile) // Xem thông tin
	.put(protect, updateUserProfile); // Cập nhật thông tin

router.get("/admin/all", protect, admin, getAllUsers);
router
	.route("/admin/:id")
	.delete(protect, admin, deleteUser)
	.put(protect, admin, updateUserRole);
module.exports = router;
