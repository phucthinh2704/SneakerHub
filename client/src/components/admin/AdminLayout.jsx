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
	ChevronRight,
	Store,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/authSlice";

const MENU = [
	{ title: "Tổng quan", path: "/admin/dashboard", icon: LayoutDashboard },
	{ title: "Đơn hàng", path: "/admin/orders", icon: ShoppingBag },
	{ title: "Sản phẩm", path: "/admin/products", icon: Package },
	{ title: "Danh mục", path: "/admin/categories", icon: ListTree },
	{ title: "Thương hiệu", path: "/admin/brands", icon: Tag },
	{ title: "Khách hàng", path: "/admin/users", icon: Users },
];

const AdminLayout = () => {
	const [open, setOpen] = useState(true);
	const location = useLocation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const activeItem = MENU.find((m) => location.pathname.includes(m.path));

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
		navigate("/login");
	};

	return (
		<>
			<style>{`
				.adm-layout { font-family:'DM Sans',sans-serif; }
				.adm-logo   { font-family:'Syne',sans-serif; }
				.adm-nav-link { transition: background .15s, color .15s, transform .15s; }
				.adm-nav-link:hover { transform: translateX(3px); }
			`}</style>

			<div
				className="adm-layout min-h-screen flex"
				style={{ background: "#f4efe9" }}>
				{/* ── SIDEBAR ── */}
				<aside
					className={`shrink-0 h-screen sticky top-0 flex flex-col transition-all duration-300 z-50
					${open ? "w-60" : "w-0 md:w-16"} overflow-hidden`}
					style={{
						background:
							"linear-gradient(180deg,#1a1914 0%,#231e18 100%)",
					}}>
					{/* Logo */}
					<div className="h-16 flex items-center gap-3 px-4 border-b border-white/6 shrink-0">
						<div className="w-8 h-8 rounded-xl bg-[#c2784d] flex items-center justify-center shrink-0">
							<Store
								size={15}
								className="text-white"
							/>
						</div>
						{open && (
							<div className="overflow-hidden">
								<p className="adm-logo text-white font-bold text-sm leading-none">
									SoleStore
								</p>
								<p className="text-[10px] text-white/30 tracking-widest uppercase mt-0.5">
									Admin Panel
								</p>
							</div>
						)}
					</div>

					{/* Nav */}
					<nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
						{MENU.map(({ title, path, icon: Icon }) => {
							const isActive = location.pathname.includes(path);
							return (
								<Link
									key={path}
									to={path}
									className={`adm-nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group
										${
											isActive
												? "bg-[#c2784d] text-white"
												: "text-white/40 hover:bg-white/6 hover:text-white/80"
										}`}>
									<Icon
										size={17}
										className="shrink-0"
									/>
									{open && (
										<span className="truncate">
											{title}
										</span>
									)}
									{open && isActive && (
										<ChevronRight
											size={13}
											className="ml-auto opacity-70"
										/>
									)}
								</Link>
							);
						})}
					</nav>

					{/* Footer */}
					<div className="px-2 pb-4 border-t border-white/6 pt-3 shrink-0">
						<Link
							to="/"
							className="adm-nav-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-white/30 hover:text-white/60 hover:bg-white/4 mb-1">
							<Store
								size={15}
								className="shrink-0"
							/>
							{open && "Xem cửa hàng"}
						</Link>
						<button
							onClick={handleLogout}
							className="adm-nav-link w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/8">
							<LogOut
								size={15}
								className="shrink-0"
							/>
							{open && "Đăng xuất"}
						</button>
					</div>
				</aside>

				{/* ── MAIN ── */}
				<main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
					{/* Top bar */}
					<header
						className="h-16 bg-white/80 backdrop-blur border-b border-[#f0e5d8] flex items-center justify-between px-5 shrink-0"
						style={{ boxShadow: "0 1px 0 rgba(194,120,77,.08)" }}>
						<div className="flex items-center gap-3">
							<button
								onClick={() => setOpen(!open)}
								className="w-8 h-8 rounded-lg bg-[#fdf8f4] border border-[#e8d8cc] flex items-center justify-center text-[#8a7060] hover:bg-[#fff3eb] transition">
								<Menu size={16} />
							</button>
							<div>
								<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d]">
									SoleStore Admin
								</p>
								<h2 className="adm-logo text-[#1a1914] font-bold text-sm leading-none mt-0.5">
									{activeItem?.title || "Quản trị"}
								</h2>
							</div>
						</div>
						<div className="flex items-center gap-3">
							<Link
								to="/"
								className="text-xs font-semibold text-[#c2784d] hover:text-[#a05e38] transition">
								← Về cửa hàng
							</Link>
							<div className="w-8 h-8 rounded-xl bg-[#c2784d] flex items-center justify-center text-white text-xs font-bold adm-logo">
								A
							</div>
						</div>
					</header>

					{/* Page content */}
					<div className="flex-1 overflow-auto p-5">
						<Outlet />
					</div>
				</main>
			</div>
		</>
	);
};

export default AdminLayout;
