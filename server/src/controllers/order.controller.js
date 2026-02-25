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

		if (!order)
			return res
				.status(404)
				.json({ success: false, message: "Không tìm thấy đơn hàng" });

		// 1. CHẶN RÀNG BUỘC
		if (order.status === "Delivered") {
			return res
				.status(400)
				.json({
					success: false,
					message:
						"Đơn hàng đã giao thành công, không thể thay đổi trạng thái.",
				});
		}
		if (order.status === "Cancelled") {
			return res
				.status(400)
				.json({
					success: false,
					message:
						"Đơn hàng đã bị hủy, không thể thay đổi trạng thái.",
				});
		}

		// 2. LOGIC HOÀN KHO KHI HỦY
		if (status === "Cancelled" && order.status !== "Cancelled") {
			// Lặp qua từng sản phẩm trong order.orderItems để + lại số lượng vào bảng Product
			// (Bạn sẽ cần require model Product và viết hàm cập nhật số lượng ở đây)
		}

		// 3. LOGIC TRỪ KHO KHI ĐẶT HÀNG (Thường làm ở hàm createOrder)

		order.status = status;
		const updatedOrder = await order.save();

		res.json({ success: true, result: updatedOrder });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

const getAllOrders = async (req, res) => {
	try {
		// Lấy tất cả đơn hàng, populate thêm thông tin user (tên, email) để admin dễ liên hệ
		const orders = await Order.find({})
			.populate("user_id", "name email")
			.sort({ createdAt: -1 }); // Đơn hàng mới nhất xếp lên đầu

		// Tính tổng doanh thu của tất cả đơn hàng đã giao thành công (Tùy chọn cho Admin Dashboard)
		const totalRevenue = orders
			.filter((order) => order.status === "Delivered")
			.reduce((sum, order) => sum + order.totalPrice, 0);

		res.json({
			success: true,
			result: orders,
			totalOrders: orders.length,
			totalRevenue: totalRevenue,
		});
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- KHÁCH HÀNG TỰ HỦY ĐƠN HÀNG ---
const cancelMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // 1. Kiểm tra xem đơn hàng này có đúng là của user đang đăng nhập không
    if (order.user_id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Bạn không có quyền hủy đơn hàng này" });
    }

    // 2. Ràng buộc: Chỉ cho phép hủy khi đơn hàng đang ở trạng thái "Pending" (Chờ xử lý)
    if (order.status !== "Pending") {
      return res.status(400).json({ 
        success: false, 
        message: "Không thể hủy. Đơn hàng của bạn đã được xử lý hoặc đang giao." 
      });
    }

    // 3. Cập nhật trạng thái thành Cancelled
    order.status = "Cancelled";
    await order.save();

    // 4. (Quan trọng) Logic Hoàn kho:
    // Tại đây bạn sẽ lặp qua mảng order.orderItems để cộng lại số lượng vào bảng Product
    // Ví dụ (Pseudo code):
    // for (const item of order.orderItems) {
    //    Cập nhật product.variants.sizes[].quantity += item.qty
    // }

    res.json({ success: true, message: "Hủy đơn hàng thành công", result: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
	createOrder,
	getMyOrders,
	getOrderById,
	updateOrderStatus,
	getAllOrders,
	cancelMyOrder
};
