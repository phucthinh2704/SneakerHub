import React, { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import toast from "react-hot-toast";

const Contact = () => {
	const [loading, setLoading] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoading(true);
		// Giả lập gọi API gửi liên hệ
		setTimeout(() => {
			toast.success("Cảm ơn bạn! Chúng tôi sẽ liên hệ lại sớm nhất.");
			setLoading(false);
			e.target.reset();
		}, 1500);
	};

	return (
		<div className="bg-gray-50 min-h-screen py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-2xl mx-auto mb-12">
					<h1 className="text-4xl font-extrabold text-gray-900 mb-4">
						Liên Hệ Với Chúng Tôi
					</h1>
					<p className="text-gray-600">
						Bạn có câu hỏi, thắc mắc hay cần hỗ trợ? Đừng ngần ngại
						để lại lời nhắn, đội ngũ Shoe Store luôn sẵn sàng phục
						vụ bạn 24/7.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
					{/* Cột thông tin liên hệ */}
					<div className="lg:col-span-1 space-y-6">
						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
							<div className="bg-orange-100 p-3 rounded-full text-orange-600">
								<MapPin size={24} />
							</div>
							<div>
								<h3 className="font-bold text-gray-900 text-lg">
									Địa chỉ cửa hàng
								</h3>
								<p className="text-gray-600 mt-1">
									123 Nguyễn Văn Linh, Phường Tân An, TP. Cần Thơ, Việt Nam
								</p>
							</div>
						</div>

						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
							<div className="bg-orange-100 p-3 rounded-full text-orange-600">
								<Phone size={24} />
							</div>
							<div>
								<h3 className="font-bold text-gray-900 text-lg">
									Điện thoại
								</h3>
								<p className="text-gray-600 mt-1">
									Hotline: 1900 123 456
									<br />
									CSKH: 0909 123 456
								</p>
							</div>
						</div>

						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
							<div className="bg-orange-100 p-3 rounded-full text-orange-600">
								<Mail size={24} />
							</div>
							<div>
								<h3 className="font-bold text-gray-900 text-lg">
									Email
								</h3>
								<p className="text-gray-600 mt-1">
									support@shoestore.vn
									<br />
									collab@shoestore.vn
								</p>
							</div>
						</div>

						<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
							<div className="bg-orange-100 p-3 rounded-full text-orange-600">
								<Clock size={24} />
							</div>
							<div>
								<h3 className="font-bold text-gray-900 text-lg">
									Giờ mở cửa
								</h3>
								<p className="text-gray-600 mt-1">
									Thứ 2 - Chủ Nhật
									<br />
									08:00 AM - 22:00 PM
								</p>
							</div>
						</div>
					</div>

					{/* Cột Form liên hệ */}
					<div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Gửi lời nhắn
						</h2>
						<form
							onSubmit={handleSubmit}
							className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Họ và tên
									</label>
									<input
										required
										type="text"
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
										placeholder="Nhập họ tên của bạn"
									/>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Email
									</label>
									<input
										required
										type="email"
										className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
										placeholder="Nhập email của bạn"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Tiêu đề
								</label>
								<input
									required
									type="text"
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
									placeholder="Bạn cần hỗ trợ về vấn đề gì?"
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-2">
									Nội dung tin nhắn
								</label>
								<textarea
									required
									rows="5"
									className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
									placeholder="Chi tiết lời nhắn của bạn..."></textarea>
							</div>
							<button
								type="submit"
								disabled={loading}
								className="inline-flex items-center justify-center px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-70">
								{loading ? (
									"Đang gửi..."
								) : (
									<>
										<Send
											size={18}
											className="mr-2"
										/>{" "}
										Gửi tin nhắn
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Contact;
