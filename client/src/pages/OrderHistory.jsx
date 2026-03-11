import { useEffect, useState } from "react";
import { apiGetMyOrders, apiCancelMyOrder } from "../api/order";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	Package,
	ArrowRight,
	ShoppingBag,
	MapPin,
	CreditCard,
	ChevronDown,
	ChevronUp,
	Truck,
	Tag,
} from "lucide-react";

const Spinner = () => (
	<svg
		className="animate-spin"
		width="32"
		height="32"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#c2784d"
		strokeWidth="2">
		<circle cx="12" cy="12" r="10" strokeOpacity=".2" />
		<path d="M12 2a10 10 0 0 1 10 10" stroke="#c2784d" />
	</svg>
);

const fmt = (n) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

const STATUS_CFG = {
	Delivered: {
		label: "Đã giao",
		cls: "bg-green-100 text-green-700 border-green-200",
		dot: "bg-green-500",
		track: "w-full",
		trackColor: "bg-green-400",
	},
	Cancelled: {
		label: "Đã hủy",
		cls: "bg-red-100 text-red-600 border-red-200",
		dot: "bg-red-500",
		track: "w-0",
		trackColor: "bg-red-400",
	},
	Shipping: {
		label: "Đang giao",
		cls: "bg-blue-100 text-blue-700 border-blue-200",
		dot: "bg-blue-500",
		track: "w-2/3",
		trackColor: "bg-blue-400",
	},
	Pending: {
		label: "Chờ xử lý",
		cls: "bg-amber-100 text-amber-700 border-amber-200",
		dot: "bg-amber-400",
		track: "w-1/3",
		trackColor: "bg-amber-400",
	},
};

const PAYMENT_LABEL = {
	COD: "Thanh toán khi nhận hàng",
	Paypal: "PayPal",
	Banking: "Chuyển khoản ngân hàng",
};

const Badge = ({ status }) => {
	const s = STATUS_CFG[status] || {
		label: status,
		cls: "bg-gray-100 text-gray-600 border-gray-200",
		dot: "bg-gray-400",
	};
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${s.cls}`}>
			<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
			{s.label}
		</span>
	);
};

const OrderCard = ({ order, onCancel }) => {
	const [expanded, setExpanded] = useState(false);
	const s = STATUS_CFG[order.status] || {};
	const STEPS = ["Chờ xử lý", "Đang giao", "Đã giao"];

	return (
		<>
			<style>{`
				.item-img { transition: transform .3s; }
				.item-row:hover .item-img { transform: scale(1.07); }
				.expand-btn { transition: background .2s; }
				.expand-btn:hover { background: rgba(194,120,77,.07); }
			`}</style>

			<div
				className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
				style={{ boxShadow: "0 2px 16px rgba(194,120,77,.07)" }}>

				{/* ── Top bar ── */}
				<div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-[#f5ede4]">
					<div className="flex items-center gap-3">
						<div className="w-9 h-9 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center shrink-0">
							<Package size={14} className="text-[#c2784d]" />
						</div>
						<div>
							<p className="font-mono text-xs font-bold text-[#5a4a3a]">
								#{order._id.substring(0, 12).toUpperCase()}
							</p>
							<p className="text-[11px] text-[#b09080] mt-0.5">
								{new Date(order.createdAt).toLocaleDateString("vi-VN", {
									weekday: "short",
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<Badge status={order.status} />
						<Link
							to={`/order/${order._id}`}
							className="inline-flex items-center gap-1 text-xs font-bold text-[#c2784d] hover:text-[#a05e38] transition-colors">
							Chi tiết <ArrowRight size={11} />
						</Link>
						{order.status === "Pending" && (
							<button
								onClick={() => onCancel(order._id)}
								className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors border-l border-[#e0d5c8] pl-3">
								Hủy đơn
							</button>
						)}
					</div>
				</div>

				{/* ── Progress bar (non-cancelled) ── */}
				{order.status !== "Cancelled" && (
					<div className="px-5 pt-3 pb-1">
						<div className="flex items-center justify-between mb-1.5">
							{STEPS.map((step, i) => {
								const stepIdx = { "Chờ xử lý": 0, "Đang giao": 1, "Đã giao": 2 };
								const currentIdx = stepIdx[STATUS_CFG[order.status]?.label] ?? 0;
								const isActive = i <= currentIdx;
								return (
									<span
										key={step}
										className={`text-[10px] font-semibold tracking-wide transition-colors ${
											isActive ? "text-[#c2784d]" : "text-[#c8b8a8]"
										}`}>
										{step}
									</span>
								);
							})}
						</div>
						<div className="h-1.5 bg-[#f5ede4] rounded-full overflow-hidden">
							<div
								className={`h-full rounded-full transition-all duration-700 ${s.trackColor} ${s.track}`}
							/>
						</div>
					</div>
				)}

				{/* ── Product thumbnails preview ── */}
				<div className="px-5 pt-3 pb-4">
					<div className="flex items-center gap-2 flex-wrap">
						{order.orderItems.slice(0, 4).map((item, i) => (
							<div
								key={i}
								className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#f0ddd0] bg-[#faf6f2]">
								<img
									src={item.image}
									alt={item.name}
									className="item-img w-full h-full object-cover"
								/>
							</div>
						))}
						{order.orderItems.length > 4 && (
							<div className="w-14 h-14 rounded-xl border border-[#f0ddd0] bg-[#fff3eb] flex items-center justify-center">
								<span className="text-xs font-bold text-[#c2784d]">
									+{order.orderItems.length - 4}
								</span>
							</div>
						)}
						<div className="ml-auto text-right">
							<p className="text-[11px] text-[#b09080]">Tổng cộng</p>
							<p
								className="font-serif text-[#c2784d] font-bold text-lg"
								style={{ fontFamily: "'Playfair Display',serif" }}>
								{fmt(order.totalPrice)}
							</p>
						</div>
					</div>
				</div>

				{/* ── Expand toggle ── */}
				<button
					onClick={() => setExpanded((v) => !v)}
					className="expand-btn w-full flex items-center justify-center gap-2 py-2.5 border-t border-[#f5ede4] text-[11px] font-bold text-[#a08070] tracking-widest uppercase">
					{expanded ? (
						<><ChevronUp size={12} /> Ẩn chi tiết</>
					) : (
						<><ChevronDown size={12} /> Xem đầy đủ</>
					)}
				</button>

				{/* ── Expanded details ── */}
				{expanded && (
					<div className="border-t border-[#f5ede4] bg-[#fdf9f6]">

						{/* Products list */}
						<div className="px-5 py-4 space-y-3">
							<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#a08070] mb-3">
								Sản phẩm đã đặt
							</p>
							{order.orderItems.map((item, i) => (
								<div
									key={i}
									className="item-row flex items-center gap-4 bg-white rounded-xl p-3 border border-[#f0e5d8]">
									<div className="w-16 h-16 rounded-lg overflow-hidden border border-[#f0ddd0] shrink-0 bg-[#faf6f2]">
										<img
											src={item.image}
											alt={item.name}
											className="item-img w-full h-full object-cover"
										/>
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm font-semibold text-[#2d2418] truncate">
											{item.name}
										</p>
										<div className="flex items-center gap-2 mt-1 flex-wrap">
											<span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-full">
												<span className="w-2 h-2 rounded-sm border border-[#d0c0b0] shrink-0 bg-[#c2784d] opacity-70" />
												{item.selectedColor}
											</span>
											<span className="text-[10px] font-semibold text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-full">
												Size {item.selectedSize}
											</span>
											<span className="text-[10px] font-semibold text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-full">
												x{item.qty}
											</span>
										</div>
									</div>
									<div className="text-right shrink-0">
										<p className="text-xs text-[#b09080]">{fmt(item.price)} / đôi</p>
										<p className="text-sm font-bold text-[#c2784d] mt-0.5">
											{fmt(item.price * item.qty)}
										</p>
									</div>
								</div>
							))}
						</div>

						{/* Meta info grid */}
						<div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-3 gap-3">

							{/* Shipping address */}
							<div className="bg-white rounded-xl p-4 border border-[#f0e5d8]">
								<div className="flex items-center gap-2 mb-3">
									<MapPin size={13} className="text-[#c2784d]" />
									<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#a08070]">
										Địa chỉ giao
									</p>
								</div>
								<p className="text-sm font-semibold text-[#2d2418]">
									{order.shippingAddress.fullName}
								</p>
								<p className="text-xs text-[#8a7060] mt-0.5">
									{order.shippingAddress.phone}
								</p>
								<p className="text-xs text-[#8a7060] mt-1 leading-relaxed">
									{order.shippingAddress.address}
								</p>
							</div>

							{/* Payment */}
							<div className="bg-white rounded-xl p-4 border border-[#f0e5d8]">
								<div className="flex items-center gap-2 mb-3">
									<CreditCard size={13} className="text-[#c2784d]" />
									<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#a08070]">
										Thanh toán
									</p>
								</div>
								<p className="text-sm font-semibold text-[#2d2418]">
									{PAYMENT_LABEL[order.paymentMethod] || order.paymentMethod}
								</p>
							</div>

							{/* Price breakdown */}
							<div className="bg-white rounded-xl p-4 border border-[#f0e5d8]">
								<div className="flex items-center gap-2 mb-3">
									<Tag size={13} className="text-[#c2784d]" />
									<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#a08070]">
										Chi tiết giá
									</p>
								</div>
								<div className="space-y-1.5">
									<div className="flex justify-between text-xs text-[#8a7060]">
										<span>Tiền hàng</span>
										<span>{fmt(order.itemsPrice)}</span>
									</div>
									<div className="flex justify-between text-xs text-[#8a7060]">
										<div className="flex items-center gap-1">
											<Truck size={10} />
											<span>Phí vận chuyển</span>
										</div>
										<span>{fmt(order.shippingPrice)}</span>
									</div>
									<div className="border-t border-[#f0e5d8] pt-1.5 flex justify-between text-sm font-bold">
										<span className="text-[#2d2418]">Tổng cộng</span>
										<span className="text-[#c2784d]">{fmt(order.totalPrice)}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

/* ─────────────────────────────────────────────────────────────────────────────
   ORDER HISTORY
───────────────────────────────────────────────────────────────────────────── */
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

	const handleCancelOrder = async (orderId) => {
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
			const res = await apiCancelMyOrder(orderId);
			if (res.success) {
				toast.success("Hủy đơn hàng thành công!");
				setOrders((prev) =>
					prev.map((o) => (o._id === orderId ? { ...o, status: "Cancelled" } : o)),
				);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Lỗi khi hủy đơn hàng");
		}
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
				.oh-root  { font-family:'DM Sans',sans-serif; }
			`}</style>

			<div className="oh-root bg-[#faf7f4] min-h-screen py-10">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

					{/* Header */}
					<div className="mb-8">
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-1">
							SoleStore
						</p>
						<h1
							className="text-[#1a1914] font-medium"
							style={{
								fontFamily: "'Playfair Display',serif",
								fontSize: "clamp(1.6rem,3.5vw,2.2rem)",
							}}>
							Lịch sử đơn hàng
						</h1>
						<div className="w-8 h-0.5 bg-[#c2784d] mt-3" />
					</div>

					{/* Loading */}
					{loading && (
						<div className="flex flex-col items-center justify-center py-24 gap-4">
							<Spinner />
							<p className="text-sm text-[#a08070] tracking-widest uppercase">Đang tải...</p>
						</div>
					)}

					{/* Empty */}
					{!loading && orders.length === 0 && (
						<div
							className="bg-white border border-[#f0e5d8] rounded-2xl flex flex-col items-center justify-center py-24 text-center"
							style={{ boxShadow: "0 4px 24px rgba(194,120,77,.06)" }}>
							<div className="w-20 h-20 bg-[#fff3eb] rounded-full flex items-center justify-center mb-5">
								<ShoppingBag size={30} className="text-[#c2784d]" />
							</div>
							<h3
								className="text-[#1a1914] text-xl font-medium mb-2"
								style={{ fontFamily: "'Playfair Display',serif" }}>
								Chưa có đơn hàng nào
							</h3>
							<p className="text-[#8a7060] text-sm mb-7">
								Bắt đầu mua sắm và đơn hàng sẽ hiện ở đây.
							</p>
							<Link
								to="/shop"
								className="inline-flex items-center gap-2 bg-[#c2784d] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#a05e38] transition-colors"
								style={{ boxShadow: "0 4px 14px rgba(194,120,77,.3)" }}>
								Bắt đầu mua sắm <ArrowRight size={14} />
							</Link>
						</div>
					)}

					{/* List */}
					{!loading && orders.length > 0 && (
						<div className="space-y-4">
							{orders.map((order) => (
								<OrderCard
									key={order._id}
									order={order}
									onCancel={handleCancelOrder}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default OrderHistory;