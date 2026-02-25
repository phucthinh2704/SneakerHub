import React from "react";
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
	return (
		<footer className="bg-gray-900 text-white pt-16 pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					{/* Cột 1: Thông tin chung */}
					<div>
						<h3 className="text-2xl font-bold text-orange-600 mb-4">
							SHOE STORE
						</h3>
						<p className="text-gray-400 text-sm mb-6 leading-relaxed">
							Chúng tôi cung cấp những mẫu giày thể thao chính
							hãng, mới nhất và phong cách nhất dành cho bạn. Bước
							đi tự tin cùng Shoe Store.
						</p>
						<div className="flex space-x-4">
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition">
								<Facebook size={20} />
							</a>
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition">
								<Instagram size={20} />
							</a>
							<a
								href="#"
								className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-orange-600 transition">
								<Twitter size={20} />
							</a>
						</div>
					</div>

					{/* Cột 2: Liên kết nhanh */}
					<div>
						<h4 className="text-lg font-bold mb-4">Khám Phá</h4>
						<ul className="space-y-3 text-gray-400 text-sm">
							<li>
								<Link
									to="/"
									className="hover:text-orange-500 transition">
									Trang chủ
								</Link>
							</li>
							<li>
								<Link
									to="/about"
									className="hover:text-orange-500 transition">
									Về chúng tôi
								</Link>
							</li>
							<li>
								<Link
									to="/shop"
									className="hover:text-orange-500 transition">
									Sản phẩm mới
								</Link>
							</li>
							<li>
								<Link
									to="/blog"
									className="hover:text-orange-500 transition">
									Tin tức
								</Link>
							</li>
							<li>
								<Link
									to="/contact"
									className="hover:text-orange-500 transition">
									Liên hệ
								</Link>
							</li>
						</ul>
					</div>

					{/* Cột 3: Chính sách */}
					<div>
						<h4 className="text-lg font-bold mb-4">Chính Sách</h4>
						<ul className="space-y-3 text-gray-400 text-sm">
							<li>
								<Link
									to="/policy"
									className="hover:text-orange-500 transition">
									Chính sách đổi trả
								</Link>
							</li>
							<li>
								<Link
									to="/policy"
									className="hover:text-orange-500 transition">
									Chính sách bảo mật
								</Link>
							</li>
							<li>
								<Link
									to="/policy"
									className="hover:text-orange-500 transition">
									Điều khoản dịch vụ
								</Link>
							</li>
							<li>
								<Link
									to="/policy"
									className="hover:text-orange-500 transition">
									Hướng dẫn chọn size
								</Link>
							</li>
						</ul>
					</div>

					{/* Cột 4: Liên hệ */}
					<div>
						<h4 className="text-lg font-bold mb-4">Liên Hệ</h4>
						<ul className="space-y-4 text-gray-400 text-sm">
							<li className="flex items-start">
								<MapPin
									className="mr-3 text-orange-600 shrink-0"
									size={20}
								/>
								<span>
									123 Đường Nguyễn Văn Linh, Phường Tân An, TP. Cần Thơ
								</span>
							</li>
							<li className="flex items-center">
								<Phone
									className="mr-3 text-orange-600 shrink-0"
									size={20}
								/>
								<span>1900 123 456</span>
							</li>
							<li className="flex items-center">
								<Mail
									className="mr-3 text-orange-600 shrink-0"
									size={20}
								/>
								<span>support@shoestore.vn</span>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Footer */}
				<div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm">
					<p>
						&copy; {new Date().getFullYear()} Shoe Store. All rights
						reserved. Designed by You.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
