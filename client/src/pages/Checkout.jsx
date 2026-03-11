import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiCreateOrder } from "../api/order";
import { apiGetUserProfile } from "../api/user";
import {
	Truck,
	CreditCard,
	MapPin,
	CheckCircle,
	Phone,
	User,
} from "lucide-react";
import toast from "react-hot-toast";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(n);
const fmtN = (n) => new Intl.NumberFormat("vi-VN").format(n);

const Spinner = () => (
	<svg
		className="animate-spin"
		width="22"
		height="22"
		viewBox="0 0 24 24"
		fill="none"
		stroke="white"
		strokeWidth="2.5">
		<circle
			cx="12"
			cy="12"
			r="10"
			strokeOpacity="0.3"
		/>
		<path d="M12 2a10 10 0 0 1 10 10" />
	</svg>
);

// ── Field ─────────────────────────────────────────────────────────────────────
const Field = ({ label, icon: Icon, children }) => (
	<div className="group">
		<label className="block text-[10px] font-bold tracking-[.18em] uppercase text-[#c2784d] mb-1.5">
			{label}
		</label>
		<div className="relative">
			{Icon && (
				<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
					<Icon
						size={14}
						className="text-[#b0a090] group-focus-within:text-[#c2784d] transition-colors"
					/>
				</div>
			)}
			{children}
		</div>
	</div>
);

const inputCls = (hasIcon = true) =>
	`w-full ${hasIcon ? "pl-10" : "pl-4"} pr-4 py-3 bg-[#faf7f4] border border-[#e0d5c8] rounded-xl text-sm text-[#1a1914] placeholder-[#c0b5a8] outline-none focus:border-[#c2784d] focus:bg-white focus:ring-2 focus:ring-[#c2784d]/10 transition-all`;

// ── Payment Option ─────────────────────────────────────────────────────────────
const PayOption = ({ value, title, desc, checked, onChange }) => (
	<label
		className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
		${checked ? "border-[#c2784d] bg-[#fff8f3]" : "border-[#e8d8cc] bg-white hover:border-[#f0c8a8]"}`}>
		<input
			type="radio"
			name="paymentMethod"
			value={value}
			checked={checked}
			onChange={onChange}
			className="hidden"
		/>
		<div
			className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all
			${checked ? "border-[#c2784d]" : "border-[#d0c4b8]"}`}>
			{checked && (
				<div className="w-2.5 h-2.5 rounded-full bg-[#c2784d]" />
			)}
		</div>
		<div>
			<p className="text-sm font-bold text-[#1a1914]">{title}</p>
			<p className="text-xs text-[#8a7060] mt-0.5 leading-relaxed">
				{desc}
			</p>
		</div>
	</label>
);

// ═════════════════════════════════════════════════════════════════════════════
const Checkout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const cartData = location.state?.cartData;

	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [form, setForm] = useState({
		fullName: "",
		phone: "",
		address: "",
		paymentMethod: "COD",
	});

	useEffect(() => {
		if (!cartData) {
			navigate("/cart");
			return;
		}
		const fetchUser = async () => {
			try {
				const res = await apiGetUserProfile();
				if (res.success)
					setForm((p) => ({
						...p,
						fullName: res.result.name || "",
						phone: res.result.phone || "",
						address: res.result.address || "",
					}));
			} catch (e) {
				console.error("Lỗi lấy thông tin user", e);
			}
		};
		fetchUser();
	}, [cartData, navigate]);

	const handleChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		const orderPayload = {
			orderItems: cartData.cartItems.map((i) => ({
				product: i.product,
				name: i.name,
				qty: i.quantity,
				image: i.image,
				price: i.price,
				selectedColor: i.color,
				selectedSize: i.size,
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
				setTimeout(() => navigate("/my-orders"), 2500);
			}
		} catch (e) {
			toast.error(
				e.response?.data?.message || "Lỗi đặt hàng, vui lòng thử lại",
			);
		} finally {
			setLoading(false);
		}
	};

	if (!cartData) return null;

	// ── Success screen ────────────────────────────────────────────────────────
	if (success)
		return (
			<>
				<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap'); .ck-root{font-family:'DM Sans',sans-serif;} .ck-serif{font-family:'Playfair Display',serif;}`}</style>
				<div className="ck-root min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] px-4 text-center">
					<div
						className="bg-white rounded-3xl border border-[#f0e5d8] p-12 max-w-sm w-full"
						style={{
							boxShadow: "0 12px 60px rgba(194,120,77,.1)",
						}}>
						<div className="w-20 h-20 bg-[#f0fdf4] rounded-full flex items-center justify-center mx-auto mb-6">
							<CheckCircle
								size={40}
								className="text-green-500"
							/>
						</div>
						<h1 className="ck-serif text-[#1a1914] text-2xl font-medium mb-2">
							Đặt hàng thành công!
						</h1>
						<p className="text-[#8a7060] text-sm mb-6 leading-relaxed">
							Cảm ơn bạn đã mua sắm tại SoleStore. Đơn hàng đang
							được xử lý.
						</p>
						<div className="flex items-center justify-center gap-2 text-xs text-[#a08070]">
							<Spinner />
							<span>Đang chuyển đến lịch sử đơn hàng...</span>
						</div>
					</div>
				</div>
			</>
		);

	const itemCount = cartData.cartItems.reduce((s, i) => s + i.quantity, 0);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.ck-root  { font-family:'DM Sans',sans-serif; }
				.ck-serif { font-family:'Playfair Display',serif; }
				.order-btn {
					background:linear-gradient(135deg,#c2784d 0%,#a05e38 100%);
					transition:all .25s; position:relative; overflow:hidden;
				}
				.order-btn::before {
					content:'';position:absolute;inset:0;
					background:linear-gradient(135deg,#d4895e,#b06840);
					opacity:0;transition:opacity .25s;
				}
				.order-btn:hover::before { opacity:1; }
				.order-btn:disabled { opacity:.6; cursor:not-allowed; }
				.order-btn > * { position:relative;z-index:1; }
			`}</style>

			<div className="ck-root bg-[#faf7f4] min-h-screen py-10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* ── Header ── */}
					<div className="mb-8">
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-1">
							SoleStore
						</p>
						<h1 className="ck-serif text-[#1a1914] font-medium text-3xl">
							Thanh toán
						</h1>
					</div>

					<form
						onSubmit={handleSubmit}
						className="flex flex-col lg:flex-row gap-8">
						{/* ── Left: Info + Payment ── */}
						<div className="flex-1 space-y-6">
							{/* Shipping info */}
							<div
								className="bg-white rounded-2xl border border-[#f0e5d8] p-6"
								style={{
									boxShadow:
										"0 4px 24px rgba(194,120,77,.06)",
								}}>
								<div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f5ede4]">
									<div className="w-8 h-8 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
										<MapPin
											size={15}
											className="text-[#c2784d]"
										/>
									</div>
									<h2 className="ck-serif text-[#1a1914] text-lg font-medium">
										Thông tin giao hàng
									</h2>
								</div>

								<div className="space-y-4">
									<Field
										label="Họ và tên người nhận"
										icon={User}>
										<input
											required
											name="fullName"
											value={form.fullName}
											onChange={handleChange}
											placeholder="Nguyễn Văn A"
											className={inputCls(true)}
										/>
									</Field>
									<Field
										label="Số điện thoại"
										icon={Phone}>
										<input
											required
											name="phone"
											value={form.phone}
											onChange={handleChange}
											placeholder="0901 234 567"
											className={inputCls(true)}
										/>
									</Field>
									<Field label="Địa chỉ chi tiết">
										<textarea
											required
											name="address"
											value={form.address}
											onChange={handleChange}
											rows={3}
											placeholder="Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
											className={inputCls(false)}
										/>
									</Field>
								</div>
							</div>

							{/* Payment */}
							<div
								className="bg-white rounded-2xl border border-[#f0e5d8] p-6"
								style={{
									boxShadow:
										"0 4px 24px rgba(194,120,77,.06)",
								}}>
								<div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f5ede4]">
									<div className="w-8 h-8 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
										<CreditCard
											size={15}
											className="text-[#c2784d]"
										/>
									</div>
									<h2 className="ck-serif text-[#1a1914] text-lg font-medium">
										Phương thức thanh toán
									</h2>
								</div>
								<div className="space-y-3">
									<PayOption
										value="COD"
										title="Thanh toán khi nhận hàng (COD)"
										desc="Thanh toán bằng tiền mặt khi shipper giao hàng tới tận nơi."
										checked={form.paymentMethod === "COD"}
										onChange={handleChange}
									/>
									<PayOption
										value="Banking"
										title="Chuyển khoản ngân hàng"
										desc="Thông tin tài khoản sẽ được hiển thị sau khi đặt hàng thành công."
										checked={
											form.paymentMethod === "Banking"
										}
										onChange={handleChange}
									/>
								</div>
							</div>
						</div>

						{/* ── Right: Order summary ── */}
						<div className="w-full lg:w-90 shrink-0">
							<div
								className="bg-white rounded-2xl border border-[#f0e5d8] p-6 lg:sticky lg:top-24"
								style={{
									boxShadow:
										"0 4px 24px rgba(194,120,77,.06)",
								}}>
								<div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#f5ede4]">
									<div className="w-8 h-8 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
										<Truck
											size={15}
											className="text-[#c2784d]"
										/>
									</div>
									<h2 className="ck-serif text-[#1a1914] text-lg font-medium">
										Đơn hàng
										<span className="ml-2 text-sm font-normal text-[#a08070]">
											({itemCount} sp)
										</span>
									</h2>
								</div>

								{/* Items */}
								<div
									className="space-y-3 mb-5 max-h-56 overflow-y-auto pr-1"
									style={{
										scrollbarWidth: "thin",
										scrollbarColor: "#e0d5c8 transparent",
									}}>
									{cartData.cartItems.map((item) => (
										<div
											key={item._id}
											className="flex items-start gap-3">
											<div className="relative shrink-0">
												<div className="w-14 h-14 rounded-xl overflow-hidden bg-[#f5ede4] border border-[#f0e0d0]">
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#1a1914] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
													{item.quantity}
												</span>
											</div>
											<div className="flex-1 min-w-0">
												<p className="text-xs font-semibold text-[#1a1914] line-clamp-2 leading-snug">
													{item.name}
												</p>
												<p className="text-[10px] text-[#a08070] mt-0.5">
													{item.color} / {item.size}
												</p>
												<p className="text-xs font-bold text-[#c2784d] mt-1">
													{fmtN(item.price)}đ
												</p>
											</div>
										</div>
									))}
								</div>

								{/* Price breakdown */}
								<div className="border-t border-[#f5ede4] pt-4 space-y-2.5 text-sm text-[#6a5a4a] mb-4">
									<div className="flex justify-between">
										<span>Tạm tính</span>
										<span className="font-medium text-[#1a1914]">
											{fmtN(cartData.totalPrice)}đ
										</span>
									</div>
									<div className="flex justify-between">
										<span>Phí vận chuyển</span>
										<span className="font-semibold text-green-600">
											Miễn phí
										</span>
									</div>
								</div>

								<div className="border-t border-[#f5ede4] pt-4 mb-6 flex justify-between items-center">
									<span className="text-sm font-bold text-[#1a1914]">
										Tổng cộng
									</span>
									<span className="ck-serif text-xl font-semibold text-[#c2784d]">
										{fmt(cartData.totalPrice)}
									</span>
								</div>

								<button
									type="submit"
									disabled={loading}
									className="order-btn w-full text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
									style={{
										boxShadow:
											"0 4px 20px rgba(194,120,77,.3)",
									}}>
									{loading ? (
										<>
											<Spinner />
											<span>Đang xử lý...</span>
										</>
									) : (
										<span>Đặt hàng ngay</span>
									)}
								</button>

								<p className="text-center text-[10px] text-[#b0a090] mt-3">
									🔒 Thông tin được mã hóa & bảo mật an toàn
								</p>
							</div>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Checkout;
