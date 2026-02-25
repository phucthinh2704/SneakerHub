import {
	Camera,
	Loader2,
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

const Profile = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState("info"); // 'info' | 'orders' | 'password'
	const [loading, setLoading] = useState(true);
	const [userData, setUserData] = useState(null);

	const [uploadingAvatar, setUploadingAvatar] = useState(false);

	// --- 1. LẤY DỮ LIỆU USER KHI VÀO TRANG ---
	useEffect(() => {
		fetchProfile();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchProfile = async () => {
		try {
			const res = await apiGetUserProfile();
			if (res.success) {
				setUserData(res.result);
			}
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

		if (!file.type.startsWith("image/")) {
			return toast.error("Vui lòng chọn file hình ảnh!");
		}

		setUploadingAvatar(true);
		const toastId = toast.loading("Đang tải ảnh lên...");

		try {
			// 1. Upload lên Cloudinary
			const uploadData = new FormData();
			uploadData.append("image", file); // Key 'image' khớp với upload.route.js
			const uploadRes = await apiUploadImage(uploadData);

			if (uploadRes.success) {
				// 2. Cập nhật URL vào Profile
				const updateRes = await apiUpdateUserProfile({
					avatar: uploadRes.url,
				});

				if (updateRes.success) {
					toast.success("Cập nhật Avatar thành công!", {
						id: toastId,
					});
					setUserData(updateRes.result); // Cập nhật state hiển thị

					// Cập nhật Redux & LocalStorage
					localStorage.setItem("token", updateRes.token);
					localStorage.setItem(
						"userInfo",
						JSON.stringify(updateRes.result),
					);
					dispatch(
						loginSuccess({
							user: updateRes.result,
							token: updateRes.token,
						}),
					);
				}
			}
		} catch (error) {
			console.error(error);
			toast.error("Lỗi khi tải ảnh lên!", { id: toastId });
		} finally {
			setUploadingAvatar(false);
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen flex justify-center items-center bg-gray-50">
				<Loader2 className="animate-spin text-orange-600 w-10 h-10" />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen py-10">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Profile */}
				<div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex items-center space-x-6">
					<div className="relative group">
						{/* Khu vực hiển thị Avatar */}
						<div className="w-24 h-24 rounded-full bg-orange-100 border-2 border-white shadow-md flex items-center justify-center text-orange-600 font-bold text-3xl overflow-hidden">
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

						{/* Input File Ẩn & Nút Camera */}
						<input
							type="file"
							id="avatar-upload"
							accept="image/*"
							className="hidden"
							onChange={handleAvatarUpload}
							disabled={uploadingAvatar}
						/>
						<label
							htmlFor="avatar-upload"
							className="absolute bottom-0 right-0 bg-gray-900 text-white p-2 rounded-full cursor-pointer hover:bg-orange-600 transition shadow-lg z-10">
							{uploadingAvatar ? (
								<Loader2
									size={16}
									className="animate-spin"
								/>
							) : (
								<Camera size={16} />
							)}
						</label>
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">
							{userData?.name}
						</h1>
						<p className="text-gray-500">{userData?.email}</p>
						<div className="flex items-center mt-2 space-x-4">
							<span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
								{userData?.role}
							</span>
						</div>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-8">
					{/* --- SIDEBAR MENU --- */}
					<aside className="w-full md:w-1/4">
						<div className="bg-white rounded-xl shadow-sm overflow-hidden">
							<button
								onClick={() => setActiveTab("info")}
								className={`w-full flex items-center space-x-3 px-6 py-4 transition ${
									activeTab === "info"
										? "bg-orange-50 text-orange-600 border-l-4 border-orange-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}>
								<User size={20} />
								<span className="font-medium">
									Thông tin tài khoản
								</span>
							</button>

							<button
								onClick={() => setActiveTab("orders")}
								className={`w-full flex items-center space-x-3 px-6 py-4 transition ${
									activeTab === "orders"
										? "bg-orange-50 text-orange-600 border-l-4 border-orange-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}>
								<Package size={20} />
								<span className="font-medium">
									Lịch sử đơn hàng
								</span>
							</button>

							<button
								onClick={() => setActiveTab("password")}
								className={`w-full flex items-center space-x-3 px-6 py-4 transition ${
									activeTab === "password"
										? "bg-orange-50 text-orange-600 border-l-4 border-orange-600"
										: "text-gray-600 hover:bg-gray-50"
								}`}>
								<Lock size={20} />
								<span className="font-medium">
									Đổi mật khẩu
								</span>
							</button>

							<div className="border-t">
								<button
									onClick={handleLogout}
									className="w-full flex items-center space-x-3 px-6 py-4 text-red-600 hover:bg-red-50 transition">
									<LogOut size={20} />
									<span className="font-medium">
										Đăng xuất
									</span>
								</button>
							</div>
						</div>
					</aside>

					{/* --- MAIN CONTENT AREA --- */}
					<main className="w-full md:w-3/4">
						<div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
							{activeTab === "info" && (
								<ProfileInfo
									user={userData}
									dispatch={dispatch}
								/>
							)}
							{activeTab === "orders" && <MyOrders />}
							{activeTab === "password" && <ChangePassword />}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

// --- SUB-COMPONENT 1: CẬP NHẬT THÔNG TIN ---
const ProfileInfo = ({ user, dispatch }) => {
	const [formData, setFormData] = useState({
		name: user?.name || "",
		email: user?.email || "",
		phone: user?.phone || "",
		address: user?.address || "",
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			// Backend updateUserProfile trả về { success, result, token }
			const res = await apiUpdateUserProfile(formData);

			if (res.success) {
				toast.success("Cập nhật thành công!");

				// Cập nhật lại Redux và LocalStorage với Token mới + Info mới
				localStorage.setItem("token", res.token);
				localStorage.setItem("userInfo", JSON.stringify(res.result));

				dispatch(
					loginSuccess({
						user: res.result,
						token: res.token,
					}),
				);
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Lỗi cập nhật");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
				Thông tin cá nhân
			</h2>
			<form
				onSubmit={handleSubmit}
				className="space-y-5">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Họ và tên
						</label>
						<div className="relative">
							<User
								size={18}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<input
								name="name"
								value={formData.name}
								onChange={handleChange}
								className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<div className="relative">
							<Mail
								size={18}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<input
								name="email"
								value={formData.email}
								onChange={handleChange}
								className="w-full pl-10 p-2.5 border rounded-lg bg-gray-100 cursor-not-allowed text-gray-500"
								readOnly
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Số điện thoại
						</label>
						<div className="relative">
							<Phone
								size={18}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<input
								name="phone"
								value={formData.phone}
								onChange={handleChange}
								className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							/>
						</div>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Địa chỉ
						</label>
						<div className="relative">
							<MapPin
								size={18}
								className="absolute left-3 top-3 text-gray-400"
							/>
							<input
								name="address"
								value={formData.address}
								onChange={handleChange}
								className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							/>
						</div>
					</div>
				</div>
				<div className="pt-4">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2.5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition disabled:opacity-50">
						{loading ? "Đang lưu..." : "Lưu thay đổi"}
					</button>
				</div>
			</form>
		</div>
	);
};

// --- SUB-COMPONENT 2: ĐỔI MẬT KHẨU ---
const ChangePassword = () => {
	const [passData, setPassData] = useState({
		password: "",
		confirmPassword: "",
	});
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (passData.password !== passData.confirmPassword) {
			return toast.error("Mật khẩu xác nhận không khớp");
		}
		if (passData.password.length < 6) {
			return toast.error("Mật khẩu phải từ 6 ký tự trở lên");
		}

		setLoading(true);
		try {
			// Backend updateUserProfile xử lý cập nhật password nếu có gửi lên
			const res = await apiUpdateUserProfile({
				password: passData.password,
			});
			if (res.success) {
				toast.success("Đổi mật khẩu thành công");
				setPassData({ password: "", confirmPassword: "" });
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Lỗi đổi mật khẩu");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
				Đổi mật khẩu
			</h2>
			<form
				onSubmit={handleSubmit}
				className="max-w-md space-y-5">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Mật khẩu mới
					</label>
					<div className="relative">
						<Lock
							size={18}
							className="absolute left-3 top-3 text-gray-400"
						/>
						<input
							type="password"
							value={passData.password}
							onChange={(e) =>
								setPassData({
									...passData,
									password: e.target.value,
								})
							}
							className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							placeholder="Nhập mật khẩu mới"
						/>
					</div>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Xác nhận mật khẩu
					</label>
					<div className="relative">
						<Lock
							size={18}
							className="absolute left-3 top-3 text-gray-400"
						/>
						<input
							type="password"
							value={passData.confirmPassword}
							onChange={(e) =>
								setPassData({
									...passData,
									confirmPassword: e.target.value,
								})
							}
							className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							placeholder="Nhập lại mật khẩu mới"
						/>
					</div>
				</div>
				<div className="pt-2">
					<button
						type="submit"
						disabled={loading}
						className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition disabled:opacity-50">
						{loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
					</button>
				</div>
			</form>
		</div>
	);
};

// --- SUB-COMPONENT 3: LỊCH SỬ ĐƠN HÀNG ---
const MyOrders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOrders = async () => {
			try {
				const res = await apiGetMyOrders();
				if (res.success) setOrders(res.result);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};
		fetchOrders();
	}, []);

	// --- HÀM XỬ LÝ HỦY ĐƠN HÀNG ---
	const handleCancelOrder = async (orderId) => {
		const result = await Swal.fire({
			title: "Hủy đơn hàng?",
			text: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444", // Đỏ cho hành động hủy
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Có, hủy đơn",
			cancelButtonText: "Đóng",
		});

		if (result.isConfirmed) {
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
			<div className="py-10 text-center">
				<Loader2 className="animate-spin inline-block mr-2 text-orange-600" />{" "}
				Đang tải đơn hàng...
			</div>
		);

	if (orders.length === 0) {
		return (
			<div className="text-center py-10">
				<Package
					size={48}
					className="mx-auto text-gray-300 mb-4"
				/>
				<p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
			</div>
		);
	}

	return (
		<div>
			<h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4">
				Lịch sử đơn hàng
			</h2>
			<div className="overflow-x-auto">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="text-sm text-gray-500 border-b">
							<th className="py-3 font-medium">Mã đơn</th>
							<th className="py-3 font-medium">Ngày đặt</th>
							<th className="py-3 font-medium">Tổng tiền</th>
							<th className="py-3 font-medium">Trạng thái</th>
							<th className="py-3 font-medium text-right">
								Hành động
							</th>
						</tr>
					</thead>
					<tbody className="text-sm">
						{orders.map((order) => (
							<tr
								key={order._id}
								className="border-b last:border-0 hover:bg-gray-50 transition">
								<td className="py-4 font-mono text-gray-600">
									#{order._id.slice(-6).toUpperCase()}
								</td>
								<td className="py-4">
									{new Date(
										order.createdAt,
									).toLocaleDateString("vi-VN")}
								</td>
								<td className="py-4 font-bold text-gray-900">
									{new Intl.NumberFormat("vi-VN", {
										style: "currency",
										currency: "VND",
									}).format(order.totalPrice)}
								</td>
								<td className="py-4">
									<span
										className={`px-2.5 py-1 rounded-full text-xs font-bold
                    ${
						order.status === "Delivered"
							? "bg-green-100 text-green-700"
							: order.status === "Cancelled"
								? "bg-red-100 text-red-700"
								: order.status === "Shipping"
									? "bg-blue-100 text-blue-700"
									: "bg-yellow-100 text-yellow-700"
					}`}>
										{order.status}
									</span>
								</td>

								{/* --- CỘT HÀNH ĐỘNG ĐÃ CẬP NHẬT --- */}
								<td className="py-4 text-right whitespace-nowrap">
									<Link
										to={`/order/${order._id}`}
										className="text-orange-600 hover:text-orange-800 font-medium">
										Xem
									</Link>

									{/* Chỉ hiện nút Hủy khi đơn đang Pending */}
									{order.status === "Pending" && (
										<button
											onClick={() =>
												handleCancelOrder(order._id)
											}
											className="text-red-500 hover:text-red-700 font-medium ml-3 pl-3 border-l border-gray-300">
											Hủy đơn
										</button>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Profile;
