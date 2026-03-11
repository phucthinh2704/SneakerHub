import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const INFO_CARDS = [
	{
		Icon: MapPin,
		title: "Địa chỉ cửa hàng",
		lines: ["123 Nguyễn Văn Linh,", "Phường Tân An, TP. Cần Thơ"],
	},
	{
		Icon: Phone,
		title: "Điện thoại",
		lines: ["Hotline: 1900 123 456", "CSKH: 0909 123 456"],
	},
	{
		Icon: Mail,
		title: "Email",
		lines: ["support@solestore.vn", "collab@solestore.vn"],
	},
	{
		Icon: Clock,
		title: "Giờ mở cửa",
		lines: ["Thứ 2 – Chủ Nhật", "08:00 AM – 22:00 PM"],
	},
];

const Contact = () => {
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		name: "",
		email: "",
		subject: "",
		message: "",
	});

	const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

	const handleSubmit = () => {
		if (!form.name || !form.email || !form.subject || !form.message) {
			toast.error("Vui lòng điền đầy đủ thông tin.");
			return;
		}
		setLoading(true);
		setTimeout(() => {
			toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.");
			setLoading(false);
			setForm({ name: "", email: "", subject: "", message: "" });
		}, 1500);
	};

	const inputCls =
		"w-full bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl px-4 py-3 text-sm text-[#2d2418] placeholder-[#c0a898] outline-none transition focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15";

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
				.ct-root  { font-family:'DM Sans',sans-serif; }
				.ct-serif { font-family:'Playfair Display',serif; }
				.ct-card  { transition: border-color .2s, box-shadow .2s; }
				.ct-card:hover { border-color:rgba(194,120,77,.3); box-shadow:0 4px 20px rgba(194,120,77,.1); }
				.ct-fade { animation: ctFadeUp .4s ease both; }
				.ct-fade-1 { animation-delay:.05s; }
				.ct-fade-2 { animation-delay:.12s; }
				@keyframes ctFadeUp {
					from { opacity:0; transform:translateY(16px); }
					to   { opacity:1; transform:translateY(0);    }
				}
			`}</style>

			<div className="ct-root bg-[#faf7f4] min-h-screen py-12">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="text-center mb-12 ct-fade">
						<p className="text-[10px] font-bold tracking-[.3em] uppercase text-[#c2784d] mb-2">
							SoleStore
						</p>
						<h1
							className="ct-serif text-[#1a1914] font-medium"
							style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>
							Liên Hệ Với Chúng Tôi
						</h1>
						<div className="w-10 h-0.5 bg-[#c2784d] mx-auto mt-3" />
						<p className="text-[#8a7060] text-sm mt-4 max-w-xl mx-auto">
							Đội ngũ SoleStore luôn sẵn sàng phục vụ bạn 24/7.
							Đừng ngần ngại liên hệ khi cần hỗ trợ.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
						{/* Left — Info cards */}
						<div className="lg:col-span-2 space-y-3 ct-fade ct-fade-1">
							{INFO_CARDS.map(({ Icon, title, lines }) => (
								<div
									key={title}
									className="ct-card bg-white border border-[#f0e5d8] rounded-2xl p-5 flex items-start gap-4"
									style={{
										boxShadow:
											"0 2px 12px rgba(194,120,77,.05)",
									}}>
									<div className="w-10 h-10 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center shrink-0">
										<Icon
											size={17}
											className="text-[#c2784d]"
										/>
									</div>
									<div>
										<p className="text-sm font-bold text-[#1a1914] mb-1">
											{title}
										</p>
										{lines.map((l, i) => (
											<p
												key={i}
												className="text-xs text-[#8a7060] leading-relaxed">
												{l}
											</p>
										))}
									</div>
								</div>
							))}

							{/* Decorative brand block */}
							<div
								className="rounded-2xl overflow-hidden"
								style={{
									background:
										"linear-gradient(135deg,#1a1914,#2e2318)",
									boxShadow: "0 8px 32px rgba(26,25,20,.2)",
								}}>
								<div className="p-5">
									<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-2">
										SoleStore
									</p>
									<p className="ct-serif text-white text-base font-medium leading-snug mb-3">
										Mua sắm dễ dàng,
										<br />
										giao hàng tận nơi.
									</p>
									<p className="text-xs text-white/40 leading-relaxed">
										Hơn 500 mẫu giày chính hãng, chất lượng
										đảm bảo, đổi trả linh hoạt trong 30
										ngày.
									</p>
								</div>
							</div>
						</div>

						{/* Right — Form */}
						<div className="lg:col-span-3 ct-fade ct-fade-2">
							<div
								className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
								style={{
									boxShadow:
										"0 4px 32px rgba(194,120,77,.08)",
								}}>
								<div
									className="px-7 py-6 border-b border-[#f5ede4]"
									style={{
										background:
											"linear-gradient(135deg,#fdf8f4,#fffaf7)",
									}}>
									<h2 className="ct-serif text-[#1a1914] text-xl font-medium">
										Gửi lời nhắn
									</h2>
									<p className="text-xs text-[#a08070] mt-1">
										Chúng tôi sẽ phản hồi trong vòng 24 giờ
										làm việc.
									</p>
								</div>

								<div className="p-7 space-y-4">
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div>
											<label className="block text-xs font-bold text-[#7a5a40] uppercase tracking-wider mb-2">
												Họ và tên
											</label>
											<input
												type="text"
												value={form.name}
												onChange={set("name")}
												className={inputCls}
												placeholder="Nhập họ tên của bạn"
											/>
										</div>
										<div>
											<label className="block text-xs font-bold text-[#7a5a40] uppercase tracking-wider mb-2">
												Email
											</label>
											<input
												type="email"
												value={form.email}
												onChange={set("email")}
												className={inputCls}
												placeholder="email@example.com"
											/>
										</div>
									</div>

									<div>
										<label className="block text-xs font-bold text-[#7a5a40] uppercase tracking-wider mb-2">
											Tiêu đề
										</label>
										<input
											type="text"
											value={form.subject}
											onChange={set("subject")}
											className={inputCls}
											placeholder="Bạn cần hỗ trợ về vấn đề gì?"
										/>
									</div>

									<div>
										<label className="block text-xs font-bold text-[#7a5a40] uppercase tracking-wider mb-2">
											Nội dung
										</label>
										<textarea
											rows={5}
											value={form.message}
											onChange={set("message")}
											className={`${inputCls} resize-none`}
											placeholder="Chi tiết lời nhắn của bạn..."
										/>
									</div>

									<button
										onClick={handleSubmit}
										disabled={loading}
										className="w-full inline-flex items-center justify-center gap-2.5 bg-[#c2784d] text-white font-bold text-sm py-3.5 rounded-xl hover:bg-[#a05e38] transition-colors disabled:opacity-60"
										style={{
											boxShadow:
												"0 4px 16px rgba(194,120,77,.35)",
										}}>
										{loading ? (
											<>
												<span className="animate-spin">
													↻
												</span>{" "}
												Đang gửi...
											</>
										) : (
											<>
												<Send size={16} /> Gửi tin nhắn{" "}
												<ArrowRight size={14} />
											</>
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Contact;
