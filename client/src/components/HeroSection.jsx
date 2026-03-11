import { Link } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

const HeroSection = ({ onBuyNowClick }) => {
	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
				.hero-root  { font-family:'DM Sans',sans-serif; }
				.hero-serif { font-family:'Playfair Display',serif; }

				.hero-img { animation: heroZoom 12s ease infinite alternate; }
				@keyframes heroZoom {
					from { transform: scale(1); }
					to   { transform: scale(1.06); }
				}

				.hero-content { animation: heroFadeUp .9s cubic-bezier(.22,1,.36,1) both; }
				@keyframes heroFadeUp {
					from { opacity:0; transform:translateY(32px); }
					to   { opacity:1; transform:translateY(0); }
				}
				.hero-badge  { animation: heroFadeUp .7s .1s both cubic-bezier(.22,1,.36,1); }
				.hero-h1     { animation: heroFadeUp .7s .2s both cubic-bezier(.22,1,.36,1); }
				.hero-sub    { animation: heroFadeUp .7s .35s both cubic-bezier(.22,1,.36,1); }
				.hero-btns   { animation: heroFadeUp .7s .45s both cubic-bezier(.22,1,.36,1); }
				.hero-stats  { animation: heroFadeUp .7s .55s both cubic-bezier(.22,1,.36,1); }

				.btn-primary {
					background: linear-gradient(135deg,#c2784d 0%,#a05e38 100%);
					transition: all .25s ease;
					position: relative; overflow: hidden;
				}
				.btn-primary::before {
					content:''; position:absolute; inset:0;
					background: linear-gradient(135deg,#d4895e 0%,#b06840 100%);
					opacity:0; transition:opacity .25s;
				}
				.btn-primary:hover::before { opacity:1; }
				.btn-primary:active { transform:scale(.97); }
				.btn-primary > * { position:relative; z-index:1; }

				.btn-outline {
					transition: all .25s ease;
					backdrop-filter: blur(6px);
				}
				.btn-outline:hover {
					background: rgba(255,255,255,.15);
				}

				.scroll-hint {
					animation: bounce 2s ease infinite;
				}
				@keyframes bounce {
					0%,100% { transform:translateY(0); }
					50%      { transform:translateY(6px); }
				}
			`}</style>

			<div
				className="hero-root relative overflow-hidden"
				style={{
					minHeight: "600px",
					height: "92vh",
					maxHeight: "760px",
				}}>
				{/* Background */}
				<div className="absolute inset-0 overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
						alt="Hero Banner"
						className="hero-img absolute inset-0 w-full h-full object-cover"
					/>
					{/* Gradient overlay */}
					<div
						className="absolute inset-0"
						style={{
							background:
								"linear-gradient(110deg, rgba(15,12,8,.82) 0%, rgba(15,12,8,.55) 50%, rgba(15,12,8,.2) 100%)",
						}}
					/>
					{/* Copper glow bottom-right */}
					<div
						className="absolute bottom-0 right-0 w-150 h-100 opacity-20"
						style={{
							background:
								"radial-gradient(ellipse at bottom right, #c2784d, transparent 70%)",
						}}
					/>
				</div>

				{/* Content */}
				<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
					<div className="max-w-xl">
						{/* Badge */}
						<div className="hero-badge inline-flex items-center gap-2 bg-[#c2784d]/20 border border-[#c2784d]/40 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
							<Zap
								size={12}
								className="text-[#f0a070]"
							/>
							<span className="text-xs font-bold tracking-widest uppercase text-[#f0c0a0]">
								Bộ sưu tập 2025
							</span>
						</div>

						{/* Heading */}
						<h1
							className="hero-serif hero-h1 text-white leading-tight mb-5"
							style={{
								fontSize: "clamp(2.4rem,5vw,3.6rem)",
								fontWeight: 500,
							}}>
							Nâng Tầm
							<br />
							<span style={{ color: "#f0a070" }}>Bước Chạy</span>
							<br />
							Của Bạn
						</h1>

						{/* Subtext */}
						<p
							className="hero-sub text-white/65 text-base md:text-lg mb-8 leading-relaxed max-w-md"
							style={{
								fontFamily: "'DM Sans',sans-serif",
								fontWeight: 300,
							}}>
							Khám phá bộ sưu tập giày thể thao mới nhất với công
							nghệ đệm khí tiên tiến — thoải mái, phong cách và
							bền bỉ.
						</p>

						{/* Buttons */}
						<div className="hero-btns flex flex-wrap gap-3 mb-12">
							<button
								onClick={onBuyNowClick}
								className="btn-primary flex items-center gap-2 text-white font-bold text-sm px-7 py-3.5 rounded-full"
								style={{
									boxShadow:
										"0 4px 20px rgba(194,120,77,.45)",
								}}>
								<span>Mua Ngay</span>
								<ArrowRight size={15} />
							</button>
							<Link
								to="/about"
								className="btn-outline flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold text-sm px-7 py-3.5 rounded-full">
								Tìm Hiểu Thêm
							</Link>
						</div>

						{/* Stats */}
						<div className="hero-stats flex items-center gap-6">
							{[
								{ num: "500+", label: "Mẫu giày" },
								{ num: "50K+", label: "Khách hàng" },
								{ num: "4.9★", label: "Đánh giá" },
							].map((s, i) => (
								<div
									key={i}
									className="flex flex-col">
									<span
										className="text-white font-bold text-lg leading-none"
										style={{
											fontFamily:
												"'Playfair Display',serif",
										}}>
										{s.num}
									</span>
									<span className="text-white/45 text-xs mt-0.5">
										{s.label}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Scroll hint */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
					<span className="text-[10px] tracking-widest uppercase text-white/30">
						Cuộn xuống
					</span>
					<div className="scroll-hint w-5 h-8 border border-white/20 rounded-full flex items-start justify-center pt-1.5">
						<div className="w-1 h-1.5 bg-white/40 rounded-full" />
					</div>
				</div>
			</div>
		</>
	);
};

export default HeroSection;
