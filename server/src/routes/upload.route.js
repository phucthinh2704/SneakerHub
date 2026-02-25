	const express = require("express");
const router = express.Router();
const upload = require("../configs/cloudinary.config");

// --- 1. UPLOAD 1 ẢNH (Dùng cho Logo Brand, Ảnh Category, Ảnh đại diện) ---
// Key gửi lên trong form-data là: "image"
router.post("/single", upload.single("image"), (req, res) => {
	try {
		if (!req.file) {
			return res
				.status(400)
				.json({ success: false, message: "Chưa chọn file ảnh" });
		}
		// Trả về URL ảnh để Client dùng
		res.json({
			success: true,
			message: "Upload thành công",
			url: req.file.path, // Đây là đường dẫn ảnh trên Cloudinary
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

// --- 2. UPLOAD NHIỀU ẢNH (Dùng cho Product Variants, Review Images) ---
// Key gửi lên trong form-data là: "images" (Chọn nhiều file)
router.post("/multiple", upload.array("images", 10), (req, res) => {
	try {
		if (!req.files || req.files.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "Chưa chọn file ảnh" });
		}

		// Lấy danh sách URL
		const urls = req.files.map((file) => file.path);

		res.json({
			success: true,
			message: "Upload thành công",
			urls: urls, // Mảng các đường dẫn ảnh
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
});

module.exports = router;
