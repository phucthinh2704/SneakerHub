import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { apiGetOrderDetail } from "../api/order";
import {
	ArrowLeft,
	Package,
	MapPin,
	CreditCard,
	CheckCircle,
	Clock,
	Truck,
	XCircle,
	Banknote,
	Wallet,
	Receipt,
	ShoppingBag,
} from "lucide-react";

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const Spinner = () => (
	<svg
		className="animate-spin"
		width="36"
		height="36"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#c2784d"
		strokeWidth="2">
		<circle
			cx="12"
			cy="12"
			r="10"
			strokeOpacity=".2"
		/>
		<path
			d="M12 2a10 10 0 0 1 10 10"
			stroke="#c2784d"
		/>
	</svg>
);

const fmt = (n) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(n);

const PAYMENT_CFG = {
	COD: { label: "Thanh toán khi nhận hàng (COD)", Icon: Banknote },
	Paypal: { label: "PayPal", Icon: Wallet },
	Banking: { label: "Chuyển khoản ngân hàng", Icon: CreditCard },
};

const STATUS_CFG = {
	Pending: {
		label: "Chờ xử lý",
		Icon: Clock,
		step: 0,
		dot: "bg-amber-400",
		ring: "ring-amber-300",
		text: "text-amber-700",
		bg: "bg-amber-50  border-amber-200",
	},
	Shipping: {
		label: "Đang giao",
		Icon: Truck,
		step: 1,
		dot: "bg-blue-500",
		ring: "ring-blue-300",
		text: "text-blue-700",
		bg: "bg-blue-50   border-blue-200",
	},
	Delivered: {
		label: "Đã giao",
		Icon: CheckCircle,
		step: 2,
		dot: "bg-green-500",
		ring: "ring-green-300",
		text: "text-green-700",
		bg: "bg-green-50  border-green-200",
	},
	Cancelled: {
		label: "Đã hủy",
		Icon: XCircle,
		step: -1,
		dot: "bg-red-500",
		ring: "ring-red-300",
		text: "text-red-600",
		bg: "bg-red-50    border-red-200",
	},
};

const STEPS = [
	{ key: "Pending", label: "Đặt hàng", Icon: ShoppingBag },
	{ key: "Shipping", label: "Đang giao", Icon: Truck },
	{ key: "Delivered", label: "Hoàn thành", Icon: CheckCircle },
];

/* ─────────────────────────────────────────────────────────────────────────── */
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
			<>
				<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');`}</style>
				<div
					style={{ fontFamily: "'DM Sans',sans-serif" }}
					className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] gap-3">
					<Spinner />
					<p className="text-sm text-[#a08070] tracking-widest uppercase">
						Đang tải đơn hàng...
					</p>
				</div>
			</>
		);

	if (!order)
		return (
			<>
				<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');`}</style>
				<div
					style={{ fontFamily: "'DM Sans',sans-serif" }}
					className="min-h-screen flex items-center justify-center bg-[#faf7f4]">
					<div className="text-center">
						<p className="text-[#8a7060] mb-4">
							Không tìm thấy đơn hàng.
						</p>
						<Link
							to="/my-orders"
							className="text-sm font-bold text-[#c2784d] hover:text-[#a05e38]">
							← Quay lại
						</Link>
					</div>
				</div>
			</>
		);

	const s = STATUS_CFG[order.status] || {
		label: order.status,
		Icon: Package,
		step: 0,
		dot: "bg-gray-400",
		ring: "ring-gray-300",
		text: "text-gray-600",
		bg: "bg-gray-50 border-gray-200",
	};
	const payment = PAYMENT_CFG[order.paymentMethod] || {
		label: order.paymentMethod,
		Icon: CreditCard,
	};
	const isCancelled = order.status === "Cancelled";
	const totalQty = order.orderItems.reduce((acc, i) => acc + i.qty, 0);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
				.od-root  { font-family:'DM Sans',sans-serif; }
				.od-serif { font-family:'Playfair Display',serif; }
				.od-item  { transition: background .15s, transform .15s; }
				.od-item:hover { background:#fffaf6; transform: translateX(2px); }
				.od-fade { animation: odFadeUp .4s ease both; }
				.od-fade-1 { animation-delay:.05s; }
				.od-fade-2 { animation-delay:.1s; }
				.od-fade-3 { animation-delay:.15s; }
				.od-fade-4 { animation-delay:.2s; }
				@keyframes odFadeUp {
					from { opacity:0; transform:translateY(14px); }
					to   { opacity:1; transform:translateY(0);    }
				}
			`}</style>

			<div className="od-root bg-[#faf7f4] min-h-screen py-10">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Back link */}
					<Link
						to="/my-orders"
						className="inline-flex items-center gap-2 text-sm text-[#8a7060] hover:text-[#c2784d] mb-7 transition-colors font-medium">
						<ArrowLeft size={15} /> Lịch sử đơn hàng
					</Link>

					{/* ── HERO HEADER ── */}
					<div
						className="od-fade rounded-2xl overflow-hidden mb-5"
						style={{
							background:
								"linear-gradient(135deg,#fff8f2 0%,#fdf3ea 60%,#fef6ef 100%)",
							boxShadow: "0 4px 24px rgba(194,120,77,.1)",
							border: "1px solid #f0ddd0",
						}}>
						{/* top bar */}
						<div className="px-6 pt-6 pb-5 md:px-8 flex flex-col md:flex-row md:items-start md:justify-between gap-5">
							<div className="flex items-center gap-4">
								<div
									className="w-12 h-12 rounded-2xl bg-[#c2784d] flex items-center justify-center shrink-0"
									style={{
										boxShadow:
											"0 4px 14px rgba(194,120,77,.35)",
									}}>
									<Package
										size={20}
										className="text-white"
									/>
								</div>
								<div>
									<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-1">
										SoleStore · Đơn hàng
									</p>
									<p className="font-mono text-[13px] text-[#b09880]">
										#{order._id.toUpperCase()}
									</p>
									<h1 className="od-serif text-[#1a1914] text-xl font-medium mt-0.5">
										Chi tiết đơn hàng
									</h1>
								</div>
							</div>
							<div className="flex flex-col sm:items-end gap-2.5">
								<p className="text-[11px] text-[#a08070]">
									{new Date(order.createdAt).toLocaleString(
										"vi-VN",
										{
											dateStyle: "full",
											timeStyle: "short",
										},
									)}
								</p>
								<div
									className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold ${s.bg} ${s.text}`}>
									<s.Icon size={13} /> {s.label}
								</div>
								<p className="text-[11px] text-[#a08070]">
									{totalQty} sản phẩm ·{" "}
									{fmt(order.totalPrice)}
								</p>
							</div>
						</div>

						{/* Stepper */}
						{!isCancelled && (
							<div className="px-6 md:px-8 pb-6">
								<div className="relative flex items-center justify-between">
									{/* connector line */}
									<div className="absolute left-0 right-0 top-4 h-px bg-[#f0ddd0] mx-8" />
									<div
										className="absolute left-0 top-4 h-px bg-[#c2784d] mx-8 transition-all duration-700"
										style={{
											right:
												s.step === 0
													? "100%"
													: s.step === 1
														? "50%"
														: "0%",
										}}
									/>
									{STEPS.map((step, i) => {
										const done = i < s.step;
										const active = i === s.step;
										return (
											<div
												key={step.key}
												className="relative flex flex-col items-center gap-2 z-10">
												<div
													className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500
													${done ? "bg-[#c2784d] border-[#c2784d]" : ""}
													${active ? "bg-white border-[#c2784d] ring-4 ring-[#c2784d]/20" : ""}
													${!done && !active ? "bg-white border-[#e8d8cc]" : ""}`}>
													<step.Icon
														size={14}
														className={
															done
																? "text-white"
																: active
																	? "text-[#c2784d]"
																	: "text-[#d0c0b0]"
														}
													/>
												</div>
												<span
													className={`text-[10px] font-bold tracking-wide uppercase whitespace-nowrap
													${active ? "text-[#c2784d]" : done ? "text-[#a05e38]" : "text-[#c8b8a8]"}`}>
													{step.label}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						)}

						{isCancelled && (
							<div className="px-6 md:px-8 pb-5">
								<div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-xs text-red-600 font-medium">
									<XCircle size={13} /> Đơn hàng này đã bị hủy
								</div>
							</div>
						)}
					</div>

					<div className="space-y-4">
						{/* ── INFO GRID ── */}
						<div className="od-fade od-fade-1 grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Shipping */}
							<div
								className="bg-white border border-[#f0e5d8] rounded-2xl p-5"
								style={{
									boxShadow:
										"0 2px 16px rgba(194,120,77,.06)",
								}}>
								<div className="flex items-center gap-2.5 mb-4">
									<div className="w-8 h-8 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
										<MapPin
											size={14}
											className="text-[#c2784d]"
										/>
									</div>
									<h3 className="od-serif text-[#1a1914] font-medium">
										Địa chỉ nhận hàng
									</h3>
								</div>
								<div className="space-y-2.5">
									{[
										{
											label: "Người nhận",
											value: order.shippingAddress
												.fullName,
											bold: true,
										},
										{
											label: "Điện thoại",
											value: order.shippingAddress.phone,
										},
										{
											label: "Địa chỉ",
											value: order.shippingAddress
												.address,
										},
									].map(({ label, value, bold }) => (
										<div
											key={label}
											className="flex gap-3">
											<span className="text-xs text-[#a08070] w-24 shrink-0 pt-0.5">
												{label}
											</span>
											<span
												className={`text-sm text-[#2d2418] leading-relaxed ${bold ? "font-semibold" : ""}`}>
												{value}
											</span>
										</div>
									))}
								</div>
							</div>

							{/* Payment */}
							<div
								className="bg-white border border-[#f0e5d8] rounded-2xl p-5"
								style={{
									boxShadow:
										"0 2px 16px rgba(194,120,77,.06)",
								}}>
								<div className="flex items-center gap-2.5 mb-4">
									<div className="w-8 h-8 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
										<Receipt
											size={14}
											className="text-[#c2784d]"
										/>
									</div>
									<h3 className="od-serif text-[#1a1914] font-medium">
										Thanh toán & Vận chuyển
									</h3>
								</div>
								<div className="space-y-3">
									<div className="flex items-center gap-3 p-3 bg-[#fdf8f4] rounded-xl border border-[#f0e5d8]">
										<payment.Icon
											size={16}
											className="text-[#c2784d] shrink-0"
										/>
										<span className="text-sm font-semibold text-[#2d2418]">
											{payment.label}
										</span>
									</div>
									<div className="flex justify-between text-sm px-1">
										<span className="text-[#8a7060]">
											Tiền hàng
										</span>
										<span className="font-medium text-[#2d2418]">
											{fmt(order.itemsPrice)}
										</span>
									</div>
									<div className="flex justify-between text-sm px-1">
										<span className="text-[#8a7060] flex items-center gap-1.5">
											<Truck size={12} /> Phí vận chuyển
										</span>
										<span
											className={
												order.shippingPrice === 0
													? "font-bold text-green-600 text-sm"
													: "font-medium text-sm text-[#2d2418]"
											}>
											{order.shippingPrice === 0
												? "Miễn phí"
												: fmt(order.shippingPrice)}
										</span>
									</div>
									<div className="border-t border-[#f0e5d8] pt-3 flex justify-between items-center px-1">
										<span className="text-sm font-bold text-[#1a1914]">
											Tổng cộng
										</span>
										<span className="od-serif text-xl font-semibold text-[#c2784d]">
											{fmt(order.totalPrice)}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* ── PRODUCT LIST ── */}
						<div
							className="od-fade od-fade-2 bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
							style={{
								boxShadow: "0 2px 16px rgba(194,120,77,.06)",
							}}>
							<div className="px-6 py-4 border-b border-[#f5ede4] flex items-center justify-between">
								<h3 className="od-serif text-[#1a1914] font-medium text-lg">
									Sản phẩm đã mua
								</h3>
								<span className="text-xs font-bold text-[#a08070] bg-[#f5ede4] px-2.5 py-1 rounded-full">
									{totalQty} đôi · {order.orderItems.length}{" "}
									loại
								</span>
							</div>

							{order.orderItems.map((item, idx) => (
								<div
									key={item._id ?? idx}
									className={`od-item px-5 py-4 flex items-start gap-4 ${idx !== order.orderItems.length - 1 ? "border-b border-[#f5ede4]" : ""}`}>
									{/* Image */}
									<div className="w-18 h-18 rounded-xl overflow-hidden bg-[#f5ede4] border border-[#f0ddd0] shrink-0">
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									</div>
									{/* Info */}
									<div className="flex-1 min-w-0">
										<Link
											to={`/product/${item.product}`}
											className="od-serif text-[#1a1914] font-medium text-sm hover:text-[#c2784d] transition-colors line-clamp-2 leading-snug block mb-2">
											{item.name}
										</Link>
										<div className="flex flex-wrap gap-2">
											<span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-full">
												<span className="w-2 h-2 rounded-sm bg-[#c2784d] opacity-60 shrink-0" />
												{item.selectedColor}
											</span>
											<span className="text-[10px] font-semibold text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-full">
												Size {item.selectedSize}
											</span>
											<span className="text-[10px] font-semibold text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-full">
												×{item.qty}
											</span>
										</div>
										<p className="text-[11px] text-[#b0a090] mt-1.5">
											{fmt(item.price)} / đôi
										</p>
									</div>
									{/* Subtotal */}
									<div className="text-right shrink-0">
										<p className="od-serif text-[#c2784d] font-semibold text-base">
											{fmt(item.price * item.qty)}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Back btn */}
					<div className="mt-7 text-center">
						<Link
							to="/my-orders"
							className="inline-flex items-center gap-2 text-sm text-[#8a7060] hover:text-[#c2784d] transition-colors font-medium">
							<ArrowLeft size={14} /> Quay lại danh sách đơn hàng
						</Link>
					</div>
				</div>
			</div>
		</>
	);
};

export default OrderDetail;
