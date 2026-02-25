import React, { useEffect, useState } from "react";
import { apiGetMyOrders, apiCancelMyOrder } from "../api/order";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const res = await apiGetMyOrders();
			if (res.success) setOrders(res.result);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// --- HÀM XỬ LÝ KHÁCH HÀNG HỦY ĐƠN ---
	const handleCancelOrder = async (orderId) => {
		// 1. Xác nhận lại từ người dùng
		const confirm = await Swal.fire({
			title: "Bạn có chắc muốn hủy đơn hàng này?",
			text: "Hành động này không thể hoàn tác!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Có, hủy đơn",
			cancelButtonText: "Đóng",
		});

		if (!confirm.isConfirmed) return;

		try {
			// 2. Gọi API hủy đơn
			const res = await apiCancelMyOrder(orderId);
			if (res.success) {
				toast.success("Hủy đơn hàng thành công!");

				// 3. Cập nhật lại giao diện (State) mà không cần tải lại trang
				setOrders((prevOrders) =>
					prevOrders.map((order) =>
						order._id === orderId
							? { ...order, status: "Cancelled" }
							: order,
					),
				);
			}
		} catch (error) {
			toast.error(
				error.response?.data?.message || "Lỗi khi hủy đơn hàng",
			);
		}
	};

	if (loading)
		return (
			<div className="flex justify-center p-10">
				<Loader2 className="animate-spin text-orange-600 w-8 h-8" />
			</div>
		);

	return (
		<div className="max-w-7xl mx-auto px-4 py-10">
			<h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
			{orders.length === 0 ? (
				<div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
					<p className="text-gray-500 mb-4 text-lg">
						Bạn chưa có đơn hàng nào.
					</p>
					<Link
						to="/shop"
						className="inline-block bg-orange-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-700 transition">
						Bắt đầu mua sắm ngay
					</Link>
				</div>
			) : (
				<div className="overflow-x-auto rounded-lg border shadow-sm">
					<table className="min-w-full bg-white">
						<thead className="bg-gray-100 border-b">
							<tr>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">
									Mã đơn
								</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">
									Ngày đặt
								</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">
									Tổng tiền
								</th>
								<th className="py-3 px-4 text-left font-semibold text-gray-700">
									Trạng thái
								</th>
								<th className="py-3 px-4 text-center font-semibold text-gray-700">
									Hành động
								</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{orders.map((order) => (
								<tr
									key={order._id}
									className="hover:bg-gray-50 transition">
									<td className="py-4 px-4 font-mono text-sm text-gray-600">
										#
										{order._id
											.substring(0, 8)
											.toUpperCase()}
									</td>
									<td className="py-4 px-4 text-sm text-gray-600">
										{new Date(
											order.createdAt,
										).toLocaleDateString("vi-VN")}
									</td>
									<td className="py-4 px-4 font-bold text-orange-600">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(order.totalPrice)}
									</td>
									<td className="py-4 px-4">
										<span
											className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                      ${
							order.status === "Delivered"
								? "bg-green-100 text-green-700"
								: order.status === "Cancelled"
									? "bg-red-100 text-red-700"
									: order.status === "Shipping"
										? "bg-blue-100 text-blue-700"
										: "bg-yellow-100 text-yellow-700"
						}`}>
											{order.status}
										</span>
									</td>
									<td className="py-4 px-4 flex items-center justify-center space-x-3">
										<Link
											to={`/order/${order._id}`}
											className="text-blue-600 hover:text-blue-800 text-sm font-medium transition">
											Xem chi tiết
										</Link>

										{/* CHỈ HIỂN THỊ NÚT HỦY KHI ĐƠN HÀNG LÀ PENDING */}
										{order.status === "Pending" && (
											<button
												onClick={() =>
													handleCancelOrder(order._id)
												}
												className="text-red-500 hover:text-red-700 text-sm font-medium transition ml-3 border-l pl-3 border-gray-300">
												Hủy đơn
											</button>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
};

export default OrderHistory;
