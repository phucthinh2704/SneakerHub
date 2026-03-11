import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetProductDetail } from "../api/product";
import { apiAddToCart } from "../api/cart";
import { Star, Truck, ShieldCheck, Minus, Plus, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { apiGetProductReviews, apiCreateReview } from "../api/review";

/* ─── Helpers ───────────────────────────────────────────────────────────────── */
const Spinner = ({ size = 22, color = "#c2784d" }) => (
	<svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
		<circle cx="12" cy="12" r="10" strokeOpacity=".2" /><path d="M12 2a10 10 0 0 1 10 10" stroke={color} />
	</svg>
);
const fmt = (n) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

/* ─────────────────────────────────────────────────────────────────────────────
   PRODUCT DETAIL
───────────────────────────────────────────────────────────────────────────── */
const ProductDetail = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { isLoggedIn, user: currentUser } = useSelector((state) => state.auth);

	const [product,         setProduct]         = useState(null);
	const [loading,         setLoading]         = useState(true);
	const [selectedVariant, setSelectedVariant] = useState(null);
	const [selectedSize,    setSelectedSize]    = useState(null);
	const [quantity,        setQuantity]        = useState(1);
	const [activeImage,     setActiveImage]     = useState("");
	const [addingCart,      setAddingCart]      = useState(false);

	const [reviews,     setReviews]     = useState([]);
	const [rating,      setRating]      = useState(5);
	const [comment,     setComment]     = useState("");
	const [isSubmitting,setIsSubmitting]= useState(false);
	const [hoverStar,   setHoverStar]   = useState(0);

	/* ─── Fetch product ─── */
	useEffect(() => {
		const fetch = async () => {
			try {
				const res = await apiGetProductDetail(slug);
				if (res.success) {
					setProduct(res.result);
					if (res.result.variants?.length > 0) {
						const v = res.result.variants[0];
						setSelectedVariant(v);
						setActiveImage(v.images[0]);
					}
				}
			} catch (error) { console.error(error); toast.error("Lỗi tải sản phẩm"); }
			finally { setLoading(false); }
		};
		fetch();
	}, [slug]);

	/* ─── Fetch reviews ─── */
	useEffect(() => {
		if (!product?._id) return;
		(async () => {
			try { const r = await apiGetProductReviews(product._id); if (r.success) setReviews(r.result); }
			catch (e) { console.error("Lỗi lấy đánh giá", e); }
		})();
	}, [product?._id]);

	const handleColorChange = (v) => {
		setSelectedVariant(v); setActiveImage(v.images[0]);
		setSelectedSize(null); setQuantity(1);
	};

	const handleAddToCart = async () => {
		if (!isLoggedIn) { toast.error("Vui lòng đăng nhập để mua hàng"); return navigate("/login"); }
		if (!selectedSize) return toast.error("Vui lòng chọn Size");
		setAddingCart(true);
		try {
			const res = await apiAddToCart({
				productId: product._id,
				color:     selectedVariant.color,
				size:      selectedSize.size,
				quantity,
			});
			if (res.success) toast.success("Đã thêm vào giỏ hàng!");
		} catch (error) { toast.error(error.response?.data?.message || "Lỗi thêm giỏ hàng"); }
		finally { setAddingCart(false); }
	};

	const handleSubmitReview = async (e) => {
		e.preventDefault();
		if (!isLoggedIn) { toast.error("Vui lòng đăng nhập để đánh giá"); return navigate("/login"); }
		if (comment.trim().length < 10) return toast.error("Vui lòng nhập đánh giá dài ít nhất 10 ký tự.");
		setIsSubmitting(true);
		try {
			const res = await apiCreateReview(product._id, { rating, comment });
			if (res.success) {
				toast.success("Cảm ơn bạn đã đánh giá!");
				setComment(""); setRating(5);
				const r = await apiGetProductReviews(product._id);
				if (r.success) setReviews(r.result);
			} else toast.error(res.message || "Lỗi gửi đánh giá");
		} catch (error) { toast.error(error.response?.data?.message || "Lỗi gửi đánh giá"); }
		finally { setIsSubmitting(false); }
	};

	const hasReviewed = reviews.some(
		(r) => r.user?._id === currentUser?._id || r.user === currentUser?._id,
	);

	/* ─── Loading ─── */
	if (loading) return (
		<>
			<style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&display=swap');`}</style>
			<div style={{ fontFamily: "'DM Sans',sans-serif" }} className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] gap-3">
				<Spinner size={36} /> <p className="text-sm text-[#a08070] tracking-widest uppercase">Đang tải sản phẩm...</p>
			</div>
		</>
	);

	if (!product) return (
		<div style={{ fontFamily: "'DM Sans',sans-serif" }} className="min-h-screen flex items-center justify-center bg-[#faf7f4]">
			<p className="text-[#8a7060]">Sản phẩm không tồn tại</p>
		</div>
	);

	const avgRating = product.rating || 0;

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.pd-root  { font-family:'DM Sans',sans-serif; }
				.pd-serif { font-family:'Playfair Display',serif; }

				/* Thumbnail */
				.pd-thumb { transition: border-color .2s, box-shadow .2s; }
				.pd-thumb.active { border-color:#c2784d; box-shadow:0 0 0 2px rgba(194,120,77,.2); }
				.pd-thumb:not(.active):hover { border-color:#e0c4b0; }

				/* Color swatch */
				.pd-swatch { transition: box-shadow .2s, transform .2s; }
				.pd-swatch.active { box-shadow:0 0 0 2px #fff,0 0 0 4px #c2784d; transform:scale(1.1); }

				/* Size btn */
				.pd-size {
					transition: all .15s;
					border: 1.5px solid #e0d5c8; background:white;
					color:#3a2a1a; border-radius:10px;
				}
				.pd-size:hover:not(:disabled) { border-color:#c2784d; background:#fff3eb; color:#c2784d; }
				.pd-size.active { border-color:#c2784d; background:#c2784d; color:white; }
				.pd-size:disabled { opacity:.35; cursor:not-allowed; }

				/* Add to cart button */
				.pd-atc {
					background:linear-gradient(135deg,#1a1914 0%,#2d2520 100%);
					transition:all .25s; position:relative; overflow:hidden;
				}
				.pd-atc::before {
					content:''; position:absolute; inset:0;
					background:linear-gradient(135deg,#c2784d,#a05e38);
					opacity:0; transition:opacity .25s;
				}
				.pd-atc:hover:not(:disabled)::before { opacity:1; }
				.pd-atc:disabled { opacity:.55; cursor:not-allowed; }
				.pd-atc > * { position:relative; z-index:1; }

				/* Main image zoom */
				.pd-main-img { transition: transform 8s ease; }
				.pd-img-wrap:hover .pd-main-img { transform: scale(1.04); }

				/* Review card */
				.rev-card { transition: box-shadow .2s; }
				.rev-card:hover { box-shadow: 0 4px 16px rgba(194,120,77,.08); }
			`}</style>

			<div className="pd-root bg-[#faf7f4] min-h-screen">

				{/* ── Breadcrumb ── */}
				<div className="bg-white border-b border-[#f0e5d8] py-3">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 text-xs text-[#a08070]">
						<a href="/" className="hover:text-[#c2784d] transition-colors">Trang chủ</a>
						<ChevronRight size={11} />
						<a href="/shop" className="hover:text-[#c2784d] transition-colors">Cửa hàng</a>
						<ChevronRight size={11} />
						<span className="text-[#5a4a3a] font-medium line-clamp-1">{product.name}</span>
					</div>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

					{/* ── Product section ── */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

						{/* ─── Gallery ─── */}
						<div className="space-y-4">
							{/* Main image */}
							<div className="pd-img-wrap aspect-square rounded-2xl overflow-hidden bg-white border border-[#f0e5d8] relative"
								style={{ boxShadow: "0 8px 40px rgba(194,120,77,.08)" }}>
								<img src={activeImage} alt={product.name}
									className="pd-main-img w-full h-full object-cover object-center" />
								{/* Category badge */}
								{product.category?.name && (
									<div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full border border-[#f0ddd0] text-[10px] font-bold tracking-[.15em] uppercase text-[#c2784d]">
										{product.category.name}
									</div>
								)}
							</div>

							{/* Thumbnails */}
							{selectedVariant?.images?.length > 1 && (
								<div className="flex gap-2.5 overflow-x-auto pb-1">
									{selectedVariant.images.map((img, idx) => (
										<button key={idx} onClick={() => setActiveImage(img)}
											className={`pd-thumb shrink-0 w-27 h-27 rounded-xl overflow-hidden border-2 bg-white ${activeImage === img ? "active" : "border-[#e8d8cc]"}`}>
											<img src={img} alt={`thumb-${idx}`} className="w-full h-full object-cover" />
										</button>
									))}
								</div>
							)}
						</div>

						{/* ─── Info panel ─── */}
						<div className="flex flex-col">

							{/* Rating pill */}
							{avgRating > 0 && (
								<div className="flex items-center gap-2 mb-3">
									<div className="flex items-center gap-0.5">
										{[...Array(5)].map((_, i) => (
											<Star key={i} size={13}
												className={i < Math.round(avgRating) ? "text-amber-400 fill-amber-400" : "text-[#e0d5c8]"} />
										))}
									</div>
									<span className="text-xs text-[#8a7060]">({product.numReviews} đánh giá)</span>
								</div>
							)}

							{/* Name */}
							<h1 className="pd-serif text-[#1a1914] font-medium leading-snug mb-2"
								style={{ fontSize: "clamp(1.5rem,3vw,2rem)" }}>
								{product.name}
							</h1>
							<div className="w-8 h-0.5 bg-[#c2784d] mb-5" />

							{/* Price */}
							<div className="flex items-baseline gap-3 mb-5">
								<span className="pd-serif text-[#c2784d] font-semibold" style={{ fontSize: "1.6rem" }}>
									{fmt(product.price)}
								</span>
								{product.originalPrice > product.price && (
									<span className="text-[#b0a090] text-sm line-through">{fmt(product.originalPrice)}</span>
								)}
							</div>

							{/* Description */}
							<p className="text-[#6a5a4a] text-sm leading-relaxed mb-7 border-b border-[#f5ede4] pb-7">
								{product.description}
							</p>

							{/* ── Color selector ── */}
							<div className="mb-6">
								<p className="text-[10px] font-bold tracking-[.18em] uppercase text-[#c2784d] mb-3">
									Màu sắc — <span className="text-[#1a1914]">{selectedVariant?.color}</span>
								</p>
								<div className="flex items-center gap-3 flex-wrap">
									{product.variants.map((v) => (
										<button key={v._id} onClick={() => handleColorChange(v)}
											title={v.color}
											className={`pd-swatch w-9 h-9 rounded-full border-2 focus:outline-none ${selectedVariant?._id === v._id ? "active" : "border-[#e8d8cc]"}`}
											style={{ backgroundColor: v.hexCode || "#ccc" }} />
									))}
								</div>
							</div>

							{/* ── Size selector ── */}
							<div className="mb-8">
								<p className="text-[10px] font-bold tracking-[.18em] uppercase text-[#c2784d] mb-3">Kích thước</p>
								<div className="flex flex-wrap gap-2">
									{selectedVariant?.sizes.map((s) => (
										<button key={s._id} onClick={() => setSelectedSize(s)}
											disabled={s.quantity === 0}
											className={`pd-size w-14 py-2.5 text-sm font-medium ${selectedSize?._id === s._id ? "active" : ""}`}>
											{s.size}
										</button>
									))}
								</div>
								{selectedSize && (
									<p className="text-xs text-[#a08070] mt-2">
										Còn lại: <span className="font-semibold text-[#5a4a3a]">{selectedSize.quantity}</span> đôi
									</p>
								)}
							</div>

							{/* ── Qty + Add to cart ── */}
							<div className="flex items-center gap-3 mb-8">
								{/* Qty */}
								<div className="flex items-center border border-[#e0d5c8] rounded-xl overflow-hidden bg-white h-12">
									<button onClick={() => setQuantity(Math.max(1, quantity - 1))}
										className="w-11 h-full flex items-center justify-center text-[#5a4a3a] hover:bg-[#fff3eb] transition-colors">
										<Minus size={14} />
									</button>
									<span className="w-10 text-center text-sm font-bold text-[#1a1914] border-x border-[#e0d5c8]">
										{quantity}
									</span>
									<button onClick={() => setQuantity(Math.min(selectedSize?.quantity || 99, quantity + 1))}
										className="w-11 h-full flex items-center justify-center text-[#5a4a3a] hover:bg-[#fff3eb] transition-colors">
										<Plus size={14} />
									</button>
								</div>

								{/* Add to cart */}
								<button onClick={handleAddToCart}
									disabled={!selectedSize || selectedSize?.quantity === 0 || addingCart}
									className="pd-atc flex-1 h-12 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2">
									{addingCart
										? <><Spinner size={17} color="white" /> Đang thêm...</>
										: selectedSize?.quantity === 0 ? "Hết hàng" : "Thêm vào giỏ hàng"
									}
								</button>
							</div>

							{/* ── Policies ── */}
							<div className="grid grid-cols-2 gap-3">
								{[
									{ Icon: Truck,        text: "Miễn phí vận chuyển toàn quốc" },
									{ Icon: ShieldCheck,  text: "Bảo hành chính hãng 12 tháng"  },
								].map(({ Icon, text }, i) => (
									<div key={i} className="flex items-center gap-2.5 bg-[#fdf8f4] border border-[#f0e5d8] rounded-xl px-3 py-3">
										<div className="w-7 h-7 rounded-lg bg-[#fff3eb] flex items-center justify-center shrink-0">
											<Icon size={14} className="text-[#c2784d]" />
										</div>
										<span className="text-xs text-[#6a5a4a] leading-snug">{text}</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* ── Reviews section ── */}
					<div className="border-t border-[#f0e5d8] pt-12">
						<div className="mb-8 flex items-end gap-3">
							<h2 className="pd-serif text-[#1a1914] text-2xl font-medium">Đánh giá sản phẩm</h2>
							{reviews.length > 0 && (
								<span className="text-sm text-[#a08070] mb-0.5">({reviews.length} nhận xét)</span>
							)}
						</div>
						<div className="w-8 h-0.5 bg-[#c2784d] mb-10 -mt-6" />

						<div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

							{/* ─── Write review ─── */}
							<div>
								<h3 className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-5">
									Viết đánh giá của bạn
								</h3>

								{!isLoggedIn ? (
									<div className="bg-white border border-[#f0e5d8] rounded-2xl p-8 text-center"
										style={{ boxShadow: "0 2px 12px rgba(194,120,77,.05)" }}>
										<div className="w-12 h-12 bg-[#fff3eb] rounded-full flex items-center justify-center mx-auto mb-4">
											<Star size={20} className="text-[#c2784d]" />
										</div>
										<p className="text-[#8a7060] text-sm mb-5">Bạn cần đăng nhập để viết đánh giá</p>
										<button onClick={() => navigate("/login")}
											className="bg-[#1a1914] hover:bg-[#c2784d] text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
											Đăng nhập ngay
										</button>
									</div>
								) : hasReviewed ? (
									<div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
										<p className="text-green-700 text-sm font-medium">
											Bạn đã đánh giá sản phẩm này rồi. Cảm ơn phản hồi của bạn! 🎉
										</p>
									</div>
								) : (
									<form onSubmit={handleSubmitReview}
										className="bg-white border border-[#f0e5d8] rounded-2xl p-6 space-y-5"
										style={{ boxShadow: "0 2px 12px rgba(194,120,77,.05)" }}>

										{/* Star picker */}
										<div>
											<p className="text-[10px] font-bold tracking-[.15em] uppercase text-[#c2784d] mb-2">Chọn số sao</p>
											<div className="flex gap-1">
												{[1, 2, 3, 4, 5].map((star) => (
													<button key={star} type="button"
														onClick={() => setRating(star)}
														onMouseEnter={() => setHoverStar(star)}
														onMouseLeave={() => setHoverStar(0)}
														className="transition-transform hover:scale-110">
														<Star size={26}
															className={`${star <= (hoverStar || rating) ? "text-amber-400 fill-amber-400" : "text-[#e0d5c8]"} transition-colors`} />
													</button>
												))}
											</div>
										</div>

										{/* Comment */}
										<div>
											<p className="text-[10px] font-bold tracking-[.15em] uppercase text-[#c2784d] mb-2">Nội dung</p>
											<textarea rows={4} value={comment}
												onChange={(e) => setComment(e.target.value)}
												placeholder="Chia sẻ cảm nhận của bạn về sản phẩm (tối thiểu 10 ký tự)..."
												className="w-full px-4 py-3 bg-[#faf7f4] border border-[#e0d5c8] rounded-xl text-sm text-[#1a1914] placeholder-[#c0b5a8] outline-none focus:border-[#c2784d] focus:bg-white focus:ring-2 focus:ring-[#c2784d]/10 transition-all resize-none" />
										</div>

										<button type="submit" disabled={isSubmitting}
											className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c2784d] hover:bg-[#a05e38] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60"
											style={{ boxShadow: "0 4px 14px rgba(194,120,77,.3)" }}>
											{isSubmitting ? <><Spinner size={15} color="white" /> Đang gửi...</> : "Gửi đánh giá"}
										</button>
									</form>
								)}
							</div>

							{/* ─── Review list ─── */}
							<div>
								<h3 className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-5">
									Nhận xét của khách hàng
								</h3>

								{reviews.length === 0 ? (
									<div className="bg-white border border-[#f0e5d8] rounded-2xl p-8 text-center">
										<p className="text-[#8a7060] text-sm italic">Chưa có đánh giá nào cho sản phẩm này.</p>
									</div>
								) : (
									<div className="space-y-3 max-h-120 overflow-y-auto pr-1"
										style={{ scrollbarWidth: "thin", scrollbarColor: "#e0d5c8 transparent" }}>
										{reviews.map((rev) => (
											<div key={rev._id}
												className="rev-card bg-white border border-[#f0e5d8] rounded-2xl p-5">
												<div className="flex items-start justify-between gap-2 mb-3">
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#fde8d8] to-[#f5cdb5] flex items-center justify-center text-[#c2784d] font-bold text-sm shrink-0"
															style={{ fontFamily: "'Playfair Display',serif" }}>
															{rev.user?.name?.charAt(0).toUpperCase() || "K"}
														</div>
														<div>
															<p className="text-sm font-semibold text-[#1a1914] leading-tight">
																{rev.user?.name || "Khách hàng"}
															</p>
															<div className="flex items-center gap-0.5 mt-0.5">
																{[...Array(5)].map((_, i) => (
																	<Star key={i} size={11}
																		className={i < rev.rating ? "text-amber-400 fill-amber-400" : "text-[#e0d5c8]"} />
																))}
															</div>
														</div>
													</div>
													<span className="text-[10px] text-[#b0a090] shrink-0 mt-1">
														{new Date(rev.createdAt).toLocaleDateString("vi-VN")}
													</span>
												</div>
												<p className="text-sm text-[#6a5a4a] leading-relaxed">{rev.comment}</p>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductDetail;