import React, { useState } from "react";
import { ShieldCheck, RefreshCw, Truck, Lock } from "lucide-react";

const Policy = () => {
	const [activeTab, setActiveTab] = useState("return");

	const policies = [
		{
			id: "return",
			icon: <RefreshCw size={20} />,
			label: "Chính sách đổi trả",
		},
		{
			id: "warranty",
			icon: <ShieldCheck size={20} />,
			label: "Chính sách bảo hành",
		},
		{
			id: "shipping",
			icon: <Truck size={20} />,
			label: "Chính sách vận chuyển",
		},
		{ id: "privacy", icon: <Lock size={20} />, label: "Bảo mật thông tin" },
	];

	return (
		<div className="bg-gray-50 min-h-screen py-12 font-sans">
			<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
					Trung Tâm Chính Sách
				</h1>

				<div className="flex flex-col md:flex-row gap-8">
					{/* Sidebar Tabs */}
					<div className="w-full md:w-1/3">
						<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
							{policies.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`w-full flex items-center p-4 border-b last:border-0 transition-colors ${
										activeTab === tab.id
											? "bg-orange-50 text-orange-600 font-bold border-l-4 border-l-orange-600"
											: "text-gray-600 hover:bg-gray-50"
									}`}>
									<span className="mr-3">{tab.icon}</span>
									{tab.label}
								</button>
							))}
						</div>
					</div>

					{/* Nội dung Policy */}
					<div className="w-full md:w-2/3 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 leading-relaxed text-gray-700">
						{activeTab === "return" && (
							<div className="space-y-4">
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Chính Sách Đổi Trả
								</h2>
								<p>
									Khách hàng có thể đổi trả sản phẩm trong
									vòng <strong>30 ngày</strong> kể từ ngày
									nhận hàng với các điều kiện sau:
								</p>
								<ul className="list-disc pl-5 space-y-2">
									<li>
										Sản phẩm còn nguyên vẹn, chưa qua sử
										dụng, chưa giặt ủi.
									</li>
									<li>
										Còn nguyên tem mác, hộp giày (nếu có) và
										hóa đơn mua hàng.
									</li>
									<li>
										Sản phẩm bị lỗi do nhà sản xuất (bung
										keo, đứt chỉ, nhầm size, nhầm màu).
									</li>
								</ul>
								<p className="mt-4 text-sm italic">
									* Phí vận chuyển đổi trả: Miễn phí nếu lỗi
									do shop. Khách hàng chịu phí 2 chiều nếu đổi
									nhu cầu (đổi size, đổi mẫu).
								</p>
							</div>
						)}

						{activeTab === "warranty" && (
							<div className="space-y-4">
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Chính Sách Bảo Hành
								</h2>
								<p>
									Tất cả giày thể thao chính hãng mua tại Shoe
									Store đều được bảo hành keo, chỉ trong thời
									gian <strong>12 tháng</strong>.
								</p>
								<h3 className="font-bold text-gray-900">
									Các trường hợp từ chối bảo hành:
								</h3>
								<ul className="list-disc pl-5 space-y-2 text-sm">
									<li>
										Giày bị rách, xước xát do vật sắc nhọn
										hoặc động vật cắn.
									</li>
									<li>
										Giày bị hư hỏng do ngâm nước lâu ngày,
										để nơi nhiệt độ cao.
									</li>
									<li>
										Sản phẩm giảm giá (Sale off &gt; 50%).
									</li>
								</ul>
							</div>
						)}

						{activeTab === "shipping" && (
							<div className="space-y-4">
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Chính Sách Vận Chuyển
								</h2>
								<p>
									Shoe Store hợp tác với các đơn vị vận chuyển
									uy tín (GHTK, Viettel Post) để giao hàng đến
									tận tay bạn.
								</p>
								<ul className="list-disc pl-5 space-y-2">
									<li>
										<strong>Nội thành TP. Cần Thơ:</strong> Giao
										trong 24h. Phí đồng giá 20.000đ.
									</li>
									<li>
										<strong>Ngoại thành & Các tỉnh:</strong>{" "}
										Giao từ 2-4 ngày. Phí đồng giá 35.000đ.
									</li>
									<li>
										<span className="text-orange-600 font-bold">
											Miễn phí vận chuyển
										</span>{" "}
										cho mọi đơn hàng có giá trị trên
										2.000.000đ.
									</li>
								</ul>
							</div>
						)}

						{activeTab === "privacy" && (
							<div className="space-y-4">
								<h2 className="text-2xl font-bold text-gray-900 mb-4">
									Bảo Mật Thông Tin
								</h2>
								<p>
									Việc bảo vệ thông tin cá nhân của bạn là ưu
									tiên hàng đầu của chúng tôi.
								</p>
								<p>
									Chúng tôi chỉ thu thập thông tin (Tên, SDT,
									Địa chỉ) để phục vụ cho việc giao hàng và
									chăm sóc khách hàng. Cam kết{" "}
									<strong>không mua bán, trao đổi</strong> dữ
									liệu cho bên thứ 3 dưới mọi hình thức.
								</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Policy;
