import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice"; // Giả sử bạn đã có slice này

const Header = () => {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
		navigate("/login");
	};

	return (
		<header className="bg-white shadow-md sticky top-0 z-50">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
				<Link
					to="/"
					className="text-2xl font-bold text-orange-600">
					SHOE STORE
				</Link>

				<div className="hidden md:flex space-x-8">
					<Link
						to="/"
						className="text-gray-700 hover:text-orange-600">
						Trang chủ
					</Link>
					<Link
						to="/shop"
						className="text-gray-700 hover:text-orange-600">
						Sản phẩm
					</Link>
					<Link
						to="/about"
						className="text-gray-700 hover:text-orange-600">
						Về chúng tôi
					</Link>
				</div>

				<div className="flex items-center space-x-4">
					<Link
						to="/cart"
						className="relative text-gray-700 hover:text-orange-600">
						<ShoppingBag className="w-6 h-6" />
						{/* Nếu có thể, hãy lấy số lượng item từ Redux Cart Slice hiển thị ở đây */}
					</Link>

					{user ? (
						<div className="relative group">
							<button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600">
								<User className="w-6 h-6" />
								<span className="text-sm font-medium">
									{user.name}
								</span>
							</button>
							{/* Dropdown Menu */}
							<div className="absolute right-0 w-48 bg-white shadow-lg rounded-md py-2 hidden group-hover:block border">
								<Link
									to="/profile"
									className="block px-4 py-2 hover:bg-gray-100 text-sm">
									Tài khoản
								</Link>
								<Link
									to="/my-orders"
									className="block px-4 py-2 hover:bg-gray-100 text-sm">
									Đơn mua
								</Link>
								<button
									onClick={handleLogout}
									className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600 flex items-center">
									<LogOut className="w-4 h-4 mr-2" /> Đăng
									xuất
								</button>
							</div>
						</div>
					) : (
						<Link
							to="/login"
							className="text-sm font-medium bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700">
							Đăng nhập
						</Link>
					)}
				</div>
			</nav>
		</header>
	);
};

export default Header;
