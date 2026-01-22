const express = require("express");
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/user.controller");

// Import middleware bảo vệ route
const { protect } = require("../middleware/authMiddleware");

// Route Đăng ký (Public)
router.post("/register", registerUser);

// Route Đăng nhập (Public)
router.post("/login", authUser);

// Route Profile (Private - Cần Token)
// Dùng router.route để gộp GET và PUT vào chung 1 đường dẫn
router
  .route("/profile")
  .get(protect, getUserProfile)     // Xem thông tin
  .put(protect, updateUserProfile); // Cập nhật thông tin

module.exports = router;