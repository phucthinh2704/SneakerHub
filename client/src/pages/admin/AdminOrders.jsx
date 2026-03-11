import React, { useEffect, useState, useRef } from "react";
import { apiGetAllOrdersForAdmin, apiUpdateOrderStatus } from "../../api/admin";
import Pagination from "../../components/Pagination";
import {
	Loader2,
	Search,
	Filter,
	Printer,
	X,
	ChevronDown,
	ShoppingBag,
} from "lucide-react";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";

/* ─── Shared styles ───────────────────────────────────────────────────────── */
const INP =
	"w-full bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl px-4 py-2.5 text-sm text-[#2d2418] placeholder-[#c0a890] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15 transition";

const STATUS_CFG = {
	Pending: {
		cls: "bg-amber-50  text-amber-700  border-amber-200",
		dot: "bg-amber-400",
	},
	Processing: {
		cls: "bg-blue-50   text-blue-700   border-blue-200",
		dot: "bg-blue-500",
	},
	Shipping: {
		cls: "bg-sky-50    text-sky-700    border-sky-200",
		dot: "bg-sky-500",
	},
	Delivered: {
		cls: "bg-green-50  text-green-700  border-green-200",
		dot: "bg-green-500",
	},
	Cancelled: {
		cls: "bg-red-50    text-red-600    border-red-200",
		dot: "bg-red-400",
	},
};

const PAYMENT_LABEL = {
	COD: "Tiền mặt (COD)",
	Paypal: "PayPal",
	Banking: "Chuyển khoản",
};

const fmt = (n) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(n);
const fmtN = (n) => new Intl.NumberFormat("vi-VN").format(n);

/* ─── Invoice Template (Khổ giấy A4 Chuẩn) ────────────────────────────────── */
const InvoiceTemplate = React.forwardRef(({ order }, ref) => {
	if (!order) return null;
	return (
		<div
			ref={ref}
			className="invoice-print-container text-gray-900 bg-white"
			style={{
				fontFamily: "'DM Sans', Arial, sans-serif",
				padding: "20mm", // Lề an toàn cho khổ giấy A4
				width: "210mm", // Chiều rộng A4 chuẩn
				minHeight: "297mm", // Chiều cao A4 chuẩn
				margin: "0 auto",
				boxSizing: "border-box",
				boxShadow: "0 0 10px rgba(0,0,0,0.1)", // Bóng đổ nhẹ để dễ nhìn trên màn hình
			}}>
			{/* Header */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
					paddingBottom: "24px",
					marginBottom: "24px",
					borderBottom: "2px solid #c2784d",
				}}>
				<div>
					<h1
						style={{
							fontFamily: "'Syne', sans-serif",
							fontSize: "28px",
							fontWeight: 800,
							color: "#c2784d",
							letterSpacing: "-.02em",
							margin: 0,
						}}>
						SOLESTORE
					</h1>
					<p
						style={{
							fontSize: "13px",
							color: "#7a6a5a",
							marginTop: "8px",
							marginBottom: "2px",
						}}>
						123 Nguyễn Văn Linh, Phường Tân An, TP. Cần Thơ
					</p>
					<p
						style={{
							fontSize: "13px",
							color: "#7a6a5a",
							marginBottom: "2px",
						}}>
						Hotline: 1900 123 456 · 0909 123 456
					</p>
					<p
						style={{
							fontSize: "13px",
							color: "#7a6a5a",
							margin: 0,
						}}>
						support@solestore.vn
					</p>
				</div>
				<div style={{ textAlign: "right" }}>
					<p
						style={{
							fontFamily: "'Syne', sans-serif",
							fontSize: "22px",
							fontWeight: 700,
							color: "#1a1914",
							letterSpacing: ".1em",
							textTransform: "uppercase",
							margin: 0,
						}}>
						Hóa Đơn
					</p>
					<p
						style={{
							fontSize: "12px",
							fontFamily: "monospace",
							color: "#7a6a5a",
							marginTop: "8px",
							marginBottom: "2px",
						}}>
						Mã đơn:{" "}
						<strong style={{ color: "#1a1914" }}>
							#{order._id.substring(0, 8).toUpperCase()}
						</strong>
					</p>
					<p
						style={{
							fontSize: "12px",
							color: "#7a6a5a",
							margin: 0,
						}}>
						Ngày:{" "}
						{new Date(order.createdAt).toLocaleDateString("vi-VN")}
					</p>
				</div>
			</div>

			{/* Customer */}
			<div
				style={{
					marginBottom: "24px",
					padding: "20px",
					background: "#fdf8f4",
					borderRadius: "8px",
					border: "1px solid #f0e5d8",
				}}>
				<p
					style={{
						fontSize: "12px",
						fontWeight: 700,
						letterSpacing: ".15em",
						textTransform: "uppercase",
						color: "#c2784d",
						margin: "0 0 12px 0",
					}}>
					Thông tin giao hàng
				</p>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						fontSize: "13px",
						color: "#3a2818",
						gap: "12px 0",
					}}>
					<div style={{ width: "50%" }}>
						<span style={{ color: "#9a7a5a" }}>Khách hàng: </span>
						<strong>{order.shippingAddress?.fullName}</strong>
					</div>
					<div style={{ width: "50%" }}>
						<span style={{ color: "#9a7a5a" }}>Thanh toán: </span>
						<strong>
							{PAYMENT_LABEL[order.paymentMethod] ||
								order.paymentMethod}
						</strong>
					</div>
					<div style={{ width: "50%" }}>
						<span style={{ color: "#9a7a5a" }}>Điện thoại: </span>
						{order.shippingAddress?.phone}
					</div>
					<div style={{ width: "50%" }}>
						<span style={{ color: "#9a7a5a" }}>Địa chỉ: </span>
						{order.shippingAddress?.address}
					</div>
				</div>
			</div>

			{/* Items table */}
			<table
				style={{
					width: "100%",
					borderCollapse: "collapse",
					fontSize: "13px",
					marginBottom: "24px",
				}}>
				<thead>
					<tr style={{ background: "#1a1914", color: "white" }}>
						{["STT", "Sản phẩm", "SL", "Đơn giá", "Thành tiền"].map(
							(h, i) => (
								<th
									key={h}
									style={{
										padding: "12px",
										fontWeight: 600,
										textAlign:
											i >= 2
												? "center"
												: i === 4
													? "right"
													: "left",
										borderBottom: "none",
									}}>
									{h}
								</th>
							),
						)}
					</tr>
				</thead>
				<tbody>
					{order.orderItems?.map((item, i) => (
						<tr
							key={i}
							style={{
								borderBottom: "1px solid #f0e5d8",
								background: i % 2 === 0 ? "#fff" : "#fdf9f6",
							}}>
							<td
								style={{
									padding: "12px",
									textAlign: "center",
									color: "#9a7a5a",
								}}>
								{i + 1}
							</td>
							<td style={{ padding: "12px" }}>
								<strong style={{ color: "#1a1914" }}>
									{item.name}
								</strong>
								<p
									style={{
										fontSize: "11px",
										color: "#9a7a5a",
										margin: "4px 0 0 0",
									}}>
									Màu: {item.selectedColor} · Size:{" "}
									{item.selectedSize}
								</p>
							</td>
							<td
								style={{
									padding: "12px",
									textAlign: "center",
									fontWeight: 700,
								}}>
								{item.qty}
							</td>
							<td
								style={{
									padding: "12px",
									textAlign: "right",
									color: "#5a4a3a",
								}}>
								{fmtN(item.price)}đ
							</td>
							<td
								style={{
									padding: "12px",
									textAlign: "right",
									fontWeight: 700,
									color: "#c2784d",
								}}>
								{fmtN(item.price * item.qty)}đ
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* Totals */}
			<div
				style={{
					display: "flex",
					justifyContent: "flex-end",
					marginBottom: "40px",
				}}>
				<div style={{ width: "280px", fontSize: "13px" }}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "8px 0",
							color: "#7a6a5a",
							borderBottom: "1px solid #f0e5d8",
						}}>
						<span>Tạm tính</span>
						<span>
							{fmtN(order.itemsPrice || order.totalPrice)}đ
						</span>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "8px 0",
							color: "#7a6a5a",
							borderBottom: "1px solid #f0e5d8",
						}}>
						<span>Phí vận chuyển</span>
						<span style={{ color: "#4caf50", fontWeight: 600 }}>
							{order.shippingPrice === 0
								? "Miễn phí"
								: `${fmtN(order.shippingPrice)}đ`}
						</span>
					</div>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							padding: "12px 0 8px",
							borderTop: "2px solid #c2784d",
							marginTop: "4px",
						}}>
						<span
							style={{
								fontWeight: 700,
								color: "#1a1914",
								fontSize: "15px",
							}}>
							Tổng thanh toán
						</span>
						<span
							style={{
								fontWeight: 800,
								color: "#c2784d",
								fontSize: "18px",
								fontFamily: "'Syne',sans-serif",
							}}>
							{fmt(order.totalPrice)}
						</span>
					</div>
				</div>
			</div>

			{/* Signatures */}
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					textAlign: "center",
					fontSize: "13px",
					marginTop: "60px",
					paddingTop: "30px",
					borderTop: "1px dashed #e0d0c0",
					pageBreakInside: "avoid",
				}}>
				<div>
					<p style={{ fontWeight: 700, color: "#1a1914", margin: 0 }}>
						Người mua hàng
					</p>
					<p
						style={{
							color: "#9a7a5a",
							marginTop: "80px",
							fontStyle: "italic",
							margin: "80px 0 0 0",
						}}>
						(Ký, ghi rõ họ tên)
					</p>
				</div>
				<div>
					<p style={{ fontWeight: 700, color: "#1a1914", margin: 0 }}>
						Người bán hàng
					</p>
					<p
						style={{
							color: "#9a7a5a",
							marginTop: "80px",
							fontStyle: "italic",
							margin: "80px 0 0 0",
						}}>
						SoleStore
					</p>
				</div>
			</div>
		</div>
	);
});

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AdminOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterStatus, setFilterStatus] = useState("All");
	const [sort, setSort] = useState("newest");
	const [page, setPage] = useState(1);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showInvoice, setShowInvoice] = useState(false);
	const invoiceRef = useRef(null);
	const ITEMS_PER_PAGE = 8;

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

	// Sửa lỗi hàm In: Truyền trực tiếp options tương thích với cả react-to-print v2 và v3
	const handlePrint = useReactToPrint({
		content: () => invoiceRef.current, // Dành cho v2
		contentRef: invoiceRef, // Dành cho v3+
		documentTitle: selectedOrder
			? `HoaDon_${selectedOrder._id.substring(0, 8)}`
			: "HoaDon",
		onPrintError: () => toast.error("Trình duyệt từ chối lệnh in"),
	});

	const openInvoice = (order) => {
		setSelectedOrder(order);
		setShowInvoice(true);
	};

	/* Client-side filter/sort/page */
	let list = [...orders];
	if (searchTerm)
		list = list.filter(
			(o) =>
				o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(o.shippingAddress?.fullName || "")
					.toLowerCase()
					.includes(searchTerm.toLowerCase()),
		);
	if (filterStatus !== "All")
		list = list.filter((o) => o.status === filterStatus);
	list.sort((a, b) => {
		if (sort === "newest")
			return new Date(b.createdAt) - new Date(a.createdAt);
		if (sort === "oldest")
			return new Date(a.createdAt) - new Date(b.createdAt);
		if (sort === "price_desc") return b.totalPrice - a.totalPrice;
		if (sort === "price_asc") return a.totalPrice - b.totalPrice;
		return 0;
	});
	const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE);
	const paginatedOrders = list.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE,
	);

	return (
		<>
			<style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
        .ao-root    { font-family:'DM Sans',sans-serif; }
        .ao-heading { font-family:'Syne',sans-serif; }
        .ao-row     { transition: background .15s; }
        .ao-row:hover td { background: #fdf9f6; }
        .ao-fade    { animation: aoFadeUp .35s ease both; }
        @keyframes aoFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
        
        /* ── CSS quan trọng để in đúng A4 & hiện màu nền ── */
        @media print {
          @page {
            size: A4 portrait;
            margin: 0 !important; /* Xóa margin mặc định của trình duyệt để không bị thu nhỏ */
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
          }
          .invoice-print-container {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 20mm !important; /* Tạo lề bên trong thay vì dùng @page margin */
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          /* Ẩn thanh cuộn */
          ::-webkit-scrollbar { display: none; }
        }
      `}</style>

			<div className="ao-root ao-fade h-full flex flex-col">
				{/* Header */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5 shrink-0">
					<div>
						<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-0.5">
							SoleStore Admin
						</p>
						<h2 className="ao-heading text-[#1a1914] text-2xl font-bold">
							Quản lý Đơn hàng
						</h2>
					</div>
					<div className="flex items-center gap-2 bg-[#fff3eb] border border-[#f0ddd0] rounded-xl px-3.5 py-2">
						<ShoppingBag
							size={14}
							className="text-[#c2784d]"
						/>
						<span className="text-xs font-bold text-[#c2784d]">
							{orders.length} đơn hàng
						</span>
					</div>
				</div>

				<div
					className="bg-white border border-[#f0e5d8] rounded-2xl flex flex-col flex-1 overflow-hidden"
					style={{ boxShadow: "0 2px 20px rgba(194,120,77,.07)" }}>
					{/* Filters */}
					<div className="px-5 py-4 border-b border-[#f5ede4] flex flex-col md:flex-row gap-3 shrink-0">
						<div className="relative flex-1">
							<Search
								className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c0a890]"
								size={15}
							/>
							<input
								type="text"
								placeholder="Tìm mã đơn, tên khách..."
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setPage(1);
								}}
								className={`${INP} pl-10`}
							/>
						</div>
						<div className="relative">
							<Filter
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c0a890]"
								size={13}
							/>
							<select
								value={filterStatus}
								onChange={(e) => {
									setFilterStatus(e.target.value);
									setPage(1);
								}}
								className={`${INP} appearance-none pl-9 pr-8 w-full cursor-pointer`}>
								<option value="All">Tất cả trạng thái</option>
								{STATUS_OPTIONS.map((st) => (
									<option
										key={st}
										value={st}>
										{st}
									</option>
								))}
							</select>
							<ChevronDown
								size={12}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08070] pointer-events-none"
							/>
						</div>
						<div className="relative">
							<select
								value={sort}
								onChange={(e) => {
									setSort(e.target.value);
									setPage(1);
								}}
								className={`${INP} appearance-none pr-8 w-full cursor-pointer`}>
								<option value="newest">Mới nhất</option>
								<option value="oldest">Cũ nhất</option>
								<option value="price_desc">
									Giá trị cao nhất
								</option>
								<option value="price_asc">
									Giá trị thấp nhất
								</option>
							</select>
							<ChevronDown
								size={12}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08070] pointer-events-none"
							/>
						</div>
					</div>

					{/* Table */}
					<div className="overflow-x-auto flex-1">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-[#fdf8f4] border-b border-[#f5ede4]">
									{[
										"Mã đơn",
										"Khách hàng",
										"Ngày đặt",
										"Tổng tiền",
										"Trạng thái",
										"In HĐ",
									].map((h, i) => (
										<th
											key={h}
											className={`px-5 py-3.5 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] ${i >= 4 ? "text-center" : "text-left"}`}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan="6"
											className="text-center py-16">
											<Loader2
												className="animate-spin inline text-[#c2784d]"
												size={28}
											/>
										</td>
									</tr>
								) : (
									paginatedOrders.map((order) => {
										const scfg =
											STATUS_CFG[order.status] ||
											STATUS_CFG.Pending;
										const locked =
											order.status === "Delivered" ||
											order.status === "Cancelled";
										return (
											<tr
												key={order._id}
												className="ao-row border-b border-[#f8f0e8] last:border-0">
												<td className="px-5 py-4">
													<span className="font-mono text-xs font-bold text-[#5a4a3a]">
														#
														{order._id
															.substring(0, 8)
															.toUpperCase()}
													</span>
												</td>
												<td className="px-5 py-4">
													<p className="font-semibold text-[#1a1914] text-sm">
														{
															order
																.shippingAddress
																?.fullName
														}
													</p>
													<p className="text-[11px] text-[#a08070] mt-0.5">
														{
															order
																.shippingAddress
																?.phone
														}
													</p>
												</td>
												<td className="px-5 py-4 text-xs text-[#9a8878]">
													{new Date(
														order.createdAt,
													).toLocaleDateString(
														"vi-VN",
													)}
												</td>
												<td className="px-5 py-4">
													<span className="ao-heading font-bold text-[#c2784d] text-sm">
														{fmt(order.totalPrice)}
													</span>
												</td>
												<td className="px-5 py-4 text-center">
													<div className="relative inline-block text-left">
														<select
															value={order.status}
															onChange={(e) =>
																handleStatusChange(
																	order._id,
																	e.target
																		.value,
																)
															}
															disabled={locked}
															className={`appearance-none text-[10px] font-bold pl-5 pr-6 py-1.5 rounded-full border cursor-pointer outline-none transition
                              ${scfg.cls} ${locked ? "opacity-70 cursor-not-allowed" : "hover:opacity-80"}`}>
															{STATUS_OPTIONS.map(
																(st) => (
																	<option
																		key={st}
																		value={
																			st
																		}>
																		{st}
																	</option>
																),
															)}
														</select>
														<span
															className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${scfg.dot} pointer-events-none`}
														/>
													</div>
												</td>
												<td className="px-5 py-4 text-center">
													<button
														onClick={() =>
															openInvoice(order)
														}
														title="Xem và in hóa đơn"
														className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#fdf8f4] text-[#8a7060] border border-[#e8d8cc] rounded-lg hover:bg-[#fff3eb] hover:text-[#c2784d] hover:border-[#f0ddd0] transition">
														<Printer size={13} />
													</button>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
						{paginatedOrders.length === 0 && !loading && (
							<div className="text-center py-14">
								<ShoppingBag
									size={28}
									className="text-[#e0d0c0] mx-auto mb-3"
								/>
								<p className="text-[#b0a090] text-sm">
									Không tìm thấy đơn hàng nào.
								</p>
							</div>
						)}
					</div>

					<div className="px-5 py-4 border-t border-[#f5ede4] shrink-0">
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</div>
				</div>

				{/* ── Fixed Modal Invoice ── */}
				{showInvoice && selectedOrder && (
					<div className="fixed inset-0 z-200 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 sm:p-6">
						{/* Click ra ngoài để đóng */}
						<div
							className="absolute inset-0 cursor-pointer"
							onClick={() => setShowInvoice(false)}
						/>

						{/* Panel Modal */}
						<div
							className="relative z-10 flex flex-col w-full max-w-4xl bg-white rounded-2xl overflow-hidden h-full max-h-[92vh]"
							style={{
								boxShadow: "0 32px 100px rgba(0,0,0,.35)",
								animation: "aoFadeUp .2s ease",
							}}>
							{/* Top bar */}
							<div
								className="shrink-0 px-6 py-4 border-b border-[#f0e5d8] flex items-center justify-between"
								style={{
									background:
										"linear-gradient(135deg,#fdf8f4,#fffcf9)",
								}}>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-lg bg-[#c2784d] flex items-center justify-center shrink-0">
										<Printer
											size={14}
											className="text-white"
										/>
									</div>
									<div>
										<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] leading-none mb-1">
											SoleStore Admin
										</p>
										<h3 className="ao-heading text-[#1a1914] font-bold text-sm">
											Xem trước hóa đơn
										</h3>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<button
										onClick={handlePrint}
										className="inline-flex items-center gap-2 bg-[#c2784d] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-[#a05e38] transition shadow-md">
										<Printer size={14} /> In ngay
									</button>
									<button
										onClick={() => setShowInvoice(false)}
										className="w-9 h-9 rounded-xl bg-[#f5ede4] text-[#8a7060] hover:bg-[#ffe0c8] hover:text-[#c2784d] flex items-center justify-center transition">
										<X size={16} />
									</button>
								</div>
							</div>

							{/* Scrollable invoice area (Khu vực cuộn của hóa đơn) */}
							<div className="flex-1 overflow-y-auto py-8 bg-[#e8e0d8] flex justify-center custom-scrollbar">
								{/* Component in ra. Nó sẽ luôn giữ width là 210mm (chuẩn A4). 
                  Nhờ max-w-4xl của Modal (rộng 896px), tờ A4 (~794px) sẽ nằm lọt lòng tuyệt đẹp.
                */}
								<InvoiceTemplate
									ref={invoiceRef}
									order={selectedOrder}
								/>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default AdminOrders;
