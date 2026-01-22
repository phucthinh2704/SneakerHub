const Brand = require("../models/Brand");
const slugify = require("../utils/slugify");
const fs = require("fs");
const path = require("path");

const getBrands = async (req, res) => {
	try {
		const brands = await Brand.find({ isActive: true });
		res.json({ success: true, result: brands });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const createBrand = async (req, res) => {
	try {
		const { name, logo, description } = req.body;
		if (!name || !logo)
			return res
				.status(400)
				.json({ success: false, message: "Tên và Logo là bắt buộc" });

		const brand = await Brand.create({
			name,
			slug: slugify(name),
			logo,
			description,
		});
		res.status(201).json({ success: true, result: brand });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- IMPORT BRAND TỪ FILE JSON ---
// POST /api/brand/import
const importBrands = async (req, res) => {
	try {
		// 1. Xác định đường dẫn file brand.json
		// __dirname là thư mục hiện tại (controllers), '..' là ra ngoài 1 cấp, vào 'data'
		const filePath = path.join(__dirname, "..", "data", "brand.json");

		// 2. Kiểm tra file có tồn tại không
		if (!fs.existsSync(filePath)) {
			return res.status(404).json({
				success: false,
				message: "Không tìm thấy file dữ liệu brand.json",
			});
		}

		// 3. Đọc file và parse JSON
		const fileData = fs.readFileSync(filePath, "utf-8");
		const brands = JSON.parse(fileData);

		// 4. (Tùy chọn) Xóa dữ liệu cũ để tránh lỗi trùng lặp (Duplicate Key)
		// Nếu bạn muốn giữ dữ liệu cũ và chỉ thêm mới thì bỏ dòng này,
		// nhưng nhớ là name và slug là unique nên sẽ lỗi nếu trùng.
		await Brand.deleteMany({});

		// 5. Chèn dữ liệu vào DB
		await Brand.insertMany(brands);

		res.status(201).json({
			success: true,
			message: "Đã import dữ liệu thương hiệu thành công",
			count: brands.length,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { getBrands, createBrand, importBrands };
