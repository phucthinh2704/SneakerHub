import React, { useState } from "react";
import {
	ShieldCheck,
	RefreshCw,
	Truck,
	Lock,
	ChevronRight,
} from "lucide-react";

const POLICIES = [
	{
		id: "return",
		Icon: RefreshCw,
		label: "Đổi trả",
		sublabel: "30 ngày đổi trả dễ dàng",
		accent: "#c2784d",
		content: {
			title: "Chính Sách Đổi Trả",
			intro: "Khách hàng có thể đổi trả sản phẩm trong vòng 30 ngày kể từ ngày nhận hàng với các điều kiện sau:",
			items: [
				{
					heading: "Sản phẩm còn nguyên vẹn",
					detail: "Chưa qua sử dụng, chưa giặt ủi, còn nguyên tem mác và hộp giày (nếu có).",
				},
				{
					heading: "Kèm hóa đơn mua hàng",
					detail: "Giữ lại biên lai hoặc email xác nhận đơn hàng để làm căn cứ đổi trả.",
				},
				{
					heading: "Lỗi từ nhà sản xuất",
					detail: "Bung keo, đứt chỉ, nhầm size hoặc nhầm màu so với đơn hàng.",
				},
			],
			note: "Phí vận chuyển đổi trả miễn phí nếu lỗi do shop. Khách hàng chịu phí 2 chiều nếu đổi theo nhu cầu (đổi size, đổi mẫu).",
		},
	},
	{
		id: "warranty",
		Icon: ShieldCheck,
		label: "Bảo hành",
		sublabel: "12 tháng bảo hành chính hãng",
		accent: "#4a8c6e",
		content: {
			title: "Chính Sách Bảo Hành",
			intro: "Tất cả giày thể thao chính hãng mua tại SoleStore đều được bảo hành keo và chỉ trong thời gian 12 tháng.",
			items: [
				{
					heading: "Bung keo đế giày",
					detail: "Bảo hành toàn bộ phần đế và keo dán trong điều kiện sử dụng bình thường.",
				},
				{
					heading: "Đứt chỉ thân giày",
					detail: "Lỗi về chỉ may do sản xuất được bảo hành không giới hạn số lần.",
				},
			],
			note: "Các trường hợp từ chối: Giày bị rách do vật sắc nhọn, ngâm nước lâu ngày, để nhiệt độ cao, hoặc sản phẩm giảm giá trên 50%.",
		},
	},
	{
		id: "shipping",
		Icon: Truck,
		label: "Vận chuyển",
		sublabel: "Giao nhanh toàn quốc",
		accent: "#4a6b9e",
		content: {
			title: "Chính Sách Vận Chuyển",
			intro: "SoleStore hợp tác với GHTK và Viettel Post để giao hàng nhanh chóng đến tận tay bạn trên toàn quốc.",
			items: [
				{
					heading: "Nội thành TP. Cần Thơ",
					detail: "Giao trong 24 giờ. Phí đồng giá 20.000đ.",
				},
				{
					heading: "Ngoại thành & Các tỉnh",
					detail: "Giao từ 2–4 ngày. Phí đồng giá 35.000đ.",
				},
				{
					heading: "Miễn phí vận chuyển",
					detail: "Áp dụng cho mọi đơn hàng có giá trị trên 2.000.000đ.",
				},
			],
			note: "Thời gian giao hàng có thể thay đổi vào các dịp lễ, tết hoặc thiên tai. Chúng tôi sẽ thông báo khi có phát sinh.",
		},
	},
	{
		id: "privacy",
		Icon: Lock,
		label: "Bảo mật",
		sublabel: "Dữ liệu được bảo vệ tuyệt đối",
		accent: "#7a5c9e",
		content: {
			title: "Bảo Mật Thông Tin",
			intro: "Việc bảo vệ thông tin cá nhân của khách hàng là ưu tiên hàng đầu tại SoleStore.",
			items: [
				{
					heading: "Thu thập có mục đích",
					detail: "Chúng tôi chỉ thu thập Tên, SĐT và Địa chỉ để phục vụ giao hàng và chăm sóc khách hàng.",
				},
				{
					heading: "Cam kết không bán dữ liệu",
					detail: "Tuyệt đối không mua bán, trao đổi thông tin cá nhân với bên thứ 3 dưới mọi hình thức.",
				},
				{
					heading: "Lưu trữ an toàn",
					detail: "Dữ liệu được mã hóa và lưu trữ trên hệ thống bảo mật đạt tiêu chuẩn quốc tế.",
				},
			],
			note: "Bạn có quyền yêu cầu xóa toàn bộ dữ liệu cá nhân bất kỳ lúc nào bằng cách liên hệ với chúng tôi qua email support@solestore.vn.",
		},
	},
];

const Policy = () => {
	const [activeTab, setActiveTab] = useState("return");
	const active = POLICIES.find((p) => p.id === activeTab);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');
				.pol-root  { font-family:'DM Sans',sans-serif; }
				.pol-serif { font-family:'Playfair Display',serif; }
				.pol-tab   { transition: background .18s, border-color .18s, color .18s; }
				.pol-panel { animation: polSlide .25s ease both; }
				@keyframes polSlide {
					from { opacity:0; transform:translateY(8px); }
					to   { opacity:1; transform:translateY(0);   }
				}
			`}</style>

			<div className="pol-root bg-[#faf7f4] min-h-screen py-12">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="text-center mb-10">
						<p className="text-[10px] font-bold tracking-[.3em] uppercase text-[#c2784d] mb-2">
							SoleStore
						</p>
						<h1
							className="pol-serif text-[#1a1914] font-medium"
							style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>
							Trung Tâm Chính Sách
						</h1>
						<div className="w-10 h-0.5 bg-[#c2784d] mx-auto mt-3" />
						<p className="text-[#8a7060] text-sm mt-4 max-w-xl mx-auto">
							Mua sắm an tâm với các chính sách minh bạch và công
							bằng dành cho mọi khách hàng.
						</p>
					</div>

					{/* Tab cards (horizontal on md+) */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
						{POLICIES.map((p) => {
							const isActive = p.id === activeTab;
							return (
								<button
									key={p.id}
									onClick={() => setActiveTab(p.id)}
									className={`pol-tab rounded-2xl p-4 text-left border-2 flex flex-col gap-2 ${
										isActive
											? "bg-white border-[#c2784d] shadow-md"
											: "bg-white/60 border-transparent hover:border-[#f0ddd0] hover:bg-white"
									}`}
									style={
										isActive
											? {
													boxShadow:
														"0 4px 20px rgba(194,120,77,.15)",
												}
											: {}
									}>
									<div
										className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
											isActive
												? "bg-[#c2784d]"
												: "bg-[#f5ede4]"
										}`}>
										<p.Icon
											size={16}
											className={
												isActive
													? "text-white"
													: "text-[#c2784d]"
											}
										/>
									</div>
									<div>
										<p
											className={`text-sm font-bold ${isActive ? "text-[#1a1914]" : "text-[#5a4a3a]"}`}>
											{p.label}
										</p>
										<p className="text-[10px] text-[#a08070] mt-0.5 leading-snug">
											{p.sublabel}
										</p>
									</div>
									{isActive && (
										<div className="mt-auto flex items-center gap-1 text-[10px] font-bold text-[#c2784d] uppercase tracking-wider">
											Đang xem <ChevronRight size={10} />
										</div>
									)}
								</button>
							);
						})}
					</div>

					{/* Content panel */}
					{active && (
						<div
							key={active.id}
							className="pol-panel bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
							style={{
								boxShadow: "0 4px 32px rgba(194,120,77,.08)",
							}}>
							{/* Panel header */}
							<div
								className="px-7 py-6 border-b border-[#f5ede4] flex items-center gap-4"
								style={{
									background:
										"linear-gradient(135deg,#fdf8f4,#fffaf7)",
								}}>
								<div className="w-11 h-11 rounded-2xl bg-[#c2784d] flex items-center justify-center shrink-0">
									<active.Icon
										size={20}
										className="text-white"
									/>
								</div>
								<div>
									<h2 className="pol-serif text-[#1a1914] text-xl font-medium">
										{active.content.title}
									</h2>
									<p className="text-xs text-[#a08070] mt-0.5">
										{active.sublabel}
									</p>
								</div>
							</div>

							<div className="px-7 py-7 space-y-6">
								<p className="text-[#5a4a3a] text-sm leading-relaxed">
									{active.content.intro}
								</p>

								{/* Items */}
								<div className="space-y-3">
									{active.content.items.map((item, i) => (
										<div
											key={i}
											className="flex gap-4 p-4 rounded-xl bg-[#fdf8f4] border border-[#f0e5d8]">
											<div className="w-6 h-6 rounded-full bg-[#c2784d] text-white flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
												{i + 1}
											</div>
											<div>
												<p className="text-sm font-semibold text-[#1a1914]">
													{item.heading}
												</p>
												<p className="text-xs text-[#8a7060] mt-1 leading-relaxed">
													{item.detail}
												</p>
											</div>
										</div>
									))}
								</div>

								{/* Note */}
								<div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
									<span className="text-base shrink-0">
										📌
									</span>
									<p className="text-xs text-[#7a5a30] leading-relaxed italic">
										{active.content.note}
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Policy;
