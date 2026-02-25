// src/layouts/AdminLayout.jsx
import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
	LayoutDashboard,
	ShoppingBag,
	Package,
	Users,
	LogOut,
	Menu,
	X,
  ListTree,
  Tag,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const AdminLayout = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const menuItems = [
		{
			title: "Tổng quan",
			path: "/admin/dashboard",
			icon: <LayoutDashboard size={20} />,
		},
		{
			title: "Đơn hàng",
			path: "/admin/orders",
			icon: <ShoppingBag size={20} />,
		},
		{
			title: "Sản phẩm",
			path: "/admin/products",
			icon: <Package size={20} />,
		},
		{
			title: "Danh mục",
			path: "/admin/categories",
			icon: <ListTree size={20} />,
		},
		{
			title: "Thương hiệu",
			path: "/admin/brands",
			icon: <Tag size={20} />,
		},
		{
			title: "Khách hàng",
			path: "/admin/users",
			icon: <Users size={20} />,
		},
	];

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-gray-100 flex font-sans">
			{/* Sidebar */}
			<aside
				className={`bg-gray-900 text-white w-64 shrink-0 transition-all duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} fixed md:relative z-50 h-screen`}>
				<div className="h-20 flex items-center justify-between px-6 border-b border-gray-800">
					<Link
						to="/"
						className="text-2xl font-extrabold tracking-tight text-white">
						ADMIN<span className="text-orange-500">PANEL</span>
					</Link>
					<button
						onClick={() => setIsSidebarOpen(false)}
						className="md:hidden text-gray-400 hover:text-white">
						<X size={24} />
					</button>
				</div>

				<nav className="p-4 space-y-2">
					{menuItems.map((item) => {
						const isActive = location.pathname.includes(item.path);
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
									isActive
										? "bg-orange-600 text-white"
										: "text-gray-400 hover:bg-gray-800 hover:text-white"
								}`}>
								{item.icon}
								<span className="font-medium">
									{item.title}
								</span>
							</Link>
						);
					})}
				</nav>

				<div className="absolute bottom-0 w-full p-4 border-t border-gray-800">
					<button
						onClick={handleLogout}
						className="flex items-center space-x-3 text-red-400 hover:text-red-300 transition-colors w-full px-4 py-2">
						<LogOut size={20} />
						<span className="font-medium">Đăng xuất</span>
					</button>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
				{/* Top Navbar */}
				<header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 shrink-0">
					<div className="flex items-center">
						<button
							onClick={() => setIsSidebarOpen(!isSidebarOpen)}
							className="text-gray-600 hover:text-gray-900 focus:outline-none">
							<Menu size={24} />
						</button>
						<h2 className="ml-4 text-xl font-bold text-gray-800 capitalize">
							{menuItems.find((item) =>
								location.pathname.includes(item.path),
							)?.title || "Quản trị"}
						</h2>
					</div>
					<div className="flex items-center space-x-4">
						<Link
							to="/"
							className="text-sm text-orange-600 font-medium hover:underline">
							Xem cửa hàng
						</Link>
						<div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-700">
							A
						</div>
					</div>
				</header>

				{/* Dynamic Content */}
				<div className="flex-1 overflow-auto p-6">
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default AdminLayout;
