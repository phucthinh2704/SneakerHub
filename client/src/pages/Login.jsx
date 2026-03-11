import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";

// ── Inline SVG Spinner ────────────────────────────────────────────────────────
const Spinner = () => (
	<svg
		className="animate-spin"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5">
		<circle
			cx="12"
			cy="12"
			r="10"
			strokeOpacity="0.2"
		/>
		<path
			d="M12 2a10 10 0 0 1 10 10"
			stroke="white"
		/>
	</svg>
);

// ── Field Component ───────────────────────────────────────────────────────────
const Field = ({
	// eslint-disable-next-line no-unused-vars
	icon: Icon,
	label,
	name,
	type = "text",
	placeholder,
	value,
	onChange,
}) => (
	<div className="group">
		<label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#c2784d] mb-1.5">
			{label}
		</label>
		<div className="relative">
			<div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
				<Icon
					size={15}
					className="text-[#b0a090] group-focus-within:text-[#c2784d] transition-colors duration-200"
				/>
			</div>
			<input
				name={name}
				type={type}
				required
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				className="w-full bg-[#f5f0ea] border border-[#e0d5c8] rounded-xl pl-10 pr-4 py-3 text-sm text-[#1a1914]
					placeholder-[#c0b5a8] outline-none
					focus:border-[#c2784d] focus:bg-white focus:ring-2 focus:ring-[#c2784d]/10
					transition-all duration-200"
			/>
		</div>
	</div>
);

// ═════════════════════════════════════════════════════════════════════════════
const Login = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const [remember, setRemember] = useState(false);
	const [formData, setFormData] = useState({ email: "", password: "" });

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const response = await apiLogin(formData);

		setLoading(false);

		if (response?.success) {
			toast.success(response.message);
			dispatch(
				loginSuccess({ user: response.result, token: response.token }),
			);
			navigate("/");
		} else {
			toast.error(response?.message || "Đăng nhập thất bại");
		}
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.login-root  { font-family: 'DM Sans', sans-serif; }
				.login-title { font-family: 'Playfair Display', serif; }

				.login-card {
					animation: slideUp .45s cubic-bezier(.22,1,.36,1) both;
				}
				@keyframes slideUp {
					from { opacity: 0; transform: translateY(24px); }
					to   { opacity: 1; transform: translateY(0); }
				}

				.field-row > * { animation: fadeField .3s ease both; }
				.field-row > *:nth-child(1) { animation-delay: .1s  }
				.field-row > *:nth-child(2) { animation-delay: .18s }
				@keyframes fadeField {
					from { opacity: 0; transform: translateX(-8px); }
					to   { opacity: 1; transform: translateX(0); }
				}

				.submit-btn {
					background: linear-gradient(135deg, #c2784d 0%, #a05e38 100%);
					transition: all .25s ease;
					position: relative;
					overflow: hidden;
				}
				.submit-btn::before {
					content: '';
					position: absolute;
					inset: 0;
					background: linear-gradient(135deg, #d4895e 0%, #b06840 100%);
					opacity: 0;
					transition: opacity .25s ease;
				}
				.submit-btn:hover::before { opacity: 1; }
				.submit-btn:active { transform: scale(.98); }
				.submit-btn > * { position: relative; z-index: 1; }

				.img-panel img {
					transition: transform 8s ease;
				}
				.img-panel:hover img { transform: scale(1.04); }

				.custom-checkbox { display: none; }
				.custom-checkbox + .check-box {
					width: 16px; height: 16px;
					border: 2px solid #d0c4b8;
					border-radius: 4px;
					background: white;
					display: flex; align-items: center; justify-content: center;
					transition: all .2s ease;
					flex-shrink: 0;
					cursor: pointer;
				}
				.custom-checkbox:checked + .check-box {
					background: #c2784d;
					border-color: #c2784d;
				}
			`}</style>

			<div className="login-root min-h-screen bg-[#f5f0ea] flex">
				{/* ── Left Image Panel ──────────────────────────────────────── */}
				<div className="img-panel hidden lg:block w-130 shrink-0 relative overflow-hidden">
					<img
						src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80"
						alt="Shoe"
						className="absolute inset-0 w-full h-full object-cover"
					/>
					{/* Gradient overlay */}
					<div
						className="absolute inset-0"
						style={{
							background:
								"linear-gradient(160deg, rgba(26,25,20,0.55) 0%, rgba(194,120,77,0.35) 100%)",
						}}
					/>

					{/* Content overlay */}
					<div className="absolute inset-0 flex flex-col justify-between p-12">
						{/* Logo */}
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-full bg-[#c2784d] flex items-center justify-center">
								<svg
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="white"
									strokeWidth="1.8"
									strokeLinecap="round">
									<path d="M3 14c0 2 1 3 3 3h12c1.5 0 3-1 3-3v-1H3v1z" />
									<path d="M3 13L6 7l3 2 3-3 3 3 3-2 1 4.5" />
								</svg>
							</div>
							<Link to="/">
								<span className="login-title text-white/90 text-lg">
									SoleStore
								</span>
							</Link>
						</div>

						{/* Bottom quote */}
						<div>
							<div className="w-10 h-0.5 bg-[#c2784d] mb-5" />
							<h2 className="login-title text-3xl text-white leading-snug mb-3">
								Just Do It.
							</h2>
							<p className="text-white/70 text-sm leading-relaxed max-w-xs">
								Chào mừng trở lại với thế giới của những bước
								chạy đỉnh cao.
							</p>

							{/* Decorative perks */}
							<div className="mt-8 space-y-3">
								{[
									{
										icon: "👟",
										text: "Hơn 500+ mẫu giày mới nhất",
									},
									{
										icon: "🔒",
										text: "Thanh toán an toàn & bảo mật",
									},
									{
										icon: "📦",
										text: "Giao hàng toàn quốc trong 24h",
									},
								].map((item, i) => (
									<div
										key={i}
										className="flex items-center gap-3">
										<span className="text-base">
											{item.icon}
										</span>
										<span className="text-sm text-white/75">
											{item.text}
										</span>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* ── Right Form Panel ──────────────────────────────────────── */}
				<div className="flex-1 flex items-center justify-center px-4 py-12">
					<div className="login-card w-full max-w-lg">
						{/* Header */}
						<div className="mb-8">
							<p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#a0957e] mb-2">
								SoleStore — Đăng nhập
							</p>
							<h1 className="login-title text-[2rem] text-[#1a1914] leading-tight">
								Chào mừng trở lại
							</h1>
							<div className="w-8 h-0.5 bg-[#c2784d] mt-3" />
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit}
							className="space-y-4 field-row">
							<Field
								icon={Mail}
								label="Email"
								name="email"
								type="email"
								placeholder="example@email.com"
								value={formData.email}
								onChange={handleChange}
							/>
							<Field
								icon={Lock}
								label="Mật khẩu"
								name="password"
								type="password"
								placeholder="Nhập mật khẩu của bạn"
								value={formData.password}
								onChange={handleChange}
							/>

							{/* Remember & Forgot */}
							<div className="flex items-center justify-between pt-1">
								<label className="flex items-center gap-2.5 cursor-pointer select-none">
									<input
										type="checkbox"
										className="custom-checkbox"
										checked={remember}
										onChange={(e) =>
											setRemember(e.target.checked)
										}
									/>
									<div className="check-box">
										{remember && (
											<svg
												width="9"
												height="9"
												viewBox="0 0 24 24"
												fill="none"
												stroke="white"
												strokeWidth="3.5"
												strokeLinecap="round"
												strokeLinejoin="round">
												<polyline points="20 6 9 17 4 12" />
											</svg>
										)}
									</div>
									<span className="text-xs text-[#7a6a5a]">
										Ghi nhớ đăng nhập
									</span>
								</label>
								<a
									href="#"
									className="text-xs font-semibold text-[#c2784d] hover:text-[#a05e38] transition-colors underline underline-offset-2">
									Quên mật khẩu?
								</a>
							</div>

							{/* Submit */}
							<div className="pt-2">
								<button
									type="submit"
									disabled={loading}
									className="submit-btn w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl text-white text-sm font-bold tracking-widest uppercase disabled:opacity-60 disabled:cursor-not-allowed">
									{loading ? (
										<>
											<Spinner />
											<span>Đang xử lý...</span>
										</>
									) : (
										<span>Đăng nhập</span>
									)}
								</button>
							</div>
						</form>

						{/* Divider */}
						<div className="flex items-center gap-3 my-6">
							<div className="flex-1 h-px bg-[#e8ddd4]" />
							<span className="text-[10px] tracking-widest uppercase text-[#b0a090]">
								hoặc
							</span>
							<div className="flex-1 h-px bg-[#e8ddd4]" />
						</div>

						{/* Register CTA */}
						<div className="bg-[#fffaf7] border border-[#f0e5d8] rounded-xl p-4 text-center">
							<p className="text-xs text-[#8a7060] mb-2">
								Chưa có tài khoản?
							</p>
							<Link
								to="/register"
								className="inline-flex items-center gap-1.5 text-sm font-bold text-[#c2784d] hover:text-[#a05e38] transition-colors">
								Tạo tài khoản miễn phí
								<svg
									width="14"
									height="14"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2.5"
									strokeLinecap="round"
									strokeLinejoin="round">
									<line
										x1="5"
										y1="12"
										x2="19"
										y2="12"
									/>
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</Link>
						</div>

						<p className="mt-5 text-center text-[10px] text-[#b0a090] leading-relaxed">
							Bằng cách đăng nhập, bạn đồng ý với{" "}
							<span className="underline cursor-pointer hover:text-[#c2784d] transition-colors">
								Điều khoản dịch vụ
							</span>{" "}
							và{" "}
							<span className="underline cursor-pointer hover:text-[#c2784d] transition-colors">
								Chính sách bảo mật
							</span>{" "}
							của SoleStore.
						</p>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
