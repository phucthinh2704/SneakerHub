import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGetMyCart, apiUpdateCartItem } from "../api/cart";
import { Trash2, ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const Cart = () => {
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null); // Tránh spam click khi đang update
	const navigate = useNavigate();

	useEffect(() => {
		fetchCart();
	}, []);

	const fetchCart = async () => {
		try {
			const res = await apiGetMyCart();
			if (res.success) setCart(res.result);
		} catch (error) {
			console.error("Lỗi lấy giỏ hàng", error);
		} finally {
			setLoading(false);
		}
	};

	// Cập nhật số lượng (truyền quantity = 0 để xóa)
	const handleUpdateQuantity = async (itemId, newQty) => {
		if (newQty < 0 || updatingId) return;
		setUpdatingId(itemId);
		try {
			const res = await apiUpdateCartItem(itemId, newQty);
			if (res.success) {
				setCart(res.result);
				if (newQty === 0)
					toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Lỗi cập nhật giỏ hàng",
			);
		} finally {
			setUpdatingId(null);
		}
	};

	if (loading)
		return (
			<div className="min-h-[70vh] flex justify-center items-center">
				<Loader2 className="animate-spin w-10 h-10 text-orange-600" />
			</div>
		);

	if (!cart || cart.cartItems.length === 0) {
		return (
			<div className="min-h-[70vh] flex flex-col justify-center items-center bg-gray-50 px-4">
				<div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full">
					<ShoppingBag
						size={64}
						className="mx-auto text-gray-300 mb-6"
					/>
					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Giỏ hàng trống
					</h2>
					<p className="text-gray-500 mb-8">
						Bạn chưa thêm sản phẩm nào vào giỏ hàng.
					</p>
					<Link
						to="/shop"
						className="inline-block w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition">
						Tiếp tục mua sắm
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-10">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-extrabold text-gray-900 mb-8">
					Giỏ hàng của bạn
				</h1>

				<div className="flex flex-col lg:flex-row gap-10">
					{/* Cột Trái: Danh sách sản phẩm */}
					<div className="flex-1">
						<div className="bg-white rounded-2xl shadow-sm overflow-hidden">
							{/* Table Header (Desktop) */}
							<div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b text-sm font-bold text-gray-500 uppercase tracking-wider">
								<div className="col-span-6">Sản phẩm</div>
								<div className="col-span-2 text-center">
									Đơn giá
								</div>
								<div className="col-span-2 text-center">
									Số lượng
								</div>
								<div className="col-span-2 text-right">
									Tổng tiền
								</div>
							</div>

							{/* Items List */}
							<div className="divide-y">
								{cart.cartItems.map((item) => (
									<div
										key={item._id}
										className="p-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
										{/* Sản phẩm */}
										<div className="col-span-6 flex w-full items-center gap-4">
											<img
												src={item.image}
												alt={item.name}
												className="w-24 h-24 object-cover rounded-xl border"
											/>
											<div>
												<h3 className="font-bold text-gray-900 hover:text-orange-600 transition line-clamp-2">
													<Link
														to={`/product/${item.product}`}>
														{item.name}
													</Link>
												</h3>
												<p className="text-sm text-gray-500 mt-1">
													Màu: {item.color} | Size:{" "}
													{item.size}
												</p>
												<button
													onClick={() =>
														handleUpdateQuantity(
															item._id,
															0,
														)
													}
													className="text-red-500 text-sm font-medium mt-2 flex items-center hover:text-red-700 transition">
													<Trash2
														size={14}
														className="mr-1"
													/>{" "}
													Xóa
												</button>
											</div>
										</div>

										{/* Đơn giá (Desktop) */}
										<div className="col-span-2 text-center hidden md:block font-medium text-gray-900">
											{new Intl.NumberFormat(
												"vi-VN",
											).format(item.price)}
											đ
										</div>

										{/* Số lượng */}
										<div className="col-span-2 flex justify-center w-full md:w-auto mt-4 md:mt-0">
											<div className="flex items-center border border-gray-300 rounded-lg h-10 w-28 bg-white">
												<button
													onClick={() =>
														handleUpdateQuantity(
															item._id,
															item.quantity - 1,
														)
													}
													disabled={
														updatingId === item._id
													}
													className="flex-1 h-full text-gray-600 hover:bg-gray-100 rounded-l-lg">
													-
												</button>
												<span className="flex-1 text-center font-bold text-sm">
													{updatingId === item._id ? (
														<Loader2
															size={14}
															className="animate-spin mx-auto"
														/>
													) : (
														item.quantity
													)}
												</span>
												<button
													onClick={() =>
														handleUpdateQuantity(
															item._id,
															item.quantity + 1,
														)
													}
													disabled={
														updatingId === item._id
													}
													className="flex-1 h-full text-gray-600 hover:bg-gray-100 rounded-r-lg">
													+
												</button>
											</div>
										</div>

										{/* Tổng tiền item */}
										<div className="col-span-2 text-right w-full md:w-auto mt-4 md:mt-0 flex justify-between md:block">
											<span className="md:hidden text-gray-500">
												Thành tiền:
											</span>
											<span className="font-bold text-orange-600 text-lg">
												{new Intl.NumberFormat(
													"vi-VN",
												).format(
													item.price * item.quantity,
												)}
												đ
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Cột Phải: Order Summary */}
					<div className="w-full lg:w-96">
						<div className="bg-white rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">
							<h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">
								Tóm tắt đơn hàng
							</h2>

							<div className="space-y-4 mb-6 text-gray-600">
								<div className="flex justify-between">
									<span>Tổng tiền hàng</span>
									<span className="font-medium text-gray-900">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(cart.totalPrice)}
									</span>
								</div>
								<div className="flex justify-between">
									<span>Phí vận chuyển</span>
									<span className="font-medium text-green-600">
										Miễn phí
									</span>
								</div>
							</div>

							<div className="border-t pt-4 mb-8">
								<div className="flex justify-between items-center">
									<span className="text-lg font-bold text-gray-900">
										Tổng thanh toán
									</span>
									<span className="text-2xl font-extrabold text-orange-600">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(cart.totalPrice)}
									</span>
								</div>
								<p className="text-xs text-gray-500 text-right mt-1">
									(Đã bao gồm VAT)
								</p>
							</div>

							<button
								onClick={() =>
									navigate("/checkout", {
										state: { cartData: cart },
									})
								}
								className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-md hover:shadow-lg">
								Tiến hành thanh toán <ArrowRight size={20} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
