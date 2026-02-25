import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, LogOut, Menu, X, ShieldCheck } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Header = () => {
	const { user } = useSelector((state) => state.auth);
	// Nếu bạn có reducer quản lý giỏ hàng, lấy số lượng để hiển thị icon
	// const cartItems = useSelector(state => state.cart.cartItems) || [];
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation(); // Hook để lấy đường dẫn hiện tại

	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
		navigate("/login");
	};

	// Mảng chứa các menu chính để dễ quản lý và map ra UI
	const navLinks = [
		{ title: "Trang chủ", path: "/" },
		{ title: "Sản phẩm", path: "/shop" },
		{ title: "Về chúng tôi", path: "/about" },
		{ title: "Tin tức", path: "/blog" },
		{ title: "Liên hệ", path: "/contact" },
	];

	// Helper check active link
	const isActive = (path) => {
		if (path === "/" && location.pathname !== "/") return false;
		return location.pathname.startsWith(path);
	};

	return (
		<header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
				{/* LOGO */}
				<Link
					to="/"
					className="flex items-center space-x-2">
					<div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white font-black text-xl">
						S
					</div>
					<span className="text-2xl font-extrabold text-gray-900 tracking-tight">
						SHOE<span className="text-orange-600">STORE</span>
					</span>
				</Link>

				{/* DESKTOP MENU */}
				<div className="hidden lg:flex items-center space-x-8">
					{navLinks.map((link, index) => (
						<Link
							key={index}
							to={link.path}
							className={`text-sm font-bold uppercase tracking-wide transition-colors ${
								isActive(link.path)
									? "text-orange-600"
									: "text-gray-600 hover:text-orange-600"
							}`}>
							{link.title}
						</Link>
					))}
					{/* Nút Chính sách dạng nhỏ gọn hơn */}
					<Link
						to="/policy"
						className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center transition">
						<ShieldCheck
							size={16}
							className="mr-1"
						/>{" "}
						Chính sách
					</Link>
				</div>

				{/* ICONS & ACTIONS */}
				<div className="flex items-center space-x-5">
					{/* Giỏ hàng */}
					<Link
						to="/cart"
						className="relative text-gray-700 hover:text-orange-600 transition">
						<ShoppingBag className="w-6 h-6" />
						{/* Nếu có dữ liệu Redux Cart thì hiện số ở đây */}
						{/* <span className="absolute -top-1 -right-2 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {cartItems.length}
            </span> */}
					</Link>

					{/* User Menu */}
					{user ? (
						<div className="relative group hidden sm:block">
							<button className="flex items-center space-x-2 text-gray-700 hover:text-orange-600 focus:outline-none">
								<div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-orange-600 font-bold border border-orange-200">
									{user.name.charAt(0).toUpperCase()}
								</div>
								<span className="text-sm font-bold hidden md:block">
									{user.name.split(" ")[0]}
								</span>
							</button>

							{/* Dropdown Menu (Hover) */}
							<div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl rounded-xl py-2 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 border border-gray-100">
								<div className="px-4 py-2 border-b mb-2">
									<p className="text-sm text-gray-500">
										Xin chào,
									</p>
									<p className="text-sm font-bold text-gray-900 truncate">
										{user.name}
									</p>
								</div>
								{user.role === "admin" && (
									<Link
										to="/admin/dashboard"
										className="block px-4 py-2 text-sm text-blue-600 font-bold hover:bg-blue-50">
										Quản trị Admin
									</Link>
								)}
								<Link
									to="/profile"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
									Tài khoản của tôi
								</Link>
								<Link
									to="/my-orders"
									className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">
									Lịch sử đơn hàng
								</Link>

								<button
									onClick={handleLogout}
									className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-1 border-t flex items-center">
									<LogOut className="w-4 h-4 mr-2" /> Đăng
									xuất
								</button>
							</div>
						</div>
					) : (
						<Link
							to="/login"
							className="hidden sm:block text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-lg hover:bg-orange-600 transition-colors shadow-md hover:shadow-lg">
							Đăng nhập
						</Link>
					)}

					{/* Hamburger Menu (Mobile) */}
					<button
						className="lg:hidden text-gray-700"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
						{isMobileMenuOpen ? (
							<X size={28} />
						) : (
							<Menu size={28} />
						)}
					</button>
				</div>
			</nav>

			{/* --- MOBILE MENU --- */}
			{isMobileMenuOpen && (
				<div className="lg:hidden bg-white border-t absolute w-full left-0 shadow-xl">
					<div className="px-4 py-4 space-y-2">
						{navLinks.map((link, index) => (
							<Link
								key={index}
								to={link.path}
								onClick={() => setIsMobileMenuOpen(false)}
								className={`block px-4 py-3 rounded-lg text-base font-bold ${
									isActive(link.path)
										? "bg-orange-50 text-orange-600"
										: "text-gray-700 hover:bg-gray-50"
								}`}>
								{link.title}
							</Link>
						))}
						<Link
							to="/policy"
							onClick={() => setIsMobileMenuOpen(false)}
							className="block px-4 py-3 rounded-lg text-base font-bold text-gray-700 hover:bg-gray-50">
							Chính sách & Quy định
						</Link>

						<div className="border-t pt-4 mt-4">
							{user ? (
								<>
									<div className="px-4 mb-4 flex items-center space-x-3">
										<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<div>
											<p className="text-sm font-bold text-gray-900">
												{user.name}
											</p>
											<p className="text-xs text-gray-500">
												{user.email}
											</p>
										</div>
									</div>
									{user.role === "admin" && (
										<Link
											to="/admin/dashboard"
											onClick={() =>
												setIsMobileMenuOpen(false)
											}
											className="block px-4 py-3 text-blue-600 font-bold hover:bg-blue-50 rounded-lg">
											Quản trị Admin
										</Link>
									)}
									{/* SỬA 2 DÒNG NÀY */}
									<Link
										to="/profile"
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className="block px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-lg">
										Tài khoản của tôi
									</Link>
									<Link
										to="/my-orders"
										onClick={() =>
											setIsMobileMenuOpen(false)
										}
										className="block px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-lg">
										Lịch sử đơn hàng
									</Link>
									<button
										onClick={() => {
											handleLogout();
											setIsMobileMenuOpen(false);
										}}
										className="w-full text-left px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-lg flex items-center">
										<LogOut
											size={18}
											className="mr-2"
										/>{" "}
										Đăng xuất
									</button>
								</>
							) : (
								<Link
									to="/login"
									onClick={() => setIsMobileMenuOpen(false)}
									className="block w-full text-center bg-orange-600 text-white font-bold py-3 rounded-lg">
									Đăng nhập / Đăng ký
								</Link>
							)}
						</div>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
