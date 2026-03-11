import { Link } from "react-router-dom";
import {
	Facebook,
	Instagram,
	Twitter,
	MapPin,
	Phone,
	Mail,
} from "lucide-react";

const Footer = () => {
	const year = new Date().getFullYear();
	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.ftr { font-family:'DM Sans',sans-serif; }
				.ftr-serif { font-family:'Playfair Display',serif; }
				.ftr-link{ color:#7a6a5a;font-size:13px;text-decoration:none;transition:color .2s; }
				.ftr-link:hover{ color:#c2784d; }
				.soc{ width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;
					  background:#f5ede4;border:1px solid #edd5c0;color:#c2784d;transition:all .2s;text-decoration:none; }
				.soc:hover{ background:#c2784d;border-color:#c2784d;color:#fff;transform:translateY(-2px);
					        box-shadow:0 4px 12px rgba(194,120,77,.3); }
			`}</style>

			<footer className="ftr bg-[#fdf8f4]">
				<div className="h-0.5 bg-linear-to-r from-transparent via-[#c2784d] to-transparent opacity-40" />

				{/* Newsletter */}
				<div className="bg-[#fff3eb] border-b border-[#f0ddd0]">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-5">
						<div>
							<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-1">
								Ưu đãi độc quyền
							</p>
							<p className="ftr-serif text-xl text-[#1a1914]">
								Đăng ký nhận tin & nhận ngay 10% off
							</p>
						</div>
						<div className="flex gap-2 w-full md:w-auto">
							<input
								type="email"
								placeholder="email@example.com"
								className="flex-1 md:w-64 bg-white border border-[#e8d8cc] rounded-xl px-4 py-2.5 text-sm text-[#3a2a1a] placeholder-[#b0a090] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/10 transition-all"
							/>
							<button
								className="px-5 py-2.5 bg-[#c2784d] hover:bg-[#a05e38] text-white text-sm font-bold rounded-xl transition-all whitespace-nowrap"
								style={{
									boxShadow:
										"0 2px 10px rgba(194,120,77,.25)",
								}}>
								Đăng ký
							</button>
						</div>
					</div>
				</div>

				{/* Grid */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
						{/* Brand */}
						<div>
							<div className="flex items-center gap-2.5 mb-5">
								<div
									className="w-9 h-9 rounded-xl bg-[#c2784d] flex items-center justify-center shrink-0"
									style={{
										boxShadow:
											"0 2px 8px rgba(194,120,77,.3)",
									}}>
									<svg
										width="17"
										height="17"
										viewBox="0 0 24 24"
										fill="none"
										stroke="white"
										strokeWidth="1.8"
										strokeLinecap="round">
										<path d="M3 14c0 2 1 3 3 3h12c1.5 0 3-1 3-3v-1H3v1z" />
										<path d="M3 13L6 7l3 2 3-3 3 3 3-2 1 4.5" />
									</svg>
								</div>
								<span className="ftr-serif text-xl text-[#1a1914]">
									SoleStore
								</span>
							</div>
							<p className="text-[#8a7060] text-sm leading-relaxed mb-6">
								Những mẫu giày thể thao chính hãng, mới nhất và
								phong cách nhất. Bước đi tự tin cùng SoleStore.
							</p>
							<div className="flex gap-2">
								{[
									<Facebook size={15} />,
									<Instagram size={15} />,
									<Twitter size={15} />,
								].map((ic, i) => (
									<a
										key={i}
										href="#"
										className="soc">
										{ic}
									</a>
								))}
							</div>
						</div>

						{/* Khám phá */}
						<div>
							<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-5">
								Khám Phá
							</p>
							<ul className="space-y-3">
								{[
									{ l: "Trang chủ", p: "/" },
									{ l: "Về chúng tôi", p: "/about" },
									{ l: "Sản phẩm mới", p: "/shop" },
									{ l: "Tin tức", p: "/blog" },
									{ l: "Liên hệ", p: "/contact" },
								].map((x) => (
									<li key={x.p}>
										<Link
											to={x.p}
											className="ftr-link">
											{x.l}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Chính sách */}
						<div>
							<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-5">
								Chính Sách
							</p>
							<ul className="space-y-3">
								{[
									"Chính sách đổi trả",
									"Chính sách bảo mật",
									"Điều khoản dịch vụ",
									"Hướng dẫn chọn size",
								].map((l) => (
									<li key={l}>
										<Link
											to="/policy"
											className="ftr-link">
											{l}
										</Link>
									</li>
								))}
							</ul>
						</div>

						{/* Liên hệ */}
						<div>
							<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-5">
								Liên Hệ
							</p>
							<ul className="space-y-4">
								{[
									{
										ic: <MapPin size={13} />,
										t: "123 Đường Nguyễn Văn Linh, Phường Tân An, TP. Cần Thơ",
									},
									{
										ic: <Phone size={13} />,
										t: "1900 123 456",
									},
									{
										ic: <Mail size={13} />,
										t: "support@solestore.vn",
									},
								].map((x, i) => (
									<li
										key={i}
										className="flex items-start gap-3">
										<div className="w-7 h-7 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center shrink-0 mt-0.5 text-[#c2784d]">
											{x.ic}
										</div>
										<span className="text-[#8a7060] text-sm leading-relaxed">
											{x.t}
										</span>
									</li>
								))}
							</ul>
							<div className="mt-5 p-3.5 bg-[#fff3eb] border border-[#f0ddd0] rounded-xl">
								<p className="text-[10px] uppercase tracking-widest text-[#c2784d] mb-1.5 font-semibold">
									Giờ làm việc
								</p>
								<p className="text-sm text-[#5a4a3a]">
									T2 – T6: 8:00 – 22:00
								</p>
								<p className="text-sm text-[#5a4a3a]">
									T7 – CN: 9:00 – 21:00
								</p>
							</div>
						</div>
					</div>

					{/* Bottom */}
					<div className="border-t border-[#edd5c0] pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
						<p className="text-[#a09080] text-xs">
							&copy; {year} SoleStore. All rights reserved.
						</p>
						<div className="flex items-center gap-1.5">
							{["Visa", "Mastercard", "MoMo", "ZaloPay"].map(
								(p) => (
									<span
										key={p}
										className="px-2.5 py-1 bg-white border border-[#e8d8cc] rounded-lg text-[10px] text-[#8a7060] font-semibold">
										{p}
									</span>
								),
							)}
						</div>
					</div>
				</div>
			</footer>
		</>
	);
};
export default Footer;
