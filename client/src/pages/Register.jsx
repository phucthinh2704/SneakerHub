import { Lock, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiRegister } from "../api/auth";

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
	required = true,
}) => (
	<div className="group">
		<label className="block text-[10px] font-bold tracking-[0.18em] uppercase text-[#a0957e] mb-1.5">
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
				required={required}
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

		// eslint-disable-next-line no-unused-vars
		const { confirmPassword, ...dataToSend } = formData;

		const response = await apiRegister(dataToSend);

		setLoading(false);

		if (response?.success) {
			toast.success(response.message);
			localStorage.setItem("userInfo", JSON.stringify(response.result));
			localStorage.setItem("token", response.token);
			navigate("/");
		} else {
			toast.error(response?.message || "Đăng ký thất bại");
		}
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.reg-root { font-family: 'DM Sans', sans-serif; }
				.reg-title { font-family: 'Playfair Display', serif; }
				.reg-card {
					animation: slideUp .45s cubic-bezier(.22,1,.36,1) both;
				}
				@keyframes slideUp {
					from { opacity: 0; transform: translateY(24px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				.field-row > * { animation: fadeField .3s ease both; }
				.field-row > *:nth-child(1) { animation-delay: .1s }
				.field-row > *:nth-child(2) { animation-delay: .15s }
				.field-row > *:nth-child(3) { animation-delay: .2s }
				.field-row > *:nth-child(4) { animation-delay: .25s }
				.field-row > *:nth-child(5) { animation-delay: .3s }
				.field-row > *:nth-child(6) { animation-delay: .35s }
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
			`}</style>

			<div className="reg-root min-h-screen bg-[#f5f0ea] flex">
				{/* ── Left Decorative Panel (desktop only) ── */}
				<div className="hidden lg:flex w-130 shrink-0 bg-[#1a1914] flex-col justify-between p-12 relative overflow-hidden">
					{/* Background texture */}
					<div
						className="absolute inset-0 opacity-[0.07]"
						style={{
							backgroundImage: `radial-gradient(circle at 30% 20%, #c2784d 0%, transparent 50%),
								radial-gradient(circle at 80% 80%, #8b6b42 0%, transparent 50%)`,
						}}
					/>
					<div
						className="absolute inset-0"
						style={{
							backgroundImage: `repeating-linear-gradient(
								45deg,
								transparent, transparent 60px,
								rgba(255,255,255,.015) 60px, rgba(255,255,255,.015) 61px
							)`,
						}}
					/>

					{/* Logo / Brand */}
					<div className="relative">
						<div className="flex items-center gap-3 mb-12">
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
								<span className="reg-title text-[#f0e8de] text-lg">
									SoleStore
								</span>
							</Link>
						</div>

						<div className="w-10 h-px bg-[#c2784d] mb-8" />
						<h2 className="reg-title text-3xl text-[#f0e8de] leading-snug mb-4">
							Bước vào
							<br />
							thế giới
							<br />
							giày cao cấp
						</h2>
						<p className="text-[#a0957e] text-sm leading-relaxed">
							Đăng ký để trải nghiệm bộ sưu tập giày độc quyền, ưu
							đãi thành viên và giao hàng nhanh toàn quốc.
						</p>
					</div>

					{/* Bottom perks */}
					<div className="relative space-y-4">
						{[
							{
								icon: "🎁",
								text: "Ưu đãi 10% cho đơn hàng đầu tiên",
							},
							{
								icon: "🚚",
								text: "Miễn phí vận chuyển toàn quốc",
							},
							{
								icon: "✨",
								text: "Truy cập bộ sưu tập giới hạn sớm nhất",
							},
						].map((item, i) => (
							<div
								key={i}
								className="flex items-center gap-3">
								<span className="text-lg">{item.icon}</span>
								<span className="text-sm text-[#c9c1b2]">
									{item.text}
								</span>
							</div>
						))}
					</div>
				</div>

				{/* ── Right Form Panel ── */}
				<div className="flex-1 flex items-center justify-center px-4 py-12">
					<div className="reg-card w-full max-w-lg">
						{/* Header */}
						<div className="mb-8">
							<p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#a0957e] mb-2">
								SoleStore — Tạo tài khoản
							</p>
							<h1 className="reg-title text-[2rem] text-[#1a1914] leading-tight">
								Đăng ký
							</h1>
							<div className="w-8 h-0.5 bg-[#c2784d] mt-3" />
						</div>

						{/* Form */}
						<form
							onSubmit={handleSubmit}
							className="space-y-4 field-row">
							<Field
								icon={User}
								label="Họ và tên"
								name="name"
								placeholder="Nguyễn Văn A"
								value={formData.name}
								onChange={handleChange}
							/>
							<Field
								icon={Mail}
								label="Email"
								name="email"
								type="email"
								placeholder="example@email.com"
								value={formData.email}
								onChange={handleChange}
							/>

							{/* Phone + Address side by side on wider screens */}
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<Field
									icon={Phone}
									label="Số điện thoại"
									name="phone"
									placeholder="0901 234 567"
									value={formData.phone}
									onChange={handleChange}
								/>
								<Field
									icon={MapPin}
									label="Địa chỉ"
									name="address"
									placeholder="123 Đường ABC, Quận XYZ"
									value={formData.address}
									onChange={handleChange}
								/>
							</div>

							<Field
								icon={Lock}
								label="Mật khẩu"
								name="password"
								type="password"
								placeholder="Tối thiểu 6 ký tự"
								value={formData.password}
								onChange={handleChange}
							/>
							<Field
								icon={Lock}
								label="Xác nhận mật khẩu"
								name="confirmPassword"
								type="password"
								placeholder="Nhập lại mật khẩu"
								value={formData.confirmPassword}
								onChange={handleChange}
							/>

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
										<span>Tạo tài khoản</span>
									)}
								</button>
							</div>
						</form>

						{/* Footer */}
						<p className="mt-6 text-center text-sm text-[#8a8070]">
							Đã có tài khoản?{" "}
							<Link
								to="/login"
								className="font-semibold text-[#c2784d] hover:text-[#a05e38] transition-colors underline underline-offset-2">
								Đăng nhập
							</Link>
						</p>

						<p className="mt-4 text-center text-[10px] text-[#b0a090] leading-relaxed">
							Bằng cách đăng ký, bạn đồng ý với{" "}
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

export default Register;
