import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
	ShoppingBag,
	LogOut,
	Menu,
	X,
	ShieldCheck,
	ChevronDown,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const navLinks = [
	{ title: "Trang chủ", path: "/" },
	{ title: "Sản phẩm", path: "/shop" },
	{ title: "Về chúng tôi", path: "/about" },
	{ title: "Tin tức", path: "/blog" },
	{ title: "Liên hệ", path: "/contact" },
];

const Header = () => {
	const { user } = useSelector((s) => s.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
		navigate("/login");
	};

	const isActive = (path) => {
		if (path === "/" && location.pathname !== "/") return false;
		return location.pathname.startsWith(path);
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=DM+Sans:wght@400;500;600&display=swap');
				.hdr-root { font-family: 'DM Sans', sans-serif; }
				.hdr-logo { font-family: 'Playfair Display', serif; }

				.nav-link {
					position: relative;
					font-size: 13px;
					font-weight: 600;
					letter-spacing: .06em;
					color: #4a3a2a;
					transition: color .2s;
					text-decoration: none;
					padding-bottom: 2px;
				}
				.nav-link::after {
					content: '';
					position: absolute;
					bottom: -2px; left: 0;
					width: 0; height: 1.5px;
					background: #c2784d;
					transition: width .25s ease;
				}
				.nav-link:hover,
				.nav-link.active { color: #c2784d; }
				.nav-link:hover::after,
				.nav-link.active::after { width: 100%; }

				.user-dropdown {
					opacity: 0; visibility: hidden;
					transform: translateY(8px);
					transition: all .2s ease;
				}
				.user-trigger:hover .user-dropdown,
				.user-trigger:focus-within .user-dropdown {
					opacity: 1; visibility: visible;
					transform: translateY(0);
				}

				.mobile-menu {
					animation: slideDown .3s cubic-bezier(.22,1,.36,1);
				}
				@keyframes slideDown {
					from { opacity:0; transform:translateY(-10px); }
					to   { opacity:1; transform:translateY(0); }
				}
			`}</style>

			<header
				className="hdr-root bg-white border-b border-[#f0e5d8] sticky top-0 z-50"
				style={{ boxShadow: "0 1px 20px rgba(194,120,77,.08)" }}>
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
					{/* ── Logo ───────────────────────────────────────────── */}
					<Link
						to="/"
						className="flex items-center gap-2.5 shrink-0">
						<div
							className="w-9 h-9 rounded-xl bg-[#c2784d] flex items-center justify-center shadow-sm"
							style={{
								boxShadow: "0 2px 8px rgba(194,120,77,.35)",
							}}>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="white"
								strokeWidth="1.8"
								strokeLinecap="round">
								<path d="M3 14c0 2 1 3 3 3h12c1.5 0 3-1 3-3v-1H3v1z" />
								<path d="M3 13L6 7l3 2 3-3 3 3 3-2 1 4.5" />
							</svg>
						</div>
						<span className="hdr-logo text-xl font-semibold text-[#1a1914] tracking-tight">
							Sole<span className="text-[#c2784d]">Store</span>
						</span>
					</Link>

					{/* ── Desktop Nav ─────────────────────────────────────── */}
					<div className="hidden lg:flex items-center gap-8">
						{navLinks.map((link) => (
							<Link
								key={link.path}
								to={link.path}
								className={`nav-link ${isActive(link.path) ? "active" : ""}`}>
								{link.title}
							</Link>
						))}
						<Link
							to="/policy"
							className="nav-link flex items-center gap-1">
							<ShieldCheck
								size={13}
								className="opacity-70"
							/>{" "}
							Chính sách
						</Link>
					</div>

					{/* ── Actions ─────────────────────────────────────────── */}
					<div className="flex items-center gap-4">
						{/* Cart */}
						<Link
							to="/cart"
							className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#4a3a2a] hover:bg-[#fff3eb] hover:text-[#c2784d] transition-all">
							<ShoppingBag size={20} />
						</Link>

						{/* User */}
						{user ? (
							<div className="user-trigger relative hidden sm:block">
								<button className="flex items-center gap-2 h-9 px-3 rounded-xl hover:bg-[#fff3eb] transition-colors">
									<div className="w-7 h-7 rounded-full bg-[#fde8d8] border-2 border-[#c2784d]/30 flex items-center justify-center text-[#c2784d] text-xs font-bold">
										{user.name.charAt(0).toUpperCase()}
									</div>
									<span className="text-sm font-semibold text-[#3a2a1a] hidden md:block">
										{user.name}
									</span>
									<ChevronDown
										size={13}
										className="text-[#a08070]"
									/>
								</button>

								{/* Dropdown */}
								<div className="user-dropdown absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-[#f0e5d8] py-2 z-50">
									<div className="px-4 py-3 border-b border-[#f5ede4] mb-1">
										<p className="text-[10px] tracking-widest uppercase text-[#a0957e]">
											Xin chào
										</p>
										<p className="text-sm font-bold text-[#1a1914] truncate mt-0.5">
											{user.name}
										</p>
									</div>
									{user.role === "admin" && (
										<Link
											to="/admin/dashboard"
											className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
											<svg
												width="14"
												height="14"
												viewBox="0 0 24 24"
												fill="none"
												stroke="currentColor"
												strokeWidth="2">
												<rect
													x="3"
													y="3"
													width="7"
													height="7"
												/>
												<rect
													x="14"
													y="3"
													width="7"
													height="7"
												/>
												<rect
													x="3"
													y="14"
													width="7"
													height="7"
												/>
												<rect
													x="14"
													y="14"
													width="7"
													height="7"
												/>
											</svg>
											Quản trị Admin
										</Link>
									)}
									<Link
										to="/profile"
										className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3a2a1a] hover:bg-[#fff8f4] hover:text-[#c2784d] transition-colors">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2">
											<circle
												cx="12"
												cy="8"
												r="4"
											/>
											<path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
										</svg>
										Tài khoản của tôi
									</Link>
									<Link
										to="/my-orders"
										className="flex items-center gap-2 px-4 py-2.5 text-sm text-[#3a2a1a] hover:bg-[#fff8f4] hover:text-[#c2784d] transition-colors">
										<svg
											width="14"
											height="14"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2">
											<path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
											<rect
												x="9"
												y="3"
												width="6"
												height="4"
												rx="1"
											/>
										</svg>
										Lịch sử đơn hàng
									</Link>
									<div className="border-t border-[#f5ede4] mt-1 pt-1">
										<button
											onClick={handleLogout}
											className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
											<LogOut size={14} /> Đăng xuất
										</button>
									</div>
								</div>
							</div>
						) : (
							<Link
								to="/login"
								className="hidden sm:flex items-center gap-1.5 text-sm font-bold text-white bg-[#c2784d] px-5 py-2 rounded-xl hover:bg-[#a05e38] transition-all"
								style={{
									boxShadow: "0 2px 10px rgba(194,120,77,.3)",
								}}>
								Đăng nhập
							</Link>
						)}

						{/* Hamburger */}
						<button
							className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-[#4a3a2a] hover:bg-[#fff3eb] transition-colors"
							onClick={() => setMobileOpen(!mobileOpen)}>
							{mobileOpen ? <X size={22} /> : <Menu size={22} />}
						</button>
					</div>
				</nav>

				{/* ── Mobile Menu ─────────────────────────────────────────── */}
				{mobileOpen && (
					<div className="mobile-menu lg:hidden bg-white border-t border-[#f0e5d8] px-4 pb-5 pt-3">
						<div className="space-y-0.5 mb-4">
							{navLinks.map((link) => (
								<Link
									key={link.path}
									to={link.path}
									onClick={() => setMobileOpen(false)}
									className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-colors
										${isActive(link.path) ? "bg-[#fff3eb] text-[#c2784d]" : "text-[#3a2a1a] hover:bg-[#faf7f4]"}`}>
									{link.title}
								</Link>
							))}
							<Link
								to="/policy"
								onClick={() => setMobileOpen(false)}
								className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#3a2a1a] hover:bg-[#faf7f4] transition-colors">
								<ShieldCheck
									size={14}
									className="text-[#a0957e]"
								/>{" "}
								Chính sách & Quy định
							</Link>
						</div>

						<div className="border-t border-[#f0e5d8] pt-4">
							{user ? (
								<>
									<div className="flex items-center gap-3 px-4 mb-3">
										<div className="w-10 h-10 rounded-full bg-[#fde8d8] border-2 border-[#c2784d]/30 flex items-center justify-center text-[#c2784d] font-bold">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<div>
											<p className="text-sm font-bold text-[#1a1914]">
												{user.name}
											</p>
											<p className="text-xs text-[#a0957e]">
												{user.email}
											</p>
										</div>
									</div>
									{user.role === "admin" && (
										<Link
											to="/admin/dashboard"
											onClick={() => setMobileOpen(false)}
											className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
											Quản trị Admin
										</Link>
									)}
									<Link
										to="/profile"
										onClick={() => setMobileOpen(false)}
										className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#3a2a1a] hover:bg-[#faf7f4] transition-colors">
										Tài khoản của tôi
									</Link>
									<Link
										to="/my-orders"
										onClick={() => setMobileOpen(false)}
										className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-[#3a2a1a] hover:bg-[#faf7f4] transition-colors">
										Lịch sử đơn hàng
									</Link>
									<button
										onClick={() => {
											handleLogout();
											setMobileOpen(false);
										}}
										className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
										<LogOut size={16} /> Đăng xuất
									</button>
								</>
							) : (
								<Link
									to="/login"
									onClick={() => setMobileOpen(false)}
									className="block w-full text-center bg-[#c2784d] text-white font-bold py-3 rounded-xl hover:bg-[#a05e38] transition-colors">
									Đăng nhập / Đăng ký
								</Link>
							)}
						</div>
					</div>
				)}
			</header>
		</>
	);
};

export default Header;
