import { Loader2, Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiRegister } from "../api/auth"; // Import hàm API

const Register = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: "",
		password: "",
		confirmPassword: "",
	});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (formData.password !== formData.confirmPassword) {
			return toast.error("Mật khẩu xác nhận không khớp!");
		}

		setLoading(true);

		// Chuẩn bị dữ liệu (bỏ confirmPassword)
		// eslint-disable-next-line no-unused-vars
		const { confirmPassword, ...dataToSend } = formData;

		// Gọi API
		const response = await apiRegister(dataToSend);

		setLoading(false);

		if (response?.success) {
			toast.success(response.message);

			// Auto login sau khi đăng ký thành công
			localStorage.setItem("userInfo", JSON.stringify(response.result));
			localStorage.setItem("token", response.token);

			navigate("/");
		} else {
			// Xử lý lỗi trả về từ API
			toast.error(response?.message || "Đăng ký thất bại");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
				<div className="text-center">
					<h2 className="text-3xl font-extrabold text-gray-900">
						Tạo tài khoản mới
					</h2>
					<p className="mt-2 text-sm text-gray-600">
						Tham gia cộng đồng giày thể thao lớn nhất Việt Nam
					</p>
				</div>

				<form
					className="mt-8 space-y-4"
					onSubmit={handleSubmit}>
					{/* Tên hiển thị */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<User className="h-5 w-5 text-gray-400" />
						</div>
						<input
							name="name"
							type="text"
							required
							className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
							placeholder="Họ và tên"
							value={formData.name}
							onChange={handleChange}
						/>
					</div>

					{/* Email */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Mail className="h-5 w-5 text-gray-400" />
						</div>
						<input
							name="email"
							type="email"
							required
							className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
							placeholder="Địa chỉ Email"
							value={formData.email}
							onChange={handleChange}
						/>
					</div>

					{/* Số điện thoại */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Phone className="h-5 w-5 text-gray-400" />
						</div>
						<input
							name="phone"
							type="text"
							required
							className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
							placeholder="Số điện thoại"
							value={formData.phone}
							onChange={handleChange}
						/>
					</div>

					{/* Địa chỉ */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<MapPin className="h-5 w-5 text-gray-400" />
						</div>
						<input
							name="address"
							type="text"
							required
							className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
							placeholder="Địa chỉ nhận hàng"
							value={formData.address}
							onChange={handleChange}
						/>
					</div>

					{/* Mật khẩu */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock className="h-5 w-5 text-gray-400" />
						</div>
						<input
							name="password"
							type="password"
							required
							className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
							placeholder="Mật khẩu"
							value={formData.password}
							onChange={handleChange}
						/>
					</div>

					{/* Xác nhận mật khẩu */}
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<Lock className="h-5 w-5 text-gray-400" />
						</div>
						<input
							name="confirmPassword"
							type="password"
							required
							className="appearance-none rounded-lg relative block w-full pl-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
							placeholder="Nhập lại mật khẩu"
							value={formData.confirmPassword}
							onChange={handleChange}
						/>
					</div>

					<div>
						<button
							type="submit"
							disabled={loading}
							className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors disabled:opacity-50">
							{loading ? (
								<Loader2 className="animate-spin h-5 w-5" />
							) : (
								"ĐĂNG KÝ TÀI KHOẢN"
							)}
						</button>
					</div>
				</form>

				<div className="text-center">
					<p className="text-sm text-gray-600">
						Đã có tài khoản?{" "}
						<Link
							to="/login"
							className="font-medium text-orange-600 hover:text-orange-500">
							Đăng nhập tại đây
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
