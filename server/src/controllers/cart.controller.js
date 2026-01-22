const Cart = require("../models/Cart");
const Product = require("../models/Product");

// --- LẤY GIỎ HÀNG CỦA USER ---
const getMyCart = async (req, res) => {
	try {
		let cart = await Cart.findOne({ user: req.user._id });
		if (!cart) {
			// Nếu chưa có giỏ thì tạo mới rỗng
			cart = await Cart.create({ user: req.user._id, cartItems: [] });
		}
		res.json({ success: true, result: cart });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- THÊM VÀO GIỎ (Add to Cart) ---
const addToCart = async (req, res) => {
	const { productId, color, size, quantity } = req.body;
	const userId = req.user._id;

	try {
		// 1. Kiểm tra sản phẩm tồn tại và lấy thông tin giá/ảnh
		const product = await Product.findById(productId);
		if (!product)
			return res
				.status(404)
				.json({ success: false, message: "Sản phẩm không tồn tại" });

		// 2. Tìm đúng biến thể màu
		const variant = product.variants.find((v) => v.color === color);
		if (!variant)
			return res
				.status(400)
				.json({ success: false, message: "Màu sắc không hợp lệ" });

		// 3. Tìm đúng size và check kho
		const sizeItem = variant.sizes.find((s) => s.size === Number(size));
		if (!sizeItem)
			return res
				.status(400)
				.json({ success: false, message: "Size không hợp lệ" });

		if (sizeItem.quantity < quantity) {
			return res
				.status(400)
				.json({
					success: false,
					message: `Chỉ còn ${sizeItem.quantity} sản phẩm trong kho`,
				});
		}

		// 4. Lấy giỏ hàng
		let cart = await Cart.findOne({ user: userId });
		if (!cart) cart = new Cart({ user: userId, cartItems: [] });

		// 5. Kiểm tra xem item này (ID + Color + Size) đã có trong giỏ chưa
		const itemIndex = cart.cartItems.findIndex(
			(p) =>
				p.product.toString() === productId &&
				p.color === color &&
				p.size === Number(size),
		);

		const price = variant.price || product.price; // Lấy giá riêng của màu hoặc giá gốc
		const image = variant.images[0]; // Lấy ảnh đầu tiên của màu đó

		if (itemIndex > -1) {
			// Nếu có rồi -> Tăng số lượng
			cart.cartItems[itemIndex].quantity += quantity;
			// Cập nhật lại giá nếu có thay đổi
			cart.cartItems[itemIndex].price = price;
		} else {
			// Nếu chưa -> Push mới
			cart.cartItems.push({
				product: productId,
				name: product.name,
				image: image,
				color: color,
				size: Number(size),
				quantity: quantity,
				price: price,
			});
		}

		// 6. Tính tổng tiền
		cart.totalPrice = cart.cartItems.reduce(
			(acc, item) => acc + item.quantity * item.price,
			0,
		);

		await cart.save();
		res.json({ success: true, message: "Đã thêm vào giỏ", result: cart });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// --- CẬP NHẬT SỐ LƯỢNG ITEM ---
// PUT /api/cart/item/:itemId
const updateCartItem = async (req, res) => {
	try {
		const { quantity } = req.body; // Số lượng mới
		const cart = await Cart.findOne({ user: req.user._id });

		if (!cart)
			return res
				.status(404)
				.json({ success: false, message: "Giỏ hàng trống" });

		const item = cart.cartItems.id(req.params.itemId); // Tìm sub-document
		if (!item)
			return res
				.status(404)
				.json({
					success: false,
					message: "Item không tồn tại trong giỏ",
				});

		if (quantity <= 0) {
			item.deleteOne(); // Xóa nếu số lượng <= 0
		} else {
			// (Nên thêm bước check tồn kho Product ở đây một lần nữa để chắc chắn)
			item.quantity = quantity;
		}

		// Tính lại tổng tiền
		cart.totalPrice = cart.cartItems.reduce(
			(acc, item) => acc + item.quantity * item.price,
			0,
		);

		await cart.save();
		res.json({ success: true, result: cart });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

module.exports = { getMyCart, addToCart, updateCartItem };
