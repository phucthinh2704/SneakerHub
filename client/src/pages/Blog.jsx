import React from "react";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_BLOGS = [
	{
		id: 1,
		title: "Xu hướng giày Sneaker nam hot nhất mùa hè 2024",
		excerpt:
			"Khám phá ngay những mẫu sneaker được dự đoán sẽ làm mưa làm gió trong cộng đồng thời trang giới trẻ hè này...",
		image: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		date: "15/05/2024",
		author: "Admin",
	},
	{
		id: 2,
		title: "Cách vệ sinh giày chạy bộ đúng chuẩn để bền như mới",
		excerpt:
			"Việc vệ sinh giày sai cách có thể làm hỏng form và giảm tuổi thọ của giày. Cùng chuyên gia Shoe Store tìm hiểu...",
		image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		date: "10/05/2024",
		author: "Shoe Expert",
	},
	{
		id: 3,
		title: "Phân biệt giày chính hãng và hàng Fake siêu cấp",
		excerpt:
			"Thị trường giày sneaker ngày càng lẫn lộn hàng thật giả. Bỏ túi ngay 5 mẹo nhận biết hàng chính hãng cực chuẩn...",
		image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
		date: "02/05/2024",
		author: "Admin",
	},
];

const Blog = () => {
	return (
		<div className="bg-gray-50 min-h-screen py-12 font-sans">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h1 className="text-4xl font-extrabold text-gray-900">
						Tin Tức & Xu Hướng
					</h1>
					<div className="w-24 h-1 bg-orange-600 mx-auto mt-4 mb-4 rounded-full"></div>
					<p className="text-gray-500">
						Cập nhật thông tin mới nhất về thế giới Sneaker
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{MOCK_BLOGS.map((blog) => (
						<div
							key={blog.id}
							className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition duration-300">
							<div className="h-56 overflow-hidden">
								<img
									src={blog.image}
									alt={blog.title}
									className="w-full h-full object-cover hover:scale-105 transition duration-500"
								/>
							</div>
							<div className="p-6">
								<div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
									<span className="flex items-center">
										<Calendar
											size={14}
											className="mr-1"
										/>{" "}
										{blog.date}
									</span>
									<span className="flex items-center">
										<User
											size={14}
											className="mr-1"
										/>{" "}
										{blog.author}
									</span>
								</div>
								<h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 cursor-pointer">
									{blog.title}
								</h2>
								<p className="text-gray-600 text-sm mb-4 line-clamp-3">
									{blog.excerpt}
								</p>
								<Link
									to="#"
									className="inline-flex items-center text-orange-600 font-bold hover:text-orange-800 transition">
									Đọc tiếp{" "}
									<ArrowRight
										size={16}
										className="ml-2"
									/>
								</Link>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Blog;
