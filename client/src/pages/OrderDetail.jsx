import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGetOrderDetail } from "../api/order";
import { Loader2, ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";

const OrderDetail = () => {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrder = async () => {
			try {
				const res = await apiGetOrderDetail(id);
				if (res.success) setOrder(res.result);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrder();
	}, [id]);

	if (loading)
		return (
			<div className="min-h-screen flex justify-center items-center">
				<Loader2 className="animate-spin w-10 h-10 text-orange-600" />
			</div>
		);
	if (!order)
		return <div className="text-center py-20">Không tìm thấy đơn hàng</div>;

	return (
		<div className="bg-gray-50 min-h-screen py-10 font-sans">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<Link
					to="/my-orders"
					className="inline-flex items-center text-gray-500 hover:text-orange-600 mb-6 transition">
					<ArrowLeft
						size={16}
						className="mr-2"
					/>{" "}
					Quay lại danh sách đơn
				</Link>

				<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
					{/* Header Order */}
					<div className="bg-gray-900 text-white p-6 md:p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold flex items-center">
								<Package className="mr-3" /> Chi tiết đơn hàng
							</h1>
							<p className="text-gray-400 mt-2 font-mono">
								Mã đơn: #{order._id.toUpperCase()}
							</p>
						</div>
						<div className="text-left md:text-right">
							<p className="text-gray-400 text-sm mb-1">
								Ngày đặt:{" "}
								{new Date(order.createdAt).toLocaleString(
									"vi-VN",
								)}
							</p>
							<span
								className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${
					order.status === "Delivered"
						? "bg-green-500 text-white"
						: order.status === "Cancelled"
							? "bg-red-500 text-white"
							: order.status === "Shipping"
								? "bg-blue-500 text-white"
								: "bg-yellow-500 text-gray-900"
				}`}>
								{order.status}
							</span>
						</div>
					</div>

					<div className="p-6 md:p-8 space-y-8">
						{/* Info Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b pb-8">
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
									<MapPin
										className="mr-2 text-orange-600"
										size={20}
									/>{" "}
									Địa chỉ nhận hàng
								</h3>
								<div className="bg-gray-50 p-4 rounded-xl text-gray-700 space-y-2">
									<p>
										<span className="font-medium text-gray-900">
											Người nhận:
										</span>{" "}
										{order.shippingAddress.fullName}
									</p>
									<p>
										<span className="font-medium text-gray-900">
											Điện thoại:
										</span>{" "}
										{order.shippingAddress.phone}
									</p>
									<p>
										<span className="font-medium text-gray-900">
											Địa chỉ:
										</span>{" "}
										{order.shippingAddress.address}
									</p>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
									<CreditCard
										className="mr-2 text-orange-600"
										size={20}
									/>{" "}
									Thanh toán
								</h3>
								<div className="bg-gray-50 p-4 rounded-xl text-gray-700 space-y-2 h-30">
									<p>
										<span className="font-medium text-gray-900">
											Phương thức:
										</span>{" "}
										{order.paymentMethod === "COD"
											? "Thanh toán tiền mặt (COD)"
											: "Chuyển khoản"}
									</p>
									{/* Có thể bổ sung check isPaid nếu DB bạn sau này có */}
								</div>
							</div>
						</div>

						{/* Items */}
						<div>
							<h3 className="text-lg font-bold text-gray-900 mb-4">
								Sản phẩm đã mua
							</h3>
							<div className="divide-y border rounded-xl overflow-hidden">
								{order.orderItems.map((item) => (
									<div
										key={item._id}
										className="p-4 flex items-center gap-4 bg-white hover:bg-gray-50 transition">
										<img
											src={item.image}
											alt={item.name}
											className="w-20 h-20 object-cover rounded-lg border"
										/>
										<div className="flex-1">
											<Link
												to={`/product/${item.product}`}
												className="font-bold text-gray-900 hover:text-orange-600 transition">
												{item.name}
											</Link>
											<p className="text-sm text-gray-500 mt-1">
												Màu: {item.selectedColor} |
												Size: {item.selectedSize}
											</p>
											<p className="text-sm font-medium text-gray-500 mt-1">
												Số lượng: x{item.qty}
											</p>
										</div>
										<div className="font-bold text-orange-600">
											{new Intl.NumberFormat(
												"vi-VN",
											).format(item.price * item.qty)}
											đ
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Total */}
						<div className="flex justify-end">
							<div className="w-full md:w-1/2 space-y-3 text-gray-600">
								<div className="flex justify-between">
									<span>Tổng tiền hàng:</span>
									<span className="font-medium text-gray-900">
										{new Intl.NumberFormat("vi-VN").format(
											order.itemsPrice,
										)}
										đ
									</span>
								</div>
								<div className="flex justify-between">
									<span>Phí vận chuyển:</span>
									<span className="font-medium text-gray-900">
										{new Intl.NumberFormat("vi-VN").format(
											order.shippingPrice,
										)}
										đ
									</span>
								</div>
								<div className="flex justify-between items-center border-t pt-3 mt-3">
									<span className="text-lg font-bold text-gray-900">
										Tổng cộng:
									</span>
									<span className="text-3xl font-extrabold text-orange-600">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(order.totalPrice)}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default OrderDetail;
