const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

// --- TẠO ĐƠN HÀNG (Checkout) ---
const createOrder = async (req, res) => {
	try {
		const {
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
		} = req.body;

		if (orderItems && orderItems.length === 0) {
			return res
				.status(400)
				.json({ success: false, message: "Không có sản phẩm nào" });
		}

		// --- BƯỚC 1: KIỂM TRA TỒN KHO VÀ TRỪ KHO ---
		// Duyệt qua từng sản phẩm trong đơn hàng
		for (const item of orderItems) {
			const product = await Product.findById(item.product);
			if (!product) {
				throw new Error(`Sản phẩm ${item.name} không tồn tại`);
			}

			// Tìm đúng biến thể (Màu)
			const variant = product.variants.find(
				(v) => v.color === item.selectedColor,
			);
			if (!variant) {
				throw new Error(
					`Màu ${item.selectedColor} của ${item.name} không tồn tại`,
				);
			}

			// Tìm đúng Size
			const sizeObj = variant.sizes.find(
				(s) => s.size === item.selectedSize,
			);
			if (!sizeObj) {
				throw new Error(
					`Size ${item.selectedSize} của ${item.name} không tồn tại`,
				);
			}

			// Check số lượng
			if (sizeObj.quantity < item.qty) {
				throw new Error(
					`Sản phẩm ${item.name} (Màu: ${item.selectedColor}, Size: ${item.selectedSize}) đã hết hàng hoặc không đủ số lượng.`,
				);
			}

			// TRỪ KHO
			sizeObj.quantity -= item.qty;

			// Lưu thay đổi vào DB Product
			await product.save();
		}

		// --- BƯỚC 2: TẠO ĐƠN HÀNG ---
		const order = new Order({
			user_id: req.user._id,
			orderItems,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
			status: "Pending", // Mặc định
		});

		const createdOrder = await order.save();

		// --- BƯỚC 3: XÓA GIỎ HÀNG (Nếu mua từ giỏ) ---
		await Cart.findOneAndDelete({ user: req.user._id });

		res.status(201).json({
			success: true,
			message: "Đặt hàng thành công",
			result: createdOrder,
		});
	} catch (error) {
		// Nếu lỗi (ví dụ hết hàng), trả về lỗi client và KHÔNG tạo đơn
		res.status(400).json({ success: false, message: error.message });
	}
};

// --- LẤY DANH SÁCH ĐƠN HÀNG CỦA TÔI ---
const getMyOrders = async (req, res) => {
	try {
		const orders = await Order.find({ user_id: req.user._id }).sort({
			createdAt: -1,
		});
		res.json({ success: true, result: orders });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- LẤY CHI TIẾT ĐƠN HÀNG ---
const getOrderById = async (req, res) => {
	try {
		const order = await Order.findById(req.params.id).populate(
			"user_id",
			"name email",
		);

		if (order) {
			// Chỉ cho phép xem nếu là Admin HOẶC chủ đơn hàng
			if (
				req.user.role === "admin" ||
				order.user_id._id.toString() === req.user._id.toString()
			) {
				res.json({ success: true, result: order });
			} else {
				res.status(403).json({
					success: false,
					message: "Không có quyền xem đơn này",
				});
			}
		} else {
			res.status(404).json({
				success: false,
				message: "Không tìm thấy đơn hàng",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG (Admin) ---
const updateOrderStatus = async (req, res) => {
	try {
		const { status } = req.body;
		const order = await Order.findById(req.params.id);

		if (order) {
			order.status = status;
			const updatedOrder = await order.save();
			res.json({
				success: true,
				message: "Cập nhật trạng thái thành công",
				result: updatedOrder,
			});
		} else {
			res.status(404).json({
				success: false,
				message: "Order not found",
			});
		}
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { createOrder, getMyOrders, getOrderById, updateOrderStatus };
