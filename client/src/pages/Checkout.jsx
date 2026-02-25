import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiCreateOrder } from "../api/order";
import { apiGetUserProfile } from "../api/user";
import { Truck, CreditCard, MapPin, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const Checkout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// Lấy dữ liệu giỏ hàng được truyền từ trang Cart sang
	const cartData = location.state?.cartData;

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [form, setForm] = useState({
		fullName: "",
		phone: "",
		address: "",
		paymentMethod: "COD",
	});

	// Tự động điền thông tin User vào form giao hàng
	useEffect(() => {
		if (!cartData) {
			navigate("/cart");
			return;
		}
		const fetchUser = async () => {
			try {
				const res = await apiGetUserProfile();
				if (res.success) {
					setForm((prev) => ({
						...prev,
						fullName: res.result.name || "",
						phone: res.result.phone || "",
						address: res.result.address || "",
					}));
				}
			} catch (error) {
        console.error("Lỗi lấy thông tin user", error);
      }
		};
		fetchUser();
	}, [cartData, navigate]);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Mapping dữ liệu để gửi lên API createOrder
		const orderPayload = {
			orderItems: cartData.cartItems.map((item) => ({
				product: item.product,
				name: item.name,
				qty: item.quantity,
				image: item.image,
				price: item.price,
				selectedColor: item.color,
				selectedSize: item.size,
			})),
			shippingAddress: {
				fullName: form.fullName,
				phone: form.phone,
				address: form.address,
			},
			paymentMethod: form.paymentMethod,
			itemsPrice: cartData.totalPrice,
			shippingPrice: 0,
			totalPrice: cartData.totalPrice,
		};

		try {
			const res = await apiCreateOrder(orderPayload);
			if (res.success) {
				setSuccess(true);
				// Chờ 2s rồi chuyển về trang lịch sử đơn hàng
				setTimeout(() => navigate("/my-orders"), 2000);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					"Lỗi đặt hàng, vui lòng thử lại",
			);
		} finally {
			setLoading(false);
		}
	};

	if (!cartData) return null;

	if (success) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
				<CheckCircle
					size={80}
					className="text-green-500 mb-6"
				/>
				<h1 className="text-3xl font-bold text-gray-900 mb-2">
					Đặt hàng thành công!
				</h1>
				<p className="text-gray-600 mb-6">
					Cảm ơn bạn đã mua sắm tại Shoe Store. Đơn hàng của bạn đang
					được xử lý.
				</p>
				<Loader2 className="animate-spin text-orange-600" />
				<p className="text-sm text-gray-400 mt-4">
					Đang chuyển hướng đến lịch sử đơn hàng...
				</p>
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-10 font-sans">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-extrabold text-gray-900 mb-8">
					Thanh toán
				</h1>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col lg:flex-row gap-10">
					{/* Form Thông tin */}
					<div className="flex-1 space-y-8">
						{/* Box 1: Địa chỉ */}
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
							<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
								<MapPin className="mr-3 text-orange-600" />{" "}
								Thông tin giao hàng
							</h2>
							<div className="space-y-5">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Họ và tên người nhận
									</label>
									<input
										required
										name="fullName"
										value={form.fullName}
										onChange={handleChange}
										className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
										placeholder="Nhập họ và tên"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Số điện thoại
									</label>
									<input
										required
										name="phone"
										value={form.phone}
										onChange={handleChange}
										className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
										placeholder="Ví dụ: 0912345678"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										Địa chỉ chi tiết
									</label>
									<textarea
										required
										name="address"
										value={form.address}
										onChange={handleChange}
										rows="3"
										className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
										placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"></textarea>
								</div>
							</div>
						</div>

						{/* Box 2: Phương thức thanh toán */}
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
							<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
								<CreditCard className="mr-3 text-orange-600" />{" "}
								Phương thức thanh toán
							</h2>
							<div className="space-y-3">
								<label
									className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${form.paymentMethod === "COD" ? "border-orange-600 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}>
									<input
										type="radio"
										name="paymentMethod"
										value="COD"
										checked={form.paymentMethod === "COD"}
										onChange={handleChange}
										className="w-5 h-5 text-orange-600 focus:ring-orange-500"
									/>
									<div className="ml-4 flex flex-col">
										<span className="font-bold text-gray-900">
											Thanh toán khi nhận hàng (COD)
										</span>
										<span className="text-sm text-gray-500">
											Thanh toán bằng tiền mặt khi shipper
											giao hàng tới.
										</span>
									</div>
								</label>

								<label
									className={`flex items-center p-4 border rounded-xl cursor-pointer transition ${form.paymentMethod === "Banking" ? "border-orange-600 bg-orange-50" : "border-gray-200 hover:bg-gray-50"}`}>
									<input
										type="radio"
										name="paymentMethod"
										value="Banking"
										checked={
											form.paymentMethod === "Banking"
										}
										onChange={handleChange}
										className="w-5 h-5 text-orange-600 focus:ring-orange-500"
									/>
									<div className="ml-4 flex flex-col">
										<span className="font-bold text-gray-900">
											Chuyển khoản ngân hàng
										</span>
										<span className="text-sm text-gray-500">
											Thông tin tài khoản sẽ hiển thị sau
											khi đặt hàng.
										</span>
									</div>
								</label>
							</div>
						</div>
					</div>

					{/* Review Đơn Hàng (Bên phải) */}
					<div className="w-full lg:w-100">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-24">
							<h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
								<Truck className="mr-3 text-orange-600" /> Đơn
								hàng của bạn
							</h2>

							<div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
								{cartData.cartItems.map((item) => (
									<div
										key={item._id}
										className="flex items-start gap-4">
										<div className="relative">
											<img
												src={item.image}
												alt={item.name}
												className="w-16 h-16 object-cover rounded-lg border"
											/>
											<span className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
												{item.quantity}
											</span>
										</div>
										<div className="flex-1">
											<h4 className="text-sm font-bold text-gray-900 line-clamp-2">
												{item.name}
											</h4>
											<p className="text-xs text-gray-500 mt-1">
												{item.color} / {item.size}
											</p>
											<p className="text-sm font-medium text-orange-600 mt-1">
												{new Intl.NumberFormat(
													"vi-VN",
												).format(item.price)}
												đ
											</p>
										</div>
									</div>
								))}
							</div>

							<div className="border-t pt-4 space-y-3 text-sm text-gray-600 mb-6">
								<div className="flex justify-between">
									<span>Tạm tính</span>
									<span>
										{new Intl.NumberFormat("vi-VN").format(
											cartData.totalPrice,
										)}
										đ
									</span>
								</div>
								<div className="flex justify-between">
									<span>Phí vận chuyển</span>
									<span className="text-green-600">
										Miễn phí
									</span>
								</div>
							</div>

							<div className="border-t pt-4 mb-6 flex justify-between items-center">
								<span className="text-lg font-bold text-gray-900">
									Tổng cộng
								</span>
								<span className="text-2xl font-extrabold text-orange-600">
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
									}).format(cartData.totalPrice)}
								</span>
							</div>

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed">
								{loading ? (
									<Loader2 className="animate-spin mx-auto w-6 h-6" />
								) : (
									"ĐẶT HÀNG NGAY"
								)}
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Checkout;
