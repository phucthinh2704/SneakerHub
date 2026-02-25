const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");
const slugify = require("../utils/slugify");

// --- 1. LẤY DANH SÁCH SẢN PHẨM (Có Lọc, Phân trang, Sắp xếp) ---
// GET /api/products
const getProducts = async (req, res) => {
	try {
		const pageSize = Number(req.query.limit) || 12;
		const page = Number(req.query.page) || 1;

		// 1. Keyword search
		const keyword = req.query.keyword
			? { name: { $regex: req.query.keyword, $options: "i" } }
			: {};

		const filter = { ...keyword, isPublished: true };

		// --- 2. SỬA: LỌC THEO BRAND (DÙNG SLUG) ---
		if (req.query.brand) {
			// Client gửi lên: ?brand=nike,adidas
			const brandSlugs = req.query.brand.split(",");

			// Tìm các Brand có slug trùng khớp
			const brands = await Brand.find({
				slug: { $in: brandSlugs },
			}).select("_id");

			// Lấy danh sách ID thật
			const brandIds = brands.map((b) => b._id);

			if (brandIds.length > 0) {
				filter.brand = { $in: brandIds };
			}
		}

		// --- 3. SỬA: LỌC THEO CATEGORY (DÙNG SLUG) ---
		if (req.query.category) {
			// Tìm category cha dựa trên SLUG
			const currentCategory = await Category.findOne({
				slug: req.query.category,
			});

			if (currentCategory) {
				// Tìm category con (nếu có)
				const childCategories = await Category.find({
					parentId: currentCategory._id,
				});

				const categoryIds = [
					currentCategory._id,
					...childCategories.map((c) => c._id),
				];

				filter.category = { $in: categoryIds };
			} else {
				// Nếu slug không tồn tại -> Gán ID giả để không ra kết quả nào
				filter.category = "000000000000000000000000";
			}
		}

		// 4. Lọc theo Giá (Giữ nguyên)
		if (req.query.minPrice || req.query.maxPrice) {
			filter.price = {};
			if (req.query.minPrice)
				filter.price.$gte = Number(req.query.minPrice);
			if (req.query.maxPrice)
				filter.price.$lte = Number(req.query.maxPrice);
		}

		// 5. Lọc theo Rating (Giữ nguyên)
		if (req.query.rating) {
			filter.rating = { $gte: Number(req.query.rating) };
		}

		// 6. Sắp xếp (Giữ nguyên)
		let sortOption = { createdAt: -1 };
		if (req.query.sort) {
			switch (req.query.sort) {
				case "price_asc":
					sortOption = { price: 1 };
					break;
				case "price_desc":
					sortOption = { price: -1 };
					break;
				case "rating":
					sortOption = { rating: -1 };
					break;
				case "oldest":
					sortOption = { createdAt: 1 };
					break;
				default:
					sortOption = { createdAt: -1 };
			}
		}

		const count = await Product.countDocuments(filter);
		const products = await Product.find(filter)
			.populate("category", "name slug")
			.populate("brand", "name logo slug")
			.sort(sortOption)
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({
			success: true,
			result: {
				products,
				page,
				pages: Math.ceil(count / pageSize),
				total: count,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 2. LẤY CHI TIẾT SẢN PHẨM (Theo Slug) ---
// GET /api/products/details/:slug
const getProductBySlug = async (req, res) => {
	try {
		const product = await Product.findOne({ slug: req.params.slug })
			.populate("category", "name slug")
			.populate("brand", "name logo");
		// .populate("reviews"); // Nếu muốn lấy luôn review (cần cấu hình virtuals ở model)

		if (!product) {
			return res
				.status(404)
				.json({ success: false, message: "Không tìm thấy sản phẩm" });
		}

		res.json({ success: true, result: product });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 3. LẤY CHI TIẾT SẢN PHẨM (Theo ID - Dành cho Admin sửa) ---
// GET /api/products/:id
const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json({ success: true, result: product });
		} else {
			res.status(404).json({
				success: false,
				message: "Product not found",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 4. TẠO SẢN PHẨM MỚI (Admin) ---
// POST /api/products
const createProduct = async (req, res) => {
	try {
		const {
			name,
			brand,
			category,
			description,
			price,
			discountPrice,
			variants,
			isPublished,
		} = req.body;

		// Tự động tạo slug từ tên
		const slug = slugify(name);

		// Kiểm tra trùng Slug
		const productExists = await Product.findOne({ slug });
		if (productExists) {
			return res.status(400).json({
				success: false,
				message: "Tên sản phẩm (slug) đã tồn tại",
			});
		}

		const product = new Product({
			user: req.user._id,
			name,
			slug,
			brand,
			category,
			description,
			price,
			discountPrice,
			variants,
			isPublished,
		});

		const createdProduct = await product.save();

		res.status(201).json({
			success: true,
			message: "Tạo sản phẩm thành công",
			result: createdProduct,
		});
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// --- 5. CẬP NHẬT SẢN PHẨM (Admin) ---
// PUT /api/products/:id
const updateProduct = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discountPrice,
			category,
			brand,
			variants,
			isPublished,
			slug,
		} = req.body;

		const product = await Product.findById(req.params.id);

		if (product) {
			product.name = name || product.name;
			// Nếu có gửi slug mới thì dùng, không thì tạo lại từ name mới, hoặc giữ nguyên cũ
			if (slug) product.slug = slug;
			else if (name) product.slug = slugify(name);

			product.description = description || product.description;
			product.price = price !== undefined ? price : product.price;
			product.discountPrice =
				discountPrice !== undefined
					? discountPrice
					: product.discountPrice;
			product.category = category || product.category;
			product.brand = brand || product.brand;
			product.isPublished =
				isPublished !== undefined ? isPublished : product.isPublished;

			if (variants) {
				product.variants = variants;
			}

			const updatedProduct = await product.save();

			res.json({
				success: true,
				message: "Cập nhật sản phẩm thành công",
				result: updatedProduct,
			});
		} else {
			res.status(404).json({
				success: false,
				message: "Không tìm thấy sản phẩm",
			});
		}
	} catch (error) {
		res.status(400).json({ success: false, message: error.message });
	}
};

// --- 6. XÓA SẢN PHẨM (Admin) ---
// DELETE /api/products/:id
const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			await product.deleteOne();
			res.json({ success: true, message: "Đã xóa sản phẩm thành công" });
		} else {
			res.status(404).json({
				success: false,
				message: "Không tìm thấy sản phẩm",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- 7. QUẢN LÝ KHO NHANH (Internal/Admin) ---
// PATCH /api/products/stock/update
const updateStock = async (req, res) => {
	try {
		const { productId, variantColor, size, quantityChange } = req.body;

		const product = await Product.findById(productId);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Sản phẩm không tồn tại" });

		const variant = product.variants.find((v) => v.color === variantColor);
		if (!variant)
			return res
				.status(404)
				.json({ success: false, message: "Màu sắc không tồn tại" });

		const sizeObj = variant.sizes.find((s) => s.size === Number(size));
		if (!sizeObj)
			return res
				.status(404)
				.json({ success: false, message: "Size không tồn tại" });

		sizeObj.quantity += quantityChange;

		if (sizeObj.quantity < 0) {
			return res.status(400).json({
				success: false,
				message: "Kho không đủ số lượng để trừ",
			});
		}

		await product.save();
		res.json({ success: true, message: "Cập nhật kho thành công" });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- LẤY TẤT CẢ SẢN PHẨM CHO ADMIN (Bao gồm cả sản phẩm ẩn) ---
const getAdminProducts = async (req, res) => {
	try {
		const pageSize = Number(req.query.limit) || 10;
		const page = Number(req.query.page) || 1;

		const keyword = req.query.keyword
			? { name: { $regex: req.query.keyword, $options: "i" } }
			: {};

		if (req.query.category) {
			// 1. Tìm tất cả các danh mục con có parentId là danh mục đang chọn
			const childCategories = await Category.find({
				parentId: req.query.category,
			});

			// 2. Gom ID của danh mục cha và các danh mục con vào chung 1 mảng
			const categoryIds = [
				req.query.category,
				...childCategories.map((c) => c._id.toString()),
			];

			// 3. Dùng $in để tìm các sản phẩm thuộc danh mục cha HOẶC danh mục con
			keyword.category = { $in: categoryIds };
		}

		if (req.query.brand) keyword.brand = req.query.brand;

		const count = await Product.countDocuments({ ...keyword });
		const products = await Product.find({ ...keyword })
			.populate("category", "name slug")
			.populate("brand", "name slug")
			.sort({ createdAt: -1 })
			.limit(pageSize)
			.skip(pageSize * (page - 1));

		res.json({
			success: true,
			result: {
				products,
				page,
				pages: Math.ceil(count / pageSize),
				total: count,
			},
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = {
	getProducts,
	getProductBySlug,
	getProductById, // Thêm hàm này để Admin lấy dữ liệu cũ load lên form Edit
	createProduct,
	updateProduct,
	deleteProduct,
	updateStock,
	getAdminProducts,
};
