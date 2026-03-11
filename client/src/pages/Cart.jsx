import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiGetMyCart, apiUpdateCartItem } from "../api/cart";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus } from "lucide-react";
import toast from "react-hot-toast";

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = ({ size = 28, color = "#c2784d" }) => (
	<svg
		className="animate-spin"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2">
		<circle
			cx="12"
			cy="12"
			r="10"
			strokeOpacity="0.2"
		/>
		<path
			d="M12 2a10 10 0 0 1 10 10"
			stroke={color}
		/>
	</svg>
);

const fmt = (n) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(n);
const fmtShort = (n) => new Intl.NumberFormat("vi-VN").format(n);

// ═════════════════════════════════════════════════════════════════════════════
const Cart = () => {
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(true);
	const [updatingId, setUpdatingId] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchCart();
	}, []);

	const fetchCart = async () => {
		try {
			const res = await apiGetMyCart();
			if (res.success) setCart(res.result);
		} catch (e) {
			console.error("Lỗi lấy giỏ hàng", e);
		} finally {
			setLoading(false);
		}
	};

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
		} catch (e) {
			toast.error(e.response?.data?.message || "Lỗi cập nhật giỏ hàng");
		} finally {
			setUpdatingId(null);
		}
	};

	// ── Loading ───────────────────────────────────────────────────────────────
	if (loading)
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-[#faf7f4]">
				<Spinner size={36} />
				<p className="text-sm text-[#a08070] tracking-widest uppercase">
					Đang tải...
				</p>
			</div>
		);

	// ── Empty ─────────────────────────────────────────────────────────────────
	if (!cart || cart.cartItems.length === 0)
		return (
			<>
				<style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap'); .ct-root{font-family:'DM Sans',sans-serif;} .ct-serif{font-family:'Playfair Display',serif;}`}</style>
				<div className="ct-root min-h-[70vh] flex items-center justify-center bg-[#faf7f4] px-4">
					<div
						className="bg-white border border-[#f0e5d8] rounded-2xl p-12 text-center max-w-sm w-full"
						style={{
							boxShadow: "0 8px 40px rgba(194,120,77,.08)",
						}}>
						<div className="w-20 h-20 bg-[#fff3eb] rounded-full flex items-center justify-center mx-auto mb-5">
							<ShoppingBag
								size={32}
								className="text-[#c2784d]"
							/>
						</div>
						<h2 className="ct-serif text-[#1a1914] text-xl font-medium mb-2">
							Giỏ hàng trống
						</h2>
						<p className="text-[#8a7060] text-sm mb-7">
							Bạn chưa thêm sản phẩm nào vào giỏ hàng.
						</p>
						<Link
							to="/shop"
							className="inline-flex items-center gap-2 w-full justify-center bg-[#c2784d] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#a05e38] transition-colors"
							style={{
								boxShadow: "0 4px 16px rgba(194,120,77,.3)",
							}}>
							Tiếp tục mua sắm <ArrowRight size={15} />
						</Link>
					</div>
				</div>
			</>
		);

	const itemCount = cart.cartItems.reduce((s, i) => s + i.quantity, 0);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.ct-root  { font-family:'DM Sans',sans-serif; }
				.ct-serif { font-family:'Playfair Display',serif; }
				.ct-row { transition: background .15s; }
				.ct-row:hover { background:#fffaf7; }
				.qty-btn { transition: background .15s, color .15s; }
				.qty-btn:hover:not(:disabled) { background:#c2784d; color:white; }
				.checkout-btn {
					background: linear-gradient(135deg,#c2784d 0%,#a05e38 100%);
					transition: all .25s ease;
					position: relative; overflow: hidden;
				}
				.checkout-btn::before {
					content:''; position:absolute; inset:0;
					background: linear-gradient(135deg,#d4895e,#b06840);
					opacity:0; transition:opacity .25s;
				}
				.checkout-btn:hover::before { opacity:1; }
				.checkout-btn > * { position:relative; z-index:1; }
			`}</style>

			<div className="ct-root bg-[#faf7f4] min-h-screen py-10">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* ── Header ── */}
					<div className="mb-8">
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-1">
							SoleStore
						</p>
						<h1 className="ct-serif text-[#1a1914] font-medium text-3xl">
							Giỏ hàng
							<span className="ml-3 text-base font-normal text-[#a08070]">
								({itemCount} sản phẩm)
							</span>
						</h1>
					</div>

					<div className="flex flex-col lg:flex-row gap-8">
						{/* ── Items ── */}
						<div className="flex-1">
							<div
								className="bg-white rounded-2xl border border-[#f0e5d8] overflow-hidden"
								style={{
									boxShadow:
										"0 4px 24px rgba(194,120,77,.06)",
								}}>
								{/* Table header */}
								<div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#f5ede4] bg-[#fffaf7]">
									<div className="col-span-6 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070]">
										Sản phẩm
									</div>
									<div className="col-span-2 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] text-center">
										Đơn giá
									</div>
									<div className="col-span-2 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] text-center">
										Số lượng
									</div>
									<div className="col-span-2 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] text-right">
										Thành tiền
									</div>
								</div>

								<div className="divide-y divide-[#f5ede4]">
									{cart.cartItems.map((item) => (
										<div
											key={item._id}
											className="ct-row p-5 flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
											{/* Image + Info — gộp chung col-span-6 */}
											<div className="col-span-6 flex items-center gap-4 w-full">
												<div className="w-20 h-20 rounded-xl overflow-hidden bg-[#f5ede4] border border-[#f0e0d0] shrink-0">
													<img
														src={item.image}
														alt={item.name}
														className="w-full h-full object-cover"
													/>
												</div>
												<div className="min-w-0">
													<Link
														to={`/product/${item.product}`}
														className="ct-serif text-sm font-medium text-[#1a1914] hover:text-[#c2784d] transition-colors line-clamp-2 leading-snug block">
														{item.name}
													</Link>
													<p className="text-xs text-[#a08070] mt-1">
														Màu: {item.color} ·
														Size: {item.size}
													</p>
													<button
														onClick={() =>
															handleUpdateQuantity(
																item._id,
																0,
															)
														}
														className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 mt-2 transition-colors">
														<Trash2 size={12} /> Xóa
													</button>
												</div>
											</div>

											{/* Unit price */}
											<div className="col-span-2 text-center hidden md:block text-sm text-[#5a4a3a] font-medium">
												{fmtShort(item.price)}đ
											</div>

											{/* Quantity */}
											<div className="col-span-2 flex justify-center">
												<div className="flex items-center gap-0 border border-[#e8d8cc] rounded-xl overflow-hidden bg-white h-9">
													<button
														onClick={() =>
															handleUpdateQuantity(
																item._id,
																item.quantity -
																	1,
															)
														}
														disabled={!!updatingId}
														className="qty-btn w-9 h-full flex items-center justify-center text-[#5a4a3a] disabled:opacity-40">
														<Minus size={13} />
													</button>
													<div className="w-9 h-full flex items-center justify-center border-x border-[#e8d8cc] text-sm font-bold text-[#1a1914]">
														{updatingId ===
														item._id ? (
															<Spinner
																size={14}
															/>
														) : (
															item.quantity
														)}
													</div>
													<button
														onClick={() =>
															handleUpdateQuantity(
																item._id,
																item.quantity +
																	1,
															)
														}
														disabled={!!updatingId}
														className="qty-btn w-9 h-full flex items-center justify-center text-[#5a4a3a] disabled:opacity-40">
														<Plus size={13} />
													</button>
												</div>
											</div>

											{/* Subtotal */}
											<div className="col-span-2 flex justify-between md:justify-end items-center w-full">
												<span className="md:hidden text-xs text-[#a08070]">
													Thành tiền:
												</span>
												<span className="text-sm font-bold text-[#c2784d]">
													{fmtShort(
														item.price *
															item.quantity,
													)}
													đ
												</span>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Continue shopping */}
							<Link
								to="/shop"
								className="inline-flex items-center gap-2 mt-5 text-sm text-[#a08070] hover:text-[#c2784d] transition-colors">
								<ArrowRight
									size={14}
									className="rotate-180"
								/>{" "}
								Tiếp tục mua sắm
							</Link>
						</div>

						{/* ── Summary ── */}
						<div className="w-full lg:w-80 shrink-0">
							<div
								className="bg-white rounded-2xl border border-[#f0e5d8] p-6 lg:sticky lg:top-24"
								style={{
									boxShadow:
										"0 4px 24px rgba(194,120,77,.06)",
								}}>
								<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-1">
									Tóm tắt
								</p>
								<h2 className="ct-serif text-[#1a1914] text-lg font-medium mb-6 pb-4 border-b border-[#f5ede4]">
									Đơn hàng
								</h2>

								<div className="space-y-3 mb-5 text-sm text-[#6a5a4a]">
									<div className="flex justify-between">
										<span>Tổng tiền hàng</span>
										<span className="font-medium text-[#1a1914]">
											{fmt(cart.totalPrice)}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Phí vận chuyển</span>
										<span className="font-semibold text-green-600">
											Miễn phí
										</span>
									</div>
								</div>

								<div className="border-t border-[#f5ede4] pt-4 mb-6">
									<div className="flex justify-between items-center">
										<span className="text-sm font-bold text-[#1a1914]">
											Tổng thanh toán
										</span>
										<span className="ct-serif text-xl font-semibold text-[#c2784d]">
											{fmt(cart.totalPrice)}
										</span>
									</div>
									<p className="text-[10px] text-[#b0a090] text-right mt-1">
										Đã bao gồm VAT
									</p>
								</div>

								<button
									onClick={() =>
										navigate("/checkout", {
											state: { cartData: cart },
										})
									}
									className="checkout-btn w-full text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
									style={{
										boxShadow:
											"0 4px 20px rgba(194,120,77,.3)",
									}}>
									<span>Tiến hành thanh toán</span>
									<ArrowRight size={15} />
								</button>

								{/* Trust badges */}
								<div className="mt-5 grid grid-cols-2 gap-2">
									{[
										"🔒 Thanh toán bảo mật",
										"🚚 Giao hàng toàn quốc",
										"↩️ Đổi trả 30 ngày",
										"✅ Hàng chính hãng",
									].map((b, i) => (
										<div
											key={i}
											className="bg-[#fdf8f4] rounded-lg px-2 py-2 text-[10px] text-[#8a7060] text-center leading-snug border border-[#f0e5d8]">
											{b}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Cart;
