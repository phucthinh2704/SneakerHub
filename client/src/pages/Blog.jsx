import { Calendar, User, ArrowRight, ArrowUpRight } from "lucide-react";

const MOCK_BLOGS = [
	{
		id: 1,
		title: 'Mizuno "Blazing Flair" Pack: Khi Sắc Trắng Giao...',
		excerpt:
			"Không để anh em chờ đợi lâu, Mizuno đã chính thức khai xuân 2026 bằng...",
		image: "https://cdn.hstatic.net/files/200000278317/article/mizuno-blazing-flair-pack-2026-4_9d5e9786ce5a49b2b31a2f89a215f377_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/mizuno-blazing-flair-pack-2026",
		date: "20/05/2026",
		author: "Admin",
	},
	{
		id: 2,
		title: "Puma Light Up Pack: Thắp sáng sân cỏ với bộ sưu...",
		excerpt:
			"Thiết kế tối ưu cho cấu trúc bàn chân nữ (Women's Fit). Điểm khác biệt cốt...",
		image: "https://cdn.hstatic.net/files/200000278317/article/ht-up-pack-thap-sang-san-co-voi-bo-suu-tap-dac-quyen-danh-cho-phu-nu-1_e420ce8bc64f4253ab75dcda36af7b08_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/puma-light-up-pack-thap-sang-san-co-voi-bo-suu-tap-dac-quyen-danh-cho-phu-nu",
		date: "18/05/2026",
		author: "Admin",
	},
	{
		id: 3,
		title: "Nike Tiempo Maestro 2026: Đối đầu rực rỡ giữ...",
		excerpt:
			'Không để người chơi chờ lâu, NIKE tiếp tục tung "cú đúp" phối màu cho...',
		image: "https://cdn.hstatic.net/files/200000278317/article/nike-tiempo-maestro-2026-doi-dau-ruc-ro-giua-attack-va-black-pack-1_4bd9cd1bd1e1410cbe49f7a3c3ad080b_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/nike-tiempo-maestro-2026-doi-dau-ruc-ro-giua-attack-va-black-pack",
		date: "15/05/2026",
		author: "Shoe Expert",
	},
	{
		id: 4,
		title: "Vinicius Jr. x Nike Mercurial Vapor 16 Elite:...",
		excerpt:
			'Bước ngoặt từ "Đại sứ" đến "Biểu tượng Signature" — không phải...',
		image: "https://cdn.hstatic.net/files/200000278317/article/vini-jr-nike-mercurial-vapor-16-elite-1_c424a72ba06d4854bcc79d4247923433_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/vini-jr-nike-mercurial-vapor-16-elite",
		date: "12/05/2026",
		author: "Admin",
	},
	{
		id: 5,
		title: "TOP 20 GIÀY ĐÁ BÓNG NỔI BẬT NHẤT NĂM 2025",
		excerpt:
			'Năm 2025 là một năm "đánh thẳng vào cảm xúc" của cộng đồng giày đá...',
		image: "https://cdn.hstatic.net/files/200000278317/article/top-20-giay-da-bong-noi-bat-nhat-2025-21_5ba47d5f94af49e3a05c14eb6ecbceb6_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/top-20-giay-da-bong-noi-bat-nhat-2025",
		date: "10/05/2026",
		author: "Admin",
	},
	{
		id: 6,
		title: "Nike Tiempo Maestro vs Ligera: Khác nhau ở điểm...",
		excerpt:
			"Nếu bạn đã thấy Nike giới thiệu Tiempo Maestro từ đầu tháng 12, cảm giác...",
		image: "https://cdn.hstatic.net/files/200000278317/article/nike-tiempo-maestro-vs-ligera-khac-nhau-o-dau-4_dbee38525aa34c0897a95f70049507ef_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/nike-tiempo-maestro-vs-ligera-khac-nhau-o-dau",
		date: "08/05/2026",
		author: "Shoe Expert",
	},
	{
		id: 7,
		title: 'Adidas F50 TUNiT x Messi 2026: remake 2006 "huyền...',
		excerpt:
			"Có những đôi giày chỉ cần nhìn một đường nét là nhớ ngay cả một...",
		image: "https://cdn.hstatic.net/files/200000278317/article/adidas-f50-tunit-x-messi-2026-remake-2006-huyen-thoai-tro-lai-1_5cabac3d2a3847d7a5e70d472d55ef1a_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/adidas-f50-tunit-x-messi-2026-remake-2006-huyen-thoai-tro-lai",
		date: "05/05/2026",
		author: "Admin",
	},
	{
		id: 8,
		title: 'PUMA FUTURE 9 "Cosmic Art": phối màu bùng nổ...',
		excerpt:
			'PUMA mở màn 2026 bằng một phiên bản FUTURE 9 nhìn là biết "dành cho...',
		image: "https://cdn.hstatic.net/files/200000278317/article/puma-future-9-cosmic-art-3_9ed8323dceab4ea0b8b37701002f8da5_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/puma-future-9-cosmic-art",
		date: "01/05/2026",
		author: "Admin",
	},
	{
		id: 9,
		title: 'PUMA Eclipse Pack 2026: giày đen chuẩn "stealth"',
		excerpt:
			"Có những phối màu càng đơn giản càng dễ bán, và giày đen là ví...",
		image: "https://cdn.hstatic.net/files/200000278317/article/puma-eclipse-pack-2026-4_b31b954cba16412b8d68d9e39ff5e183_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/puma-eclipse-pack-2026",
		date: "28/04/2026",
		author: "Admin",
	},
	{
		id: 10,
		title: 'REVIEW TIEMPO LIGERA PRO TF - GIÀY "TÂN CỔ ĐIỂN"',
		excerpt:
			"Nếu mình nói Tiempo Ligera Pro TF là một trong những đôi giày đáng tiền...",
		image: "https://cdn.hstatic.net/files/200000278317/article/review-tiempo-ligera-pro-tf-1_30ce962b0f66458dbb4dde07a5491f03_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/review-tiempo-ligera-pro-tf",
		date: "25/04/2026",
		author: "Shoe Expert",
	},
	{
		id: 11,
		title: 'Adidas Predator 26 "Unlocked" - phối đỏ/trắng tôn vinh di sản',
		excerpt:
			"Có những phối màu ra mắt đầu năm chỉ để đẹp cho có. Nhưng với...",
		image: "https://cdn.hstatic.net/files/200000278317/article/predator-26-unlocked-mo-man-2026-3_68f9d67db19f47edb3546f49c1779c5a_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/predator-26-unlocked-mo-man-2026",
		date: "20/04/2026",
		author: "Admin",
	},
	{
		id: 12,
		title: 'Mizuno "Unity Sky" Pack mở màn 2026: Alpha III & Morelia Neo IV',
		excerpt:
			"Bước sang năm mới, nhiều hãng chọn cách đập vào mắt bằng những phối màu...",
		image: "https://cdn.hstatic.net/files/200000278317/article/mizuno-unity-sky-pack-mo-man-2026-alpha-iii-va-morelia-neo-iv-1_c40c0b19f3a7456b8c4f59981cd6aadf_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/mizuno-unity-sky-pack-mo-man-2026-alpha-iii-va-morelia-neo-iv",
		date: "15/04/2026",
		author: "Admin",
	},
	{
		id: 13,
		title: "Nike Ra Mắt Mercurial Vapor 16 Vini Jr Signature 2026",
		excerpt:
			"Nike ra mắt phiên bản chữ ký thứ 2 của Vinícius Júnior trong năm 2026...",
		image: "https://cdn.hstatic.net/files/200000278317/article/nike-mercurial-vapor-16-vini-jr-signature-2026-3_75df2c68c5594dfc86db634e499fa3b7_large.jpg",
		link: "https://thanhhungfutsal.com/blogs/tin-tuc/nike-mercurial-vapor-16-vini-jr-signature-2026",
		date: "15/04/2026",
		author: "Admin",
	},
];

// Featured = first item; rest = grid
const [featured, ...rest] = MOCK_BLOGS;

const Blog = () => (
	<>
		<style>{`
			@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
			.bl-root  { font-family:'DM Sans',sans-serif; }
			.bl-serif { font-family:'Playfair Display',serif; }

			.bl-card { transition: transform .25s ease, box-shadow .25s ease; }
			.bl-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(194,120,77,.12); }

			.bl-img { transition: transform .5s ease; }
			.bl-card:hover .bl-img { transform: scale(1.06); }

			.feat-img { transition: transform 8s ease; }
			.feat-card:hover .feat-img { transform: scale(1.03); }

			.tag-pill {
				background:#fff3eb; color:#c2784d;
				font-size:10px; font-weight:700; letter-spacing:.12em;
				text-transform:uppercase; padding:3px 10px; border-radius:999px;
				border:1px solid #f0ddd0;
			}
		`}</style>

		<div className="bl-root bg-[#faf7f4] min-h-screen">
			{/* ── Page header ── */}
			<div className="bg-white border-b border-[#f0e5d8] py-12 text-center">
				<p className="text-[10px] font-bold tracking-[.3em] uppercase text-[#c2784d] mb-2">
					SoleStore
				</p>
				<h1
					className="bl-serif text-[#1a1914] font-medium"
					style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}>
					Tin Tức & Xu Hướng
				</h1>
				<div className="w-10 h-0.5 bg-[#c2784d] mx-auto mt-3 mb-3" />
				<p className="text-[#8a7060] text-sm">
					Cập nhật thông tin mới nhất về thế giới Sneaker & Giày Bóng
					Đá
				</p>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* ── Featured post ── */}
				<a
					href={featured.link}
					target="_blank"
					rel="noopener noreferrer"
					className="feat-card group block bg-white rounded-2xl overflow-hidden border border-[#f0e5d8] mb-10 hover:shadow-xl transition-shadow duration-300"
					style={{ boxShadow: "0 4px 24px rgba(194,120,77,.08)" }}>
					<div className="flex flex-col md:flex-row">
						<div className="md:w-1/2 h-64 md:h-auto overflow-hidden relative">
							<img
								src={featured.image}
								alt={featured.title}
								className="feat-img w-full h-full object-cover"
							/>
							<span className="absolute top-4 left-4 tag-pill">
								Nổi bật
							</span>
						</div>
						<div className="md:w-1/2 p-8 md:p-10 flex flex-col justify-center">
							<div className="flex items-center gap-4 text-xs text-[#a08070] mb-4">
								<span className="flex items-center gap-1.5">
									<Calendar size={12} />
									{featured.date}
								</span>
								<span className="flex items-center gap-1.5">
									<User size={12} />
									{featured.author}
								</span>
							</div>
							<h2 className="bl-serif text-[#1a1914] font-medium text-xl md:text-2xl leading-snug mb-4 group-hover:text-[#c2784d] transition-colors">
								{featured.title}
							</h2>
							<p className="text-[#7a6a5a] text-sm leading-relaxed mb-6 line-clamp-3">
								{featured.excerpt}
							</p>
							<div className="inline-flex items-center gap-2 text-sm font-bold text-[#c2784d]">
								Đọc tiếp{" "}
								<ArrowRight
									size={14}
									className="transition-transform group-hover:translate-x-1"
								/>
							</div>
						</div>
					</div>
				</a>

				{/* ── Grid ── */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{rest.map((blog) => (
						<a
							key={blog.id}
							href={blog.link}
							target="_blank"
							rel="noopener noreferrer"
							className="bl-card group bg-white rounded-2xl overflow-hidden border border-[#f0e5d8] flex flex-col"
							style={{ boxShadow: "0 2px 12px rgba(0,0,0,.04)" }}>
							{/* Image */}
							<div className="h-48 overflow-hidden relative bg-[#f5ede4]">
								<img
									src={blog.image}
									alt={blog.title}
									className="bl-img w-full h-full object-cover"
								/>
								{blog.author === "Shoe Expert" && (
									<span className="absolute top-3 left-3 tag-pill">
										Expert
									</span>
								)}
							</div>

							{/* Body */}
							<div className="p-5 flex flex-col flex-1">
								<div className="flex items-center gap-3 text-[10px] text-[#a08070] mb-3">
									<span className="flex items-center gap-1">
										<Calendar size={11} />
										{blog.date}
									</span>
									<span className="flex items-center gap-1">
										<User size={11} />
										{blog.author}
									</span>
								</div>
								<h2 className="bl-serif text-[#1a1914] font-medium text-base leading-snug mb-2 line-clamp-2 group-hover:text-[#c2784d] transition-colors flex-1">
									{blog.title}
								</h2>
								<p className="text-[#8a7060] text-xs leading-relaxed mb-4 line-clamp-2">
									{blog.excerpt}
								</p>
								<div className="mt-auto pt-3 border-t border-[#f5ede4] flex items-center justify-between">
									<span className="text-xs font-bold text-[#c2784d] flex items-center gap-1">
										Đọc tiếp{" "}
										<ArrowRight
											size={12}
											className="transition-transform group-hover:translate-x-1"
										/>
									</span>
									<ArrowUpRight
										size={14}
										className="text-[#d0c0b0] group-hover:text-[#c2784d] transition-colors"
									/>
								</div>
							</div>
						</a>
					))}
				</div>
			</div>
		</div>
	</>
);

export default Blog;
