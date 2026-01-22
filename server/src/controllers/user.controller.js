const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// --- 1. ĐĂNG KÝ USER MỚI ---
const registerUser = async (req, res) => {
	try {
		const { name, email, password, phone, address } = req.body;

		const userExists = await User.findOne({ email });
		if (userExists) {
			// Return success: false khi lỗi logic
			return res.status(400).json({
				success: false,
				message: "Email này đã được sử dụng",
			});
		}

		const user = await User.create({
			name,
			email,
			password,
			phone,
			address,
		});

		if (user) {
			res.status(201).json({
				success: true,
				message: "Đăng ký tài khoản thành công",
				result: {
					_id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
					address: user.address,
					role: user.role,
				},
				token: generateToken(user._id),
			});
		} else {
			res.status(400).json({
				success: false,
				message: "Dữ liệu không hợp lệ",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 2. ĐĂNG NHẬP ---
const authUser = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.matchPassword(password))) {
			res.json({
				success: true,
				message: "Đăng nhập thành công",
				result: {
					_id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
					address: user.address,
					role: user.role,
				},
				token: generateToken(user._id),
			});
		} else {
			res.status(401).json({
				success: false,
				message: "Email hoặc mật khẩu không đúng",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 3. LẤY PROFILE ---
// API này KHÔNG cần trả về token mới, chỉ lấy dữ liệu
const getUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (user) {
			res.json({
				success: true,
				result: {
					_id: user._id,
					name: user.name,
					email: user.email,
					phone: user.phone,
					address: user.address,
					role: user.role,
				},
			});
		} else {
			res.status(404).json({ success: false, message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 4. CẬP NHẬT PROFILE ---
const updateUserProfile = async (req, res) => {
	try {
		const user = await User.findById(req.user._id);

		if (user) {
			user.name = req.body.name || user.name;
			user.email = req.body.email || user.email;
			user.phone = req.body.phone || user.phone;
			user.address = req.body.address || user.address;

			if (req.body.password) {
				user.password = req.body.password;
			}

			const updatedUser = await user.save();

			res.json({
				success: true,
				message: "Cập nhật thông tin thành công",
				result: {
					_id: updatedUser._id,
					name: updatedUser.name,
					email: updatedUser.email,
					phone: updatedUser.phone,
					address: updatedUser.address,
					role: updatedUser.role,
				},
				// Trả về token mới để "làm mới" phiên đăng nhập
				token: generateToken(updatedUser._id),
			});
		} else {
			res.status(404).json({ success: false, message: "User not found" });
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = {
	registerUser,
	authUser,
	getUserProfile,
	updateUserProfile,
};
