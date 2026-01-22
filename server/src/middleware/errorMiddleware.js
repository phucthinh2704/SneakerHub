// middleware/errorMiddleware.js

// 1. Bắt lỗi khi không tìm thấy Route (404)
const notFound = (req, res, next) => {
	// Tạo một lỗi mới kèm theo thông báo đường dẫn mà user vừa truy cập
	const error = new Error(
		`Not Found Route - ${req.method}: ${req.originalUrl}`,
	);
	res.status(404);

	// Chuyển lỗi này xuống middleware xử lý lỗi bên dưới (errorHandler)
	next(error);
};

// 2. Middleware xử lý lỗi chung (Format lại JSON)
const errorHandler = (err, req, res, next) => {
	// Nếu status code đang là 200 (thành công) mà lại có lỗi, thì đổi thành 500 (lỗi server)
	// Nếu đã là 404 (từ middleware trên) hoặc 400, 401... thì giữ nguyên
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

	res.status(statusCode);
	res.json({
		success: false, // Luôn trả về false khi có lỗi
		message: err.message,
	});
};

module.exports = { notFound, errorHandler };
