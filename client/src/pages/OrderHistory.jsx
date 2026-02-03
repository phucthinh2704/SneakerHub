import React, { useEffect, useState } from "react";
import { apiGetMyOrders } from "../api/order";
import { Loader2 } from "lucide-react";

const OrderHistory = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await apiGetMyOrders();
				if (res.success) setOrders(res.result);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	if (loading)
		return (
			<div className="flex justify-center p-10">
				<Loader2 className="animate-spin" />
			</div>
		);

	return (
		<div className="max-w-7xl mx-auto px-4 py-10">
			<h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
			{orders.length === 0 ? (
				<p>Bạn chưa có đơn hàng nào.</p>
			) : (
				<div className="overflow-x-auto">
					<table className="min-w-full bg-white border">
						<thead className="bg-gray-100">
							<tr>
								<th className="py-3 px-4 text-left">Mã đơn</th>
								<th className="py-3 px-4 text-left">
									Ngày đặt
								</th>
								<th className="py-3 px-4 text-left">
									Tổng tiền
								</th>
								<th className="py-3 px-4 text-left">
									Trạng thái
								</th>
								<th className="py-3 px-4 text-left">
									Chi tiết
								</th>
							</tr>
						</thead>
						<tbody>
							{orders.map((order) => (
								<tr
									key={order._id}
									className="border-b hover:bg-gray-50">
									<td className="py-3 px-4 font-mono text-sm">
										{order._id.substring(0, 10)}...
									</td>
									<td className="py-3 px-4 text-sm">
										{new Date(
											order.createdAt,
										).toLocaleDateString("vi-VN")}
									</td>
									<td className="py-3 px-4 font-bold text-orange-600">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(order.totalPrice)}
									</td>
									<td className="py-3 px-4">
										<span
											className={`px-2 py-1 rounded text-xs font-bold 
                      ${
							order.status === "Delivered"
								? "bg-green-100 text-green-800"
								: order.status === "Cancelled"
									? "bg-red-100 text-red-800"
									: "bg-yellow-100 text-yellow-800"
						}`}>
											{order.status}
										</span>
									</td>
									<td className="py-3 px-4">
										{/* Bạn có thể tạo thêm trang OrderDetail nếu muốn */}
										<button className="text-blue-600 hover:underline text-sm">
											Xem
										</button>
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
