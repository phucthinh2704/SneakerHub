import { Award, Users, Smile, TrendingUp, ArrowRight } from "lucide-react";

// ── Shared style tokens ───────────────────────────────────────────────────────
const STYLES = `
	@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
	.ab-root  { font-family:'DM Sans',sans-serif; }
	.ab-serif { font-family:'Playfair Display',serif; }

	.ab-hero-img { animation: abZoom 14s ease infinite alternate; }
	@keyframes abZoom {
		from { transform:scale(1); }
		to   { transform:scale(1.05); }
	}

	.stat-card {
		transition: transform .25s ease, box-shadow .25s ease;
	}
	.stat-card:hover {
		transform: translateY(-5px);
		box-shadow: 0 16px 40px rgba(194,120,77,.13);
	}

	.fade-in { animation: fadeUp .6s ease both; }
	.fade-in-1 { animation-delay:.1s }
	.fade-in-2 { animation-delay:.2s }
	.fade-in-3 { animation-delay:.3s }
	.fade-in-4 { animation-delay:.4s }
	@keyframes fadeUp {
		from { opacity:0; transform:translateY(20px); }
		to   { opacity:1; transform:translateY(0); }
	}
`;

const STATS = [
	{ icon: Award, num: "10+", label: "Năm kinh nghiệm" },
	{ icon: Users, num: "50K+", label: "Khách hàng tin dùng" },
	{ icon: Smile, num: "99%", label: "Tỷ lệ hài lòng" },
	{ icon: TrendingUp, num: "100+", label: "Thương hiệu đối tác" },
];

const VALUES = [
	{
		title: "Chính hãng 100%",
		desc: "Mọi sản phẩm đều được nhập khẩu trực tiếp từ nhà phân phối chính thức.",
	},
	{
		title: "Đổi trả dễ dàng",
		desc: "30 ngày đổi trả không cần lý do — mua sắm không lo rủi ro.",
	},
	{
		title: "Tư vấn tận tâm",
		desc: "Đội ngũ chuyên gia giày sẵn sàng hỗ trợ bạn chọn đúng size và model.",
	},
	{
		title: "Giao hàng nhanh",
		desc: "Giao hàng toàn quốc trong 24h — đặt hôm nay, nhận ngày mai.",
	},
];

const About = () => (
	<>
		<style>{STYLES}</style>
		<div className="ab-root bg-white">
			{/* ── Hero Banner ─────────────────────────────────────────── */}
			<div
				className="relative overflow-hidden"
				style={{ height: "420px" }}>
				<div className="absolute inset-0 overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=2000&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNuZWFrZXJzfGVufDB8fDB8fHww"
						alt="About Banner"
						className="ab-hero-img absolute inset-0 w-full h-full object-cover"
					/>
					<div
						className="absolute inset-0"
						style={{
							background:
								"linear-gradient(160deg,rgba(15,12,8,.78) 0%,rgba(15,12,8,.45) 60%,rgba(194,120,77,.2) 100%)",
						}}
					/>
				</div>
				<div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
					<p className="text-[10px] font-bold tracking-[.3em] uppercase text-[#f0a070] mb-3">
						SoleStore
					</p>
					<h1
						className="ab-serif text-white font-medium mb-4"
						style={{ fontSize: "clamp(2.2rem,5vw,3.4rem)" }}>
						Về Chúng Tôi
					</h1>
					<div className="w-10 h-0.5 bg-[#c2784d] mb-4" />
					<p
						className="text-white/60 text-base max-w-md"
						style={{ fontWeight: 300 }}>
						Hành trình mang đến những bước chân êm ái cho người Việt
					</p>
				</div>
				{/* Breadcrumb */}
				<div className="absolute bottom-5 left-0 right-0">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-white/40">
						<span>Trang chủ</span>
						<span>/</span>
						<span className="text-[#c2784d]">Về chúng tôi</span>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* ── Our Story ──────────────────────────────────────────── */}
				<div className="flex flex-col md:flex-row items-center gap-14 py-20 border-b border-[#f5ede4]">
					{/* Image */}
					<div className="w-full md:w-1/2 relative">
						<div
							className="rounded-2xl overflow-hidden shadow-xl"
							style={{
								boxShadow: "0 20px 60px rgba(194,120,77,.15)",
							}}>
							<img
								src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
								alt="Our Story"
								className="w-full h-105 object-cover"
							/>
						</div>
						{/* Floating badge */}
						<div className="absolute -bottom-5 -right-5 bg-[#c2784d] text-white rounded-2xl px-6 py-4 shadow-lg hidden md:block">
							<p className="ab-serif text-2xl font-medium">
								2026
							</p>
							<p className="text-xs opacity-80 mt-0.5">
								Năm thành lập
							</p>
						</div>
					</div>

					{/* Text */}
					<div className="w-full md:w-1/2">
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-3">
							Câu chuyện của chúng tôi
						</p>
						<h2
							className="ab-serif text-[#1a1914] mb-6 leading-snug"
							style={{
								fontSize: "clamp(1.6rem,3vw,2.2rem)",
								fontWeight: 500,
							}}>
							Chúng tôi không chỉ bán giày,
							<br />
							chúng tôi bán phong cách.
						</h2>
						<div className="w-8 h-0.5 bg-[#c2784d] mb-6" />
						<p className="text-[#6a5a4a] leading-relaxed mb-4 text-sm">
							Được thành lập vào năm 2026, SoleStore bắt đầu với
							một sứ mệnh đơn giản: Cung cấp những đôi giày thể
							thao chất lượng cao nhất với mức giá hợp lý nhất cho
							người Việt.
						</p>
						<p className="text-[#6a5a4a] leading-relaxed text-sm mb-8">
							Chúng tôi tin rằng một đôi giày tốt sẽ đưa bạn đến
							những nơi tuyệt vời. Đội ngũ luôn nỗ lực tìm kiếm
							những mẫu mã mới nhất, công nghệ êm ái nhất để phục
							vụ đam mê của bạn.
						</p>
						<a
							href="/shop"
							className="inline-flex items-center gap-2 bg-[#c2784d] text-white text-sm font-bold px-6 py-3 rounded-xl hover:bg-[#a05e38] transition-colors group"
							style={{
								boxShadow: "0 4px 16px rgba(194,120,77,.3)",
							}}>
							Khám phá sản phẩm
							<ArrowRight
								size={14}
								className="transition-transform group-hover:translate-x-1"
							/>
						</a>
					</div>
				</div>

				{/* ── Stats ──────────────────────────────────────────────── */}
				<div className="py-20 border-b border-[#f5ede4]">
					<div className="text-center mb-12">
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-2">
							Con số biết nói
						</p>
						<h2 className="ab-serif text-[#1a1914] text-3xl font-medium">
							Hành trình của chúng tôi
						</h2>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-5">
						{STATS.map(({ icon: Icon, num, label }, i) => (
							<div
								key={i}
								className={`stat-card fade-in fade-in-${i + 1} bg-[#fdf8f4] border border-[#f0e5d8] rounded-2xl p-7 text-center`}>
								<div className="w-12 h-12 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center mx-auto mb-4">
									<Icon
										size={22}
										className="text-[#c2784d]"
									/>
								</div>
								<p className="ab-serif text-3xl font-semibold text-[#1a1914] mb-1">
									{num}
								</p>
								<p className="text-xs text-[#8a7060]">
									{label}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* ── Values ─────────────────────────────────────────────── */}
				<div className="py-20">
					<div className="text-center mb-12">
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-2">
							Cam kết của chúng tôi
						</p>
						<h2 className="ab-serif text-[#1a1914] text-3xl font-medium">
							Tại sao chọn SoleStore?
						</h2>
						<div className="w-10 h-0.5 bg-[#c2784d] mx-auto mt-4" />
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{VALUES.map(({ title, desc }, i) => (
							<div
								key={i}
								className="group p-6 bg-white border border-[#f0e5d8] rounded-2xl hover:border-[#c2784d]/30 hover:shadow-lg transition-all duration-300">
								<div className="w-8 h-8 rounded-lg bg-[#c2784d] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
									<span className="text-white text-sm font-bold">
										{String(i + 1).padStart(2, "0")}
									</span>
								</div>
								<h3 className="ab-serif text-[#1a1914] font-medium text-lg mb-2">
									{title}
								</h3>
								<p className="text-[#8a7060] text-sm leading-relaxed">
									{desc}
								</p>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	</>
);

export default About;
