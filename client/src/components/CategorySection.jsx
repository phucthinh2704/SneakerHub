import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetCategories } from "../api/product";

// ── Skeleton loader ───────────────────────────────────────────────────────────
const SkeletonCard = () => (
	<div className="rounded-2xl overflow-hidden bg-[#f0e8e0] animate-pulse">
		<div className="h-72 bg-[#e8ddd5]" />
		<div className="p-4">
			<div className="h-4 w-2/3 bg-[#e0d5cc] rounded-full" />
		</div>
	</div>
);

// ═════════════════════════════════════════════════════════════════════════════
const CategorySection = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await apiGetCategories();
				if (res.success) setCategories(res.result);
			} catch (error) {
				console.error("Lỗi tải danh mục:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchCategories();
	}, []);

	if (!loading && categories.length === 0) return null;

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.cat-root  { font-family: 'DM Sans', sans-serif; }
				.cat-title { font-family: 'Playfair Display', serif; }

				.cat-card {
					animation: catIn .4s ease both;
				}
				@keyframes catIn {
					from { opacity: 0; transform: translateY(16px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				.cat-card:nth-child(1) { animation-delay: .05s }
				.cat-card:nth-child(2) { animation-delay: .10s }
				.cat-card:nth-child(3) { animation-delay: .15s }
				.cat-card:nth-child(4) { animation-delay: .20s }
				.cat-card:nth-child(5) { animation-delay: .25s }
				.cat-card:nth-child(6) { animation-delay: .30s }

				.cat-img {
					transition: transform .6s cubic-bezier(.25,.46,.45,.94);
				}
				.cat-card:hover .cat-img { transform: scale(1.08); }

				.cat-overlay {
					background: linear-gradient(to top, rgba(20,15,10,.8) 0%, rgba(20,15,10,.15) 55%, transparent 100%);
					transition: opacity .3s ease;
				}
				.cat-card:hover .cat-overlay {
					background: linear-gradient(to top, rgba(194,120,77,.75) 0%, rgba(20,15,10,.2) 60%, transparent 100%);
				}

				.cat-hint {
					opacity: 0;
					transform: translateY(8px);
					transition: all .3s ease;
				}
				.cat-card:hover .cat-hint {
					opacity: 1;
					transform: translateY(0);
				}
				.cat-name {
					transition: color .3s ease;
				}
				.cat-card:hover .cat-name { color: white; }
			`}</style>

			<section className="cat-root py-16 bg-[#faf7f4]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* ── Header ── */}
					<div className="flex items-end justify-between mb-10">
						<div>
							<p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#c2784d] mb-2">
								Bộ sưu tập
							</p>
							<h2 className="cat-title text-3xl md:text-4xl font-medium text-[#1a1914]">
								Danh Mục Nổi Bật
							</h2>
							<div className="w-10 h-0.5 bg-[#c2784d] mt-3" />
						</div>

						<Link
							to="/shop"
							className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-[#c2784d] hover:text-[#a05e38] transition-colors group">
							Xem tất cả
							<ArrowRight
								size={15}
								className="transition-transform group-hover:translate-x-1"
							/>
						</Link>
					</div>

					{/* ── Grid ── */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
						{loading
							? Array.from({ length: 4 }).map((_, i) => (
									<SkeletonCard key={i} />
								))
							: categories.map((cat) => (
									<Link
										key={cat._id}
										to={`/shop?category=${cat.slug}`}
										className="cat-card group relative block overflow-hidden rounded-2xl"
										style={{
											boxShadow:
												"0 4px 20px rgba(0,0,0,.08)",
										}}>
										{/* Image */}
										<div className="relative h-64 md:h-72 overflow-hidden bg-[#e8ddd5]">
											<img
												src={
													cat.image ||
													"https://placehold.co/400x600/e8ddd5/a08070?text=No+Image"
												}
												alt={cat.name}
												className="cat-img absolute inset-0 w-full h-full object-cover object-center"
											/>
											{/* Gradient overlay */}
											<div className="cat-overlay absolute inset-0" />

											{/* Content */}
											<div className="absolute bottom-0 left-0 right-0 p-5">
												<h3 className="cat-name cat-title text-lg font-medium text-white/95">
													{cat.name}
												</h3>
												<div className="cat-hint flex items-center gap-1 mt-1.5">
													<span className="text-xs font-semibold text-white/80">
														Khám phá ngay
													</span>
													<ArrowRight
														size={12}
														className="text-white/80"
													/>
												</div>
											</div>

											{/* Top-right badge */}
											<div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
												<div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
													<ArrowRight
														size={13}
														className="text-white"
													/>
												</div>
											</div>
										</div>
									</Link>
								))}
					</div>

					{/* ── Mobile CTA ── */}
					<div className="mt-8 text-center md:hidden">
						<Link
							to="/shop"
							className="inline-flex items-center gap-2 text-sm font-bold text-[#c2784d] border border-[#c2784d]/30 px-6 py-2.5 rounded-full hover:bg-[#fff3eb] transition-colors">
							Xem tất cả danh mục <ArrowRight size={14} />
						</Link>
					</div>
				</div>
			</section>
		</>
	);
};

export default CategorySection;
