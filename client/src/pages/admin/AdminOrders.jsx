import React, { useEffect, useState, useRef } from "react";
import { apiGetAllOrdersForAdmin, apiUpdateOrderStatus } from "../../api/admin";
import Pagination from "../../components/Pagination";
import { Loader2, Search, Filter, Printer, X } from "lucide-react";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

// ==========================================
// 1. COMPONENT HÓA ĐƠN (INVOICE TEMPLATE)
// Dùng forwardRef để thư viện có thể "chụp" và in component này
// ==========================================
const InvoiceTemplate = React.forwardRef(({ order }, ref) => {
	if (!order) return null;

	return (
		<div
			ref={ref}
			className="p-10 bg-white text-gray-900 w-full"
			style={{ fontFamily: "Arial, sans-serif" }}>
			{/* Header Hóa Đơn */}
			<div className="flex justify-between items-start border-b-2 border-gray-800 pb-6 mb-6">
				<div>
					<h1 className="text-3xl font-black text-orange-600 tracking-tight">
						SHOE STORE
					</h1>
					<p className="text-sm text-gray-600 mt-2">
						123 Nguyễn Văn Linh, Phường Tân An, TP. Cần Thơ
					</p>
					<p className="text-sm text-gray-600">
						Điện thoại: 1900 123 456 - 0909 123 456
					</p>
					<p className="text-sm text-gray-600">
						Email: support@shoestore.vn
					</p>
				</div>
				<div className="text-right">
					<h2 className="text-2xl font-bold uppercase text-gray-800 tracking-widest">
						Hóa Đơn
					</h2>
					<p className="text-sm font-mono mt-2 text-gray-600">
						Mã đơn:{" "}
						<span className="font-bold text-gray-900">
							#{order._id.substring(0, 8).toUpperCase()}
						</span>
					</p>
					<p className="text-sm text-gray-600">
						Ngày đặt:{" "}
						{new Date(order.createdAt).toLocaleDateString("vi-VN")}
					</p>
				</div>
			</div>

			{/* Thông tin Khách Hàng */}
			<div className="mb-8">
				<h3 className="font-bold text-gray-800 mb-3 text-lg border-b pb-2">
					Thông tin giao hàng
				</h3>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="mb-1">
							<span className="font-semibold text-gray-600">
								Khách hàng:
							</span>{" "}
							{order.shippingAddress?.fullName}
						</p>
						<p className="mb-1">
							<span className="font-semibold text-gray-600">
								Số điện thoại:
							</span>{" "}
							{order.shippingAddress?.phone}
						</p>
					</div>
					<div>
						<p className="mb-1">
							<span className="font-semibold text-gray-600">
								Địa chỉ:
							</span>{" "}
							{order.shippingAddress?.address}
						</p>
						<p className="mb-1">
							<span className="font-semibold text-gray-600">
								Thanh toán:
							</span>{" "}
							{order.paymentMethod === "COD"
								? "Thanh toán tiền mặt (COD)"
								: "Chuyển khoản ngân hàng"}
						</p>
					</div>
				</div>
			</div>

			{/* Bảng Sản Phẩm */}
			<table className="w-full text-left text-sm mb-8 border-collapse">
				<thead>
					<tr className="bg-gray-100 text-gray-800">
						<th className="border border-gray-300 p-3 font-bold w-12 text-center">
							STT
						</th>
						<th className="border border-gray-300 p-3 font-bold">
							Sản phẩm
						</th>
						<th className="border border-gray-300 p-3 font-bold w-20 text-center">
							SL
						</th>
						<th className="border border-gray-300 p-3 font-bold w-32 text-right">
							Đơn giá
						</th>
						<th className="border border-gray-300 p-3 font-bold w-32 text-right">
							Thành tiền
						</th>
					</tr>
				</thead>
				<tbody>
					{order.orderItems?.map((item, index) => (
						<tr key={index}>
							<td className="border border-gray-300 p-3 text-center">
								{index + 1}
							</td>
							<td className="border border-gray-300 p-3">
								<p className="font-bold text-gray-900">
									{item.name}
								</p>
								<p className="text-xs text-gray-500 mt-1">
									Màu: {item.selectedColor || item.color} |
									Size: {item.selectedSize || item.size}
								</p>
							</td>
							<td className="border border-gray-300 p-3 text-center font-bold">
								{item.qty}
							</td>
							<td className="border border-gray-300 p-3 text-right">
								{new Intl.NumberFormat("vi-VN").format(
									item.price,
								)}
								đ
							</td>
							<td className="border border-gray-300 p-3 text-right font-bold">
								{new Intl.NumberFormat("vi-VN").format(
									item.price * item.qty,
								)}
								đ
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Tổng kết tiền */}
			<div className="flex justify-end mb-12">
				<div className="w-1/2">
					<div className="flex justify-between py-2 text-sm text-gray-600">
						<span>Tạm tính:</span>
						<span>
							{new Intl.NumberFormat("vi-VN").format(
								order.itemsPrice || order.totalPrice,
							)}
							đ
						</span>
					</div>
					<div className="flex justify-between py-2 text-sm text-gray-600">
						<span>Phí vận chuyển:</span>
						<span>Miễn phí</span>
					</div>
					<div className="flex justify-between py-3 border-t-2 border-gray-800 mt-2">
						<span className="font-bold text-lg text-gray-900">
							Tổng thanh toán:
						</span>
						<span className="font-bold text-xl text-gray-900">
							{new Intl.NumberFormat("vi-VN", {
								style: "currency",
								currency: "VND",
							}).format(order.totalPrice)}
						</span>
					</div>
				</div>
			</div>

			{/* Chữ ký */}
			<div className="grid grid-cols-2 text-center text-sm mt-16 pt-8">
				<div>
					<p className="font-bold text-gray-800 mb-16">
						Người mua hàng
					</p>
					<p className="text-gray-500 italic">(Ký, ghi rõ họ tên)</p>
				</div>
				<div>
					<p className="font-bold text-gray-800 mb-16">
						Người bán hàng
					</p>
					<p className="text-gray-500 italic">Shoe Store</p>
				</div>
			</div>
		</div>
	);
});

// ==========================================
// 2. MAIN COMPONENT (QUẢN LÝ ĐƠN HÀNG)
// ==========================================
const AdminOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("All");
	const [sort, setSort] = useState("newest");
	const [page, setPage] = useState(1);
	const ITEMS_PER_PAGE = 8;

	// States hỗ trợ In Hóa Đơn
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showInvoiceModal, setShowInvoiceModal] = useState(false);
	const invoiceRef = useRef(null);

	const STATUS_OPTIONS = [
		"Pending",
		"Processing",
		"Shipping",
		"Delivered",
		"Cancelled",
	];

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const res = await apiGetAllOrdersForAdmin();
			if (res.success) setOrders(res.result);
		} catch (error) {
			console.error(error);
			toast.error("Lỗi lấy đơn hàng");
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (orderId, newStatus) => {
		try {
			const res = await apiUpdateOrderStatus(orderId, newStatus);
			if (res.success) {
				toast.success("Cập nhật thành công");
				setOrders(
					orders.map((o) =>
						o._id === orderId ? { ...o, status: newStatus } : o,
					),
				);
			}
		} catch (error) {
			console.error(error);
			toast.error("Cập nhật thất bại");
		}
	};

	// Kích hoạt cửa sổ Print của Trình duyệt
	const handlePrint = useReactToPrint({
		content: () => invoiceRef.current,
		documentTitle: selectedOrder
			? `Hoa_Don_${selectedOrder._id.substring(0, 8)}`
			: "Hoa_Don",
	});

	const openInvoice = (order) => {
		setSelectedOrder(order);
		setShowInvoiceModal(true);
	};

	// CLIENT-SIDE FILTER & SORT
	let processedOrders = [...orders];

	if (searchTerm) {
		processedOrders = processedOrders.filter(
			(o) =>
				o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(o.shippingAddress?.fullName || "")
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
		);
	}

	if (filterStatus !== "All") {
		processedOrders = processedOrders.filter(
			(o) => o.status === filterStatus,
		);
	}

	processedOrders.sort((a, b) => {
		if (sort === "newest")
			return new Date(b.createdAt) - new Date(a.createdAt);
		if (sort === "oldest")
			return new Date(a.createdAt) - new Date(b.createdAt);
		if (sort === "price_desc") return b.totalPrice - a.totalPrice;
		if (sort === "price_asc") return a.totalPrice - b.totalPrice;
		return 0;
	});

	const totalPages = Math.ceil(processedOrders.length / ITEMS_PER_PAGE);
	const paginatedOrders = processedOrders.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE,
	);

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
			{/* TOOLBAR */}
			<div className="p-5 border-b border-gray-100 space-y-4">
				<h2 className="text-xl font-bold text-gray-800">
					Quản lý Đơn hàng
				</h2>

				<div className="flex flex-col md:flex-row gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
					<div className="relative flex-1">
						<Search
							className="absolute left-3 top-2.5 text-gray-400"
							size={18}
						/>
						<input
							type="text"
							placeholder="Tìm mã đơn, tên khách..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setPage(1);
							}}
							className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
						/>
					</div>

					<div className="flex flex-1 gap-3">
						<div className="relative flex-1">
							<Filter
								className="absolute left-3 top-2.5 text-gray-400"
								size={16}
							/>
							<select
								value={filterStatus}
								onChange={(e) => {
									setFilterStatus(e.target.value);
									setPage(1);
								}}
								className="w-full pl-9 pr-2 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-orange-500 bg-white appearance-none">
								<option value="All">Tất cả Trạng thái</option>
								{STATUS_OPTIONS.map((st) => (
									<option
										key={st}
										value={st}>
										{st}
									</option>
								))}
							</select>
						</div>

						<select
							value={sort}
							onChange={(e) => {
								setSort(e.target.value);
								setPage(1);
							}}
							className="flex-1 py-2 px-3 text-sm border rounded-md outline-none focus:ring-2 focus:ring-orange-500 bg-white">
							<option value="newest">Mới nhất</option>
							<option value="oldest">Cũ nhất</option>
							<option value="price_desc">Giá trị cao nhất</option>
							<option value="price_asc">Giá trị thấp nhất</option>
						</select>
					</div>
				</div>
			</div>

			{/* BẢNG DỮ LIỆU */}
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm whitespace-nowrap">
					<thead className="bg-gray-50 text-gray-600 font-medium border-b">
						<tr>
							<th className="px-6 py-4">Mã Đơn</th>
							<th className="px-6 py-4">Khách Hàng</th>
							<th className="px-6 py-4">Ngày Đặt</th>
							<th className="px-6 py-4">Tổng Tiền</th>
							<th className="px-6 py-4">Trạng Thái</th>
							<th className="px-6 py-4 text-center">In HĐ</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{loading ? (
							<tr>
								<td
									colSpan="6"
									className="text-center py-10">
									<Loader2 className="animate-spin inline text-orange-600" />
								</td>
							</tr>
						) : (
							paginatedOrders.map((order) => (
								<tr
									key={order._id}
									className="hover:bg-gray-50 transition">
									<td className="px-6 py-4 font-mono font-medium text-gray-900">
										#
										{order._id
											.substring(0, 8)
											.toUpperCase()}
									</td>
									<td className="px-6 py-4">
										<p className="font-bold text-gray-900">
											{order.shippingAddress?.fullName}
										</p>
										<p className="text-xs text-gray-500">
											{order.shippingAddress?.phone}
										</p>
									</td>
									<td className="px-6 py-4 text-gray-600">
										{new Date(
											order.createdAt,
										).toLocaleDateString("vi-VN")}
									</td>
									<td className="px-6 py-4 font-bold text-orange-600">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(order.totalPrice)}
									</td>
									<td className="px-6 py-4">
										<select
											value={order.status}
											onChange={(e) =>
												handleStatusChange(
													order._id,
													e.target.value,
												)
											}
											disabled={
												order.status === "Delivered" ||
												order.status === "Cancelled"
											}
											className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none outline-none cursor-pointer
                      ${
							order.status === "Delivered"
								? "bg-green-100 text-green-700"
								: order.status === "Cancelled"
									? "bg-red-100 text-red-700"
									: order.status === "Shipping"
										? "bg-blue-100 text-blue-700"
										: "bg-yellow-100 text-yellow-700"
						}
                      ${order.status === "Delivered" || order.status === "Cancelled" ? "opacity-70 cursor-not-allowed" : ""}  
                    `}>
											{STATUS_OPTIONS.map((st) => (
												<option
													key={st}
													value={st}>
													{st}
												</option>
											))}
										</select>
									</td>

									{/* CỘT NÚT IN HÓA ĐƠN */}
									<td className="px-6 py-4 text-center">
										<button
											onClick={() => openInvoice(order)}
											title="Xem và In hóa đơn PDF"
											className="text-gray-500 hover:text-orange-600 bg-gray-100 hover:bg-orange-50 p-2 rounded-lg transition">
											<Printer size={18} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
				{paginatedOrders.length === 0 && !loading && (
					<div className="text-center py-10 text-gray-500">
						Không tìm thấy đơn hàng.
					</div>
				)}
			</div>

			<div className="p-4 border-t border-gray-100">
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>

			{/* 3. MODAL XEM TRƯỚC VÀ IN HÓA ĐƠN */}
			{showInvoiceModal && selectedOrder && (
				<div className="fixed inset-0 z-100 flex items-center justify-center bg-black bg-opacity-60 p-4 backdrop-blur-sm">
					<div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
						{/* Modal Header */}
						<div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
							<h3 className="font-bold text-lg text-gray-800">
								Xem trước Hóa đơn
							</h3>
							<div className="flex items-center space-x-3">
								<button
									onClick={handlePrint}
									className="flex items-center bg-orange-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-orange-700 transition shadow-sm">
									<Printer
										size={18}
										className="mr-2"
									/>{" "}
									Xuất File / In
								</button>
								<button
									onClick={() => setShowInvoiceModal(false)}
									className="text-gray-500 hover:bg-gray-200 p-2 rounded-lg transition">
									<X size={20} />
								</button>
							</div>
						</div>

						{/* Modal Body (Khu vực cuộn chứa Form in) */}
						<div className="overflow-y-auto p-6 bg-gray-200 flex justify-center custom-scrollbar">
							{/* Trang giấy A4 mô phỏng */}
							<div className="bg-white shadow-md w-full max-w-2xl">
								{/* Truyền ref vào đây để react-to-print lấy đúng nội dung thẻ này */}
								<InvoiceTemplate
									ref={invoiceRef}
									order={selectedOrder}
								/>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminOrders;
