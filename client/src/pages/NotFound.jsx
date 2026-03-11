import { Link } from "react-router-dom";
import { Home, ArrowRight, Search } from "lucide-react";

const NotFound = () => {
	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
				.nf-root  { font-family:'DM Sans',sans-serif; }
				.nf-serif { font-family:'Playfair Display',serif; }
				.nf-float {
					animation: nfFloat 4s ease-in-out infinite;
				}
				.nf-fade { animation: nfFadeUp .5s ease both; }
				.nf-fade-1 { animation-delay:.1s; }
				.nf-fade-2 { animation-delay:.2s; }
				.nf-fade-3 { animation-delay:.3s; }
				@keyframes nfFloat {
					0%,100% { transform: translateY(0);    }
					50%      { transform: translateY(-12px); }
				}
				@keyframes nfFadeUp {
					from { opacity:0; transform:translateY(20px); }
					to   { opacity:1; transform:translateY(0);    }
				}
				.nf-btn { transition: transform .2s, box-shadow .2s; }
				.nf-btn:hover { transform: translateY(-2px); }
			`}</style>

			<div className="nf-root bg-[#faf7f4] min-h-screen flex items-center justify-center px-4 py-16">
				<div className="text-center max-w-md w-full">
					{/* Floating shoe illustration (CSS art) */}
					<div className="nf-float flex justify-center mb-8">
						<div className="relative w-32 h-32">
							{/* Shoe shape via layered divs */}
							<div
								className="absolute inset-0 rounded-full bg-[#fff3eb] border-2 border-[#f0ddd0]"
								style={{
									boxShadow:
										"0 12px 40px rgba(194,120,77,.2)",
								}}
							/>
							<div className="absolute inset-0 flex items-center justify-center">
								{/* Simple sneaker SVG */}
								<svg
									viewBox="0 0 80 60"
									width="72"
									height="54"
									fill="none">
									<ellipse
										cx="40"
										cy="48"
										rx="32"
										ry="7"
										fill="#f0ddd0"
										opacity=".6"
									/>
									<path
										d="M8 40 Q12 28 24 26 L48 24 Q58 22 64 30 L68 38 Q52 44 8 44Z"
										fill="#c2784d"
									/>
									<path
										d="M24 26 L28 16 Q32 12 36 14 L44 22 L48 24Z"
										fill="#a05e38"
									/>
									<path
										d="M8 40 Q10 36 16 36 L60 36 Q64 36 68 38 L8 44Z"
										fill="#1a1914"
									/>
									{/* Laces */}
									<path
										d="M30 22 L32 18 M36 21 L37 17 M42 20 L42 16"
										stroke="white"
										strokeWidth="1.5"
										strokeLinecap="round"
									/>
									{/* Sole stripe */}
									<path
										d="M10 42 Q40 40 66 39"
										stroke="white"
										strokeWidth="1"
										opacity=".3"
										strokeLinecap="round"
									/>
								</svg>
							</div>
						</div>
					</div>

					{/* 404 */}
					<div className="nf-fade mb-3">
						<span
							className="nf-serif font-bold text-[#f0ddd0] select-none"
							style={{
								fontSize: "clamp(5rem,18vw,8rem)",
								lineHeight: 1,
								letterSpacing: "-.03em",
								textShadow: "0 4px 24px rgba(194,120,77,.15)",
							}}>
							404
						</span>
					</div>

					{/* Message */}
					<div className="nf-fade nf-fade-1 mb-2">
						<h2 className="nf-serif text-[#1a1914] font-medium text-2xl">
							Không tìm thấy trang
						</h2>
					</div>
					<div className="nf-fade nf-fade-2 mb-8">
						<p className="text-[#8a7060] text-sm leading-relaxed">
							Trang bạn đang tìm kiếm không tồn tại, đã bị xóa
							hoặc địa chỉ URL nhập sai.
							<br />
							Đừng lo — hãy quay lại và tiếp tục mua sắm nhé!
						</p>
					</div>

					{/* Divider */}
					<div className="nf-fade nf-fade-2 w-8 h-0.5 bg-[#c2784d] mx-auto mb-8" />

					{/* Actions */}
					<div className="nf-fade nf-fade-3 flex flex-col sm:flex-row items-center justify-center gap-3">
						<Link
							to="/"
							className="nf-btn inline-flex items-center gap-2 bg-[#1a1914] text-white font-bold text-sm px-6 py-3 rounded-xl"
							style={{
								boxShadow: "0 4px 20px rgba(26,25,20,.2)",
							}}>
							<Home size={15} /> Về trang chủ
						</Link>
						<Link
							to="/shop"
							className="nf-btn inline-flex items-center gap-2 bg-[#c2784d] text-white font-bold text-sm px-6 py-3 rounded-xl"
							style={{
								boxShadow: "0 4px 16px rgba(194,120,77,.35)",
							}}>
							<Search size={15} /> Khám phá giày{" "}
							<ArrowRight size={13} />
						</Link>
					</div>

					{/* Brand footer */}
					<div className="nf-fade nf-fade-3 mt-10">
						<p className="text-[10px] font-bold tracking-[.3em] uppercase text-[#c8b8a8]">
							SoleStore · Since 2024
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default NotFound;
