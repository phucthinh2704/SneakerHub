import {
	Camera,
	Lock,
	LogOut,
	Mail,
	MapPin,
	Package,
	Phone,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { apiUploadImage } from "../api/admin";
import Swal from "sweetalert2";
import { apiCancelMyOrder, apiGetMyOrders } from "../api/order";
import { apiGetUserProfile, apiUpdateUserProfile } from "../api/user";
import { loginSuccess, logout } from "../redux/authSlice";

/* ─── Shared helpers ────────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');`;

const Spinner = ({ size = 20, color = "#c2784d" }) => (
	<svg
		className="animate-spin"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke={color}
		strokeWidth="2">
		<circle
			cx="12"
			cy="12"
			r="10"
			strokeOpacity=".2"
		/>
		<path
			d="M12 2a10 10 0 0 1 10 10"
			stroke={color}
		/>
	</svg>
);

const fmt = (n) =>
	new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency: "VND",
	}).format(n);

const INPUT =
	"w-full pl-10 pr-4 py-3 bg-[#faf7f4] border border-[#e0d5c8] rounded-xl text-sm text-[#1a1914] placeholder-[#c0b5a8] outline-none focus:border-[#c2784d] focus:bg-white focus:ring-2 focus:ring-[#c2784d]/10 transition-all";
const INPUT_RO =
	"w-full pl-10 pr-4 py-3 bg-[#f0ebe5] border border-[#e0d5c8] rounded-xl text-sm text-[#a08070] outline-none cursor-not-allowed";

const Label = ({ children }) => (
	<p className="text-[10px] font-bold tracking-[.18em] uppercase text-[#c2784d] mb-1.5">
		{children}
	</p>
);
const SecHead = ({ icon: Icon, title }) => (
	<div className="flex items-center gap-3 mb-6 pb-5 border-b border-[#f5ede4]">
		<div className="w-9 h-9 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
			<Icon
				size={15}
				className="text-[#c2784d]"
			/>
		</div>
		<h2
			style={{ fontFamily: "'Playfair Display',serif" }}
			className="text-[#1a1914] text-lg font-medium">
			{title}
		</h2>
	</div>
);

const STATUS_CFG = {
	Delivered: {
		label: "Đã giao",
		cls: "bg-green-100 text-green-700",
		dot: "bg-green-500",
	},
	Cancelled: {
		label: "Đã hủy",
		cls: "bg-red-100 text-red-600",
		dot: "bg-red-500",
	},
	Shipping: {
		label: "Đang giao",
		cls: "bg-blue-100 text-blue-700",
		dot: "bg-blue-500",
	},
	Pending: {
		label: "Chờ xử lý",
		cls: "bg-amber-100 text-amber-700",
		dot: "bg-amber-400",
	},
};
const Badge = ({ status }) => {
	const s = STATUS_CFG[status] || {
		label: status,
		cls: "bg-gray-100 text-gray-600",
		dot: "bg-gray-400",
	};
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${s.cls}`}>
			<span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
		</span>
	);
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE
───────────────────────────────────────────────────────────────────────────── */
const Profile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState("info");
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState(null);
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		fetchProfile();
	}, []); // eslint-disable-line

	const fetchProfile = async () => {
		try {
			const res = await apiGetUserProfile();
			if (res.success) setUserData(res.result);
		} catch (error) {
			console.error(error);
			toast.error("Phiên đăng nhập hết hạn");
			dispatch(logout());
			navigate("/login");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		dispatch(logout());
		localStorage.removeItem("token");
		localStorage.removeItem("userInfo");
		navigate("/login");
		toast.success("Đã đăng xuất");
	};

	const handleAvatarUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (!file.type.startsWith("image/"))
			return toast.error("Vui lòng chọn file hình ảnh!");
		setUploading(true);
		const tid = toast.loading("Đang tải ảnh lên...");
		try {
			const fd = new FormData();
			fd.append("image", file);
			const up = await apiUploadImage(fd);
			if (up.success) {
				const upd = await apiUpdateUserProfile({ avatar: up.url });
				if (upd.success) {
					toast.success("Cập nhật Avatar thành công!", { id: tid });
					setUserData(upd.result);
					localStorage.setItem("token", upd.token);
					localStorage.setItem(
						"userInfo",
						JSON.stringify(upd.result),
					);
					dispatch(
						loginSuccess({ user: upd.result, token: upd.token }),
					);
				}
			}
		} catch (error) {
			console.error(error);
			toast.error("Lỗi khi tải ảnh lên!", { id: tid });
		} finally {
			setUploading(false);
		}
	};

	const TABS = [
		{ id: "info", Icon: User, label: "Thông tin tài khoản" },
		{ id: "orders", Icon: Package, label: "Lịch sử đơn hàng" },
		{ id: "password", Icon: Lock, label: "Đổi mật khẩu" },
	];

	if (loading)
		return (
			<>
				<style>{FONTS}</style>
				<div
					style={{ fontFamily: "'DM Sans',sans-serif" }}
					className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f4] gap-3">
					<Spinner size={36} />
					<p className="text-sm text-[#a08070] tracking-widest uppercase">
						Đang tải...
					</p>
				</div>
			</>
		);

	return (
		<>
			<style>
				{FONTS +
					`
				.pr-tab { transition:all .18s; border-left:3px solid transparent; }
				.pr-tab.active { border-left-color:#c2784d; background:#fff8f3; color:#c2784d; }
				.pr-tab:not(.active):hover { background:#faf7f4; color:#3a2a1a; }
			`}
			</style>

			<div
				style={{ fontFamily: "'DM Sans',sans-serif" }}
				className="bg-[#faf7f4] min-h-screen py-10">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* ── Hero card ──────────────────────────────────── */}
					<div
						className="bg-white rounded-2xl border border-[#f0e5d8] p-6 mb-7 flex flex-col sm:flex-row items-center sm:items-start gap-6"
						style={{
							boxShadow: "0 4px 28px rgba(194,120,77,.08)",
						}}>
						{/* Avatar block */}
						<div className="relative shrink-0">
							<div
								className="w-24 h-24 rounded-2xl overflow-hidden bg-linear-to-br from-[#fde8d8] to-[#f5cdb5] flex items-center justify-center text-[#c2784d] font-bold text-3xl"
								style={{
									fontFamily: "'Playfair Display',serif",
									boxShadow:
										"0 0 0 3px #fff,0 0 0 5px #f0ddd0",
								}}>
								{userData?.avatar ? (
									<img
										src={userData.avatar}
										alt="avatar"
										className="w-full h-full object-cover"
									/>
								) : (
									userData?.name?.charAt(0).toUpperCase()
								)}
							</div>
							<input
								type="file"
								id="avatar-upload"
								accept="image/*"
								className="hidden"
								onChange={handleAvatarUpload}
								disabled={uploading}
							/>
							<label
								htmlFor="avatar-upload"
								className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#c2784d] hover:bg-[#a05e38] text-white rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-lg">
								{uploading ? (
									<Spinner
										size={13}
										color="white"
									/>
								) : (
									<Camera size={13} />
								)}
							</label>
						</div>

						{/* Name / email */}
						<div className="flex-1 text-center sm:text-left">
							<p className="text-[10px] font-bold tracking-[.22em] uppercase text-[#c2784d] mb-1">
								Tài khoản
							</p>
							<h1
								style={{
									fontFamily: "'Playfair Display',serif",
								}}
								className="text-2xl font-medium text-[#1a1914] mb-1">
								{userData?.name}
							</h1>
							<p className="text-sm text-[#8a7060] mb-3">
								{userData?.email}
							</p>
							<span className="inline-block px-3 py-1 bg-[#fff3eb] border border-[#f0ddd0] text-[#c2784d] text-[10px] font-bold tracking-widest uppercase rounded-full">
								{userData?.role}
							</span>
						</div>

						<button
							onClick={handleLogout}
							className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#f0e5d8] text-sm text-[#8a7060] hover:border-red-200 hover:text-red-500 hover:bg-red-50 transition-all">
							<LogOut size={15} /> Đăng xuất
						</button>
					</div>

					{/* ── Content layout ─────────────────────────────── */}
					<div className="flex flex-col md:flex-row gap-6">
						{/* Sidebar */}
						<aside className="w-full md:w-56 shrink-0">
							<nav
								className="bg-white rounded-2xl border border-[#f0e5d8] overflow-hidden"
								style={{
									boxShadow:
										"0 2px 12px rgba(194,120,77,.05)",
								}}>
								{TABS.map(({ id, Icon, label }) => (
									<button
										key={id}
										onClick={() => setActiveTab(id)}
										className={`pr-tab w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium ${activeTab === id ? "active" : "text-[#5a4a3a]"}`}>
										<Icon size={15} /> {label}
									</button>
								))}
								<div className="border-t border-[#f5ede4]">
									<button
										onClick={handleLogout}
										className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
										<LogOut size={15} /> Đăng xuất
									</button>
								</div>
							</nav>
						</aside>

						{/* Main */}
						<main
							className="flex-1 bg-white rounded-2xl border border-[#f0e5d8] p-6 md:p-8"
							style={{
								boxShadow: "0 2px 12px rgba(194,120,77,.05)",
							}}>
							{activeTab === "info" && (
								<ProfileInfo
									user={userData}
									dispatch={dispatch}
								/>
							)}
							{activeTab === "orders" && <MyOrders />}
							{activeTab === "password" && <ChangePassword />}
						</main>
					</div>
				</div>
			</div>
		</>
	);
};

/* ─────────────────────────────────────────────────────────────────────────────
   PROFILE INFO
───────────────────────────────────────────────────────────────────────────── */
const ProfileInfo = ({ user, dispatch }) => {
	const [form, setForm] = useState({
		name: user?.name || "",
		email: user?.email || "",
		phone: user?.phone || "",
		address: user?.address || "",
	});
	const [loading, setLoading] = useState(false);
	const onChange = (e) =>
		setForm({ ...form, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			const res = await apiUpdateUserProfile(form);
			if (res.success) {
				toast.success("Cập nhật thành công!");
				localStorage.setItem("token", res.token);
				localStorage.setItem("userInfo", JSON.stringify(res.result));
				dispatch(loginSuccess({ user: res.result, token: res.token }));
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Lỗi cập nhật");
		} finally {
			setLoading(false);
		}
	};

	const FIELDS = [
		{
			name: "name",
			label: "Họ và tên",
			Icon: User,
			type: "text",
			ro: false,
			ph: "Nguyễn Văn A",
		},
		{
			name: "email",
			label: "Email",
			Icon: Mail,
			type: "email",
			ro: true,
			ph: "",
		},
		{
			name: "phone",
			label: "Số điện thoại",
			Icon: Phone,
			type: "text",
			ro: false,
			ph: "0901 234 567",
		},
		{
			name: "address",
			label: "Địa chỉ",
			Icon: MapPin,
			type: "text",
			ro: false,
			ph: "123 Nguyễn Trãi...",
		},
	];

	return (
		<form onSubmit={handleSubmit}>
			<SecHead
				icon={User}
				title="Thông tin cá nhân"
			/>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{FIELDS.map(({ name, label, Icon, type, ro, ph }) => (
					<div
						key={name}
						className="group">
						<Label>{label}</Label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
								<Icon
									size={14}
									className="text-[#b0a090] group-focus-within:text-[#c2784d] transition-colors"
								/>
							</div>
							<input
								name={name}
								type={type}
								value={form[name]}
								onChange={onChange}
								readOnly={ro}
								placeholder={ph}
								className={ro ? INPUT_RO : INPUT}
							/>
						</div>
					</div>
				))}
			</div>
			<button
				type="submit"
				disabled={loading}
				className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#c2784d] hover:bg-[#a05e38] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60"
				style={{ boxShadow: "0 4px 14px rgba(194,120,77,.3)" }}>
				{loading ? (
					<>
						<Spinner
							size={14}
							color="white"
						/>{" "}
						Đang lưu...
					</>
				) : (
					"Lưu thay đổi"
				)}
			</button>
		</form>
	);
};

/* ─────────────────────────────────────────────────────────────────────────────
   CHANGE PASSWORD
───────────────────────────────────────────────────────────────────────────── */
const ChangePassword = () => {
	const [pw, setPw] = useState({ password: "", confirmPassword: "" });
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (pw.password !== pw.confirmPassword)
			return toast.error("Mật khẩu xác nhận không khớp");
		if (pw.password.length < 6)
			return toast.error("Mật khẩu phải từ 6 ký tự trở lên");
		setLoading(true);
		try {
			const res = await apiUpdateUserProfile({ password: pw.password });
			if (res.success) {
				toast.success("Đổi mật khẩu thành công");
				setPw({ password: "", confirmPassword: "" });
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<SecHead
				icon={Lock}
				title="Đổi mật khẩu"
			/>
			<div className="max-w-sm space-y-4 mb-6">
				{[
					{
						k: "password",
						lbl: "Mật khẩu mới",
						ph: "Tối thiểu 6 ký tự",
					},
					{
						k: "confirmPassword",
						lbl: "Xác nhận mật khẩu",
						ph: "Nhập lại mật khẩu mới",
					},
				].map(({ k, lbl, ph }) => (
					<div
						key={k}
						className="group">
						<Label>{lbl}</Label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
								<Lock
									size={14}
									className="text-[#b0a090] group-focus-within:text-[#c2784d] transition-colors"
								/>
							</div>
							<input
								type="password"
								value={pw[k]}
								placeholder={ph}
								onChange={(e) =>
									setPw({ ...pw, [k]: e.target.value })
								}
								className={INPUT}
							/>
						</div>
					</div>
				))}
			</div>
			<button
				type="submit"
				disabled={loading}
				className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a1914] hover:bg-[#c2784d] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60">
				{loading ? (
					<>
						<Spinner
							size={14}
							color="white"
						/>{" "}
						Đang xử lý...
					</>
				) : (
					"Cập nhật mật khẩu"
				)}
			</button>
		</form>
	);
};

/* ─────────────────────────────────────────────────────────────────────────────
   MY ORDERS (inside Profile)
───────────────────────────────────────────────────────────────────────────── */
const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			try {
				const r = await apiGetMyOrders();
				if (r.success) setOrders(r.result);
			} catch (e) {
				console.error(e);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const handleCancelOrder = async (orderId) => {
		const r = await Swal.fire({
			title: "Hủy đơn hàng?",
			text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Có, hủy đơn",
			cancelButtonText: "Đóng",
		});
		if (r.isConfirmed) {
			try {
				const res = await apiCancelMyOrder(orderId);
				if (res.success) {
					toast.success("Hủy đơn hàng thành công!");
					setOrders(
						orders.map((o) =>
							o._id === orderId
								? { ...o, status: "Cancelled" }
								: o,
						),
					);
				}
			} catch (error) {
				toast.error(
					error.response?.data?.message || "Lỗi khi hủy đơn hàng",
				);
			}
		}
	};

	if (loading)
		return (
			<div className="flex items-center justify-center py-16 gap-3">
				<Spinner />{" "}
				<span className="text-sm text-[#a08070]">Đang tải...</span>
			</div>
		);

	return (
		<div>
			<SecHead
				icon={Package}
				title="Lịch sử đơn hàng"
			/>
			{orders.length === 0 ? (
				<div className="flex flex-col items-center py-14 text-center">
					<div className="w-16 h-16 bg-[#fff3eb] rounded-full flex items-center justify-center mb-4">
						<Package
							size={26}
							className="text-[#c2784d]"
						/>
					</div>
					<p className="text-[#8a7060] text-sm mb-4">
						Bạn chưa có đơn hàng nào.
					</p>
					<Link
						to="/shop"
						className="text-sm font-bold text-[#c2784d] hover:text-[#a05e38] transition-colors">
						Bắt đầu mua sắm →
					</Link>
				</div>
			) : (
				<div className="space-y-2.5">
					{orders.map((order) => (
						<div
							key={order._id}
							className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between p-4 bg-[#fdf8f4] border border-[#f0e5d8] rounded-xl hover:border-[#d4a07a]/50 hover:shadow-sm transition-all">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-xl bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center shrink-0">
									<Package
										size={15}
										className="text-[#c2784d]"
									/>
								</div>
								<div>
									<p className="text-[11px] font-mono text-[#a08070]">
										#{order._id.slice(-6).toUpperCase()}
									</p>
									<p
										style={{
											fontFamily:
												"'Playfair Display',serif",
										}}
										className="text-sm font-medium text-[#1a1914]">
										{fmt(order.totalPrice)}
									</p>
									<p className="text-[11px] text-[#b0a090]">
										{new Date(
											order.createdAt,
										).toLocaleDateString("vi-VN")}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3 pl-13 sm:pl-0">
								<Badge status={order.status} />
								<Link
									to={`/order/${order._id}`}
									className="text-xs font-bold text-[#c2784d] hover:text-[#a05e38] transition-colors border-l border-[#e0d5c8] pl-3">
									Xem
								</Link>
								{order.status === "Pending" && (
									<button
										onClick={() =>
											handleCancelOrder(order._id)
										}
										className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors border-l border-[#e0d5c8] pl-3">
										Hủy đơn
									</button>
								)}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Profile;
