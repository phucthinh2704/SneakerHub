const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import model User của bạn

// --- Middleware xác thực đăng nhập ---
const protect = async (req, res, next) => {
	let token;

	// 1. Kiểm tra header Authorization có tồn tại và bắt đầu bằng "Bearer"
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			// 2. Lấy token từ header (Dạng: "Bearer <token_string>")
			token = req.headers.authorization.split(" ")[1];

			// 3. Giải mã token để lấy ID user
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			// 4. Tìm user trong DB và gán vào req.user (Loại bỏ trường password)
			// Lưu ý: 'id' là tên trường bạn đã sign khi tạo token (có thể là _id)
			req.user = await User.findById(decoded.id).select("-password");
			if (!req.user) {
				return res.status(401).json({ message: "User không tồn tại" });
			}
			next();
		} catch (error) {
			console.error(error);
			return res.status(401).json({
				message: "Token không hợp lệ, vui lòng đăng nhập lại",
			});
		}
	}

	if (!token) {
		return res
			.status(401)
			.json({ message: "Không có token, quyền truy cập bị từ chối" });
	}
};

// --- Middleware kiểm tra quyền Admin ---
const admin = (req, res, next) => {
	// Kiểm tra trường role thay vì isAdmin
	if (req.user && req.user.role === "admin") {
		next();
	} else {
		res.status(403).json({ message: "Yêu cầu quyền Admin (Role denied)" });
	}
};

module.exports = { protect, admin };
