import { Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "../api/auth"; // Import hàm API đã tách
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

const Login = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const dispatch = useDispatch();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		// Vì axios instance của bạn đã xử lý return data,
		// và interceptor lỗi cũng return data (không reject),
		// nên ta không cần try/catch bao quanh call API.
		const response = await apiLogin(formData);

		setLoading(false);

		if (response?.success) {
			toast.success(response.message);

			dispatch(
				loginSuccess({
					user: response.result,
					token: response.token,
				}),
			);

			navigate("/");
		} else {
			toast.error(response?.message || "Đăng nhập thất bại");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans">
			<div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row m-4">
				{/* Phần Hình Ảnh (Trái) */}
				<div className="hidden md:block w-1/2 bg-gray-900 relative">
					<img
						src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
						alt="Nike Shoe"
						className="absolute inset-0 w-full h-full object-cover opacity-80"
					/>
					<div className="absolute inset-0 flex flex-col justify-center items-center text-white p-8 bg-black bg-opacity-40">
						<h2 className="text-4xl font-bold mb-4">Just Do It.</h2>
						<p className="text-lg text-center">
							Chào mừng trở lại với thế giới của những bước chạy.
						</p>
					</div>
				</div>

				{/* Phần Form (Phải) */}
				<div className="w-full md:w-1/2 p-8 md:p-12">
					<div className="text-center mb-10">
						<h2 className="text-3xl font-extrabold text-gray-900">
							Đăng Nhập
						</h2>
						<p className="text-gray-500 mt-2">
							Truy cập vào tài khoản mua sắm của bạn
						</p>
					</div>

					<form
						onSubmit={handleSubmit}
						className="space-y-6">
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Mail className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="email"
								name="email"
								required
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
								placeholder="Địa chỉ Email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>

						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Lock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="password"
								name="password"
								required
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
								placeholder="Mật khẩu"
								value={formData.password}
								onChange={handleChange}
							/>
						</div>

						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center cursor-pointer">
								<input
									type="checkbox"
									className="form-checkbox h-4 w-4 text-orange-600 rounded"
								/>
								<span className="ml-2 text-gray-600">
									Ghi nhớ đăng nhập
								</span>
							</label>
							<a
								href="#"
								className="text-orange-600 hover:text-orange-700 font-medium">
								Quên mật khẩu?
							</a>
						</div>

						<button
							type="submit"
							disabled={loading}
							className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50">
							{loading ? (
								<Loader2 className="animate-spin h-5 w-5" />
							) : (
								"ĐĂNG NHẬP NGAY"
							)}
						</button>
					</form>

					<p className="mt-8 text-center text-sm text-gray-600">
						Chưa có tài khoản?{" "}
						<Link
							to="/register"
							className="font-bold text-orange-600 hover:text-orange-700">
							Đăng ký miễn phí
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
