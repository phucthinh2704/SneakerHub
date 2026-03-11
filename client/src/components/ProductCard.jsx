import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Star, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { apiAddToCart } from "../api/cart"; // ← import API thêm giỏ hàng

const ProductCard = ({ product }) => {
	const mainImage = product.variants?.[0]?.images?.[0] || "";
	const hoverImage = product.variants?.[0]?.images?.[1] || mainImage;
	const price = new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(product.price);
	const rating = product.rating || 0;
	const ratingStr = rating > 0 ? rating.toFixed(1) : null;

	const [adding, setAdding] = useState(false);
	const navigate = useNavigate();

	const handleAddToCart = async (e) => {
		e.preventDefault(); // Ngăn Link điều hướng khi bấm nút
		e.stopPropagation();

		// Lấy variant đầu tiên có sẵn
		const firstVariant = product.variants?.[0];
		const firstColor = firstVariant?.color || "";
		const firstSize = firstVariant?.sizes?.[0]?.size || "";

		// Nếu không có variant hoặc cần chọn — chuyển đến trang chi tiết
		if (!firstVariant || !firstColor || !firstSize) {
			toast("Vui lòng chọn màu sắc và size trước khi thêm vào giỏ hàng", {
				icon: "👟",
				style: {
					background: "#1a1914",
					color: "#f0e8de",
					fontSize: "13px",
				},
			});
			navigate(`/product/${product.slug}`);
			return;
		}

		setAdding(true);
		try {
			const res = await apiAddToCart({
				product: product._id,
				name: product.name,
				image: firstVariant?.images?.[0] || "",
				price: product.price,
				color: firstColor,
				size: firstSize,
				quantity: 1,
			});

			if (res.success) {
				toast.success("Đã thêm vào giỏ hàng!", {
					style: {
						background: "#1a1914",
						color: "#f0e8de",
						fontSize: "13px",
					},
					iconTheme: { primary: "#c2784d", secondary: "#fff" },
				});
			} else {
				// Nếu API yêu cầu chọn thêm thông tin (size/màu cụ thể)
				toast("Vui lòng chọn size và màu sắc", {
					icon: "👟",
					style: {
						background: "#1a1914",
						color: "#f0e8de",
						fontSize: "13px",
					},
				});
				navigate(`/product/${product.slug}`);
			}
		} catch {
			toast.error("Vui lòng đăng nhập để thêm vào giỏ hàng");
		} finally {
			setAdding(false);
		}
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');
				.pcard { font-family:'DM Sans',sans-serif; }
				.pcard-serif { font-family:'Playfair Display',serif; }

				.pcard-wrap {
					transition: box-shadow .3s ease, transform .3s ease;
				}
				.pcard-wrap:hover {
					transform: translateY(-4px);
					box-shadow: 0 16px 40px rgba(194,120,77,.14);
				}

				.pcard-img-main  { transition: opacity .4s ease, transform .5s ease; }
				.pcard-img-hover { transition: opacity .4s ease, transform .5s ease; opacity:0; }
				.pcard-wrap:hover .pcard-img-main  { opacity:0; transform:scale(1.04); }
				.pcard-wrap:hover .pcard-img-hover { opacity:1; transform:scale(1.04); }

				.pcard-add {
					opacity:0; transform:translateY(8px);
					transition: all .25s ease;
				}
				.pcard-wrap:hover .pcard-add {
					opacity:1; transform:translateY(0);
				}

				.pcard-badge {
					animation: badgeIn .3s ease both;
				}
				@keyframes badgeIn {
					from { opacity:0; transform:scale(.8); }
					to   { opacity:1; transform:scale(1); }
				}
			`}</style>

			<div className="pcard pcard-wrap bg-white rounded-2xl overflow-hidden border border-[#f0e8e0]">
				{/* Image area */}
				<Link
					to={`/product/${product.slug}`}
					className="relative block overflow-hidden bg-[#faf6f2]"
					style={{ aspectRatio: "1 / 1" }}>
					{/* Main image */}
					<img
						src={mainImage}
						alt={product.name}
						className="pcard-img-main absolute inset-0 w-full h-full object-contain p-6"
					/>

					{/* Hover image */}
					<img
						src={hoverImage}
						alt={product.name}
						className="pcard-img-hover absolute inset-0 w-full h-full object-contain p-6"
					/>

					{/* Badges top-left */}
					<div className="absolute top-3 left-3 flex flex-col gap-1.5">
						{product.isNew && (
							<span className="pcard-badge bg-[#1a1914] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
								New
							</span>
						)}
						{product.discount > 0 && (
							<span className="pcard-badge bg-[#c2784d] text-white text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
								-{product.discount}%
							</span>
						)}
					</div>

					{/* Quick add button */}
					<div className="pcard-add absolute bottom-3 left-3 right-3">
						<button
							onClick={handleAddToCart}
							disabled={adding}
							className="w-full flex items-center justify-center gap-2 bg-[#1a1914]/90 hover:bg-[#c2784d] disabled:bg-[#c2784d] text-white text-xs font-bold py-2.5 rounded-xl backdrop-blur-sm transition-colors duration-200">
							{adding ? (
								<>
									<Loader
										size={13}
										className="animate-spin"
									/>{" "}
									Đang thêm...
								</>
							) : (
								<>
									<ShoppingBag size={13} /> Thêm vào giỏ
								</>
							)}
						</button>
					</div>
				</Link>

				{/* Info */}
				<div className="p-4">
					{/* Category */}
					<p className="text-[10px] font-bold tracking-[.15em] uppercase text-[#c2784d] mb-1">
						{product.category?.name || "Giày thể thao"}
					</p>

					{/* Name */}
					<h3 className="pcard-serif text-[#1a1914] font-medium text-sm leading-snug mb-2 line-clamp-2">
						<Link
							to={`/product/${product.slug}`}
							className="hover:text-[#c2784d] transition-colors">
							{product.name}
						</Link>
					</h3>

					{/* Price row */}
					<div className="flex items-center justify-between mt-auto pt-2 border-t border-[#f5ede4]">
						<div className="flex items-baseline gap-2">
							<span className="text-[#c2784d] font-bold text-sm">
								{price}
							</span>
							{product.originalPrice &&
								product.originalPrice > product.price && (
									<span className="text-[#c0b0a0] text-xs line-through">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(product.originalPrice)}
									</span>
								)}
						</div>

						{/* Rating */}
						{ratingStr && (
							<div className="flex items-center gap-1">
								<Star
									size={11}
									className="text-[#f0a050] fill-[#f0a050]"
								/>
								<span className="text-xs text-[#8a7060] font-medium">
									{ratingStr}
								</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default ProductCard;
