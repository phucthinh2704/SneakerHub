import { ArrowLeft, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiGetMyCart, apiUpdateCartItem } from "../api/cart";

const Cart = () => {
	const [cart, setCart] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchCart = async () => {
			try {
				const res = await apiGetMyCart();
				if (res.success) setCart(res.result);
			} catch (error) {
				console.log(error);
			}
		};
		fetchCart();
	}, []);

	const handleUpdateQuantity = async (itemId, newQty) => {
		if (newQty < 0) return;
		try {
			const res = await apiUpdateCartItem(itemId, newQty);
			if (res.success) {
				setCart(res.result); // Cập nhật lại state cart
				if (newQty === 0) toast.success("Đã xóa sản phẩm");
			}
		} catch (error) {
      console.log(error);
			toast.error("Lỗi cập nhật giỏ hàng");
		}
	};

	if (!cart || cart.cartItems.length === 0) {
		return (
			<div className="text-center py-20">
				<h2 className="text-2xl font-bold text-gray-900">
					Giỏ hàng của bạn đang trống
				</h2>
				<Link
					to="/shop"
					className="mt-4 inline-block text-orange-600 hover:underline">
					Quay lại mua sắm
				</Link>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-10">
			<h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>
			<div className="flex flex-col lg:flex-row gap-8">
				{/* Cart Items */}
				<div className="flex-1 space-y-4">
					{cart.cartItems.map((item) => (
						<div
							key={item._id}
							className="flex items-center gap-4 border p-4 rounded-lg bg-white shadow-sm">
							<img
								src={item.image}
								alt={item.name}
								className="w-20 h-20 object-cover rounded"
							/>
							<div className="flex-1">
								<Link
									to={`/product/${item.product}`}
									className="font-bold text-gray-800 hover:text-orange-600">
									{item.name}
								</Link>
								<p className="text-sm text-gray-500">
									Màu: {item.color} | Size: {item.size}
								</p>
								<p className="text-orange-600 font-medium">
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
									}).format(item.price)}
								</p>
							</div>

							<div className="flex items-center border rounded">
								<button
									onClick={() =>
										handleUpdateQuantity(
											item._id,
											item.quantity - 1,
										)
									}
									className="px-3 py-1 hover:bg-gray-100">
									-
								</button>
								<span className="px-2 text-sm">
									{item.quantity}
								</span>
								<button
									onClick={() =>
										handleUpdateQuantity(
											item._id,
											item.quantity + 1,
										)
									}
									className="px-3 py-1 hover:bg-gray-100">
									+
								</button>
							</div>

							<button
								onClick={() =>
									handleUpdateQuantity(item._id, 0)
								}
								className="text-red-500 p-2 hover:bg-red-50 rounded">
								<Trash2 size={20} />
							</button>
						</div>
					))}
				</div>

				{/* Order Summary */}
				<div className="w-full lg:w-96 bg-gray-50 p-6 rounded-lg h-fit">
					<h2 className="text-lg font-bold mb-4">Tổng đơn hàng</h2>
					<div className="flex justify-between mb-2 text-gray-600">
						<span>Tạm tính</span>
						<span>
							{new Intl.NumberFormat("vi-VN", {
								style: "currency",
								currency: "VND",
							}).format(cart.totalPrice)}
						</span>
					</div>
					<div className="flex justify-between mb-4 text-gray-600">
						<span>Phí vận chuyển</span>
						<span>Miễn phí</span>
					</div>
					<div className="border-t pt-4 flex justify-between font-bold text-lg text-gray-900">
						<span>Tổng cộng</span>
						<span>
							{new Intl.NumberFormat("vi-VN", {
								style: "currency",
								currency: "VND",
							}).format(cart.totalPrice)}
						</span>
					</div>

					<button
						onClick={() =>
							navigate("/checkout", { state: { cartData: cart } })
						}
						className="w-full mt-6 bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700 transition">
						TIẾN HÀNH THANH TOÁN
					</button>

					<Link
						to="/shop"
						className="flex items-center justify-center mt-4 text-sm text-gray-500 hover:text-gray-900">
						<ArrowLeft
							size={16}
							className="mr-1"
						/>{" "}
						Tiếp tục mua sắm
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Cart;
