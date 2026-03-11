import {
	Edit,
	Image as ImageIcon,
	Loader2,
	Plus,
	Save,
	Trash2,
	UploadCloud,
	X,
	Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	apiCreateBrand,
	apiDeleteBrand,
	apiGetAllBrandsAdmin,
	apiUpdateBrand,
	apiUploadImage,
} from "../../api/admin";

const INP =
	"w-full bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2418] placeholder-[#c0a890] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15 transition";
const LBL =
	"block text-[10px] font-bold tracking-[.15em] uppercase text-[#8a7060] mb-1.5";

const AdminBrands = () => {
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editId, setEditId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		logo: "",
	});
	const [formLoading, setFormLoading] = useState(false);
	const [logoFile, setLogoFile] = useState(null);
	const [logoPreview, setLogoPreview] = useState("");

	useEffect(() => {
		fetchBrands();
	}, []);

	const fetchBrands = async () => {
		setLoading(true);
		try {
			const res = await apiGetAllBrandsAdmin();
			if (res.success) setBrands(res.result);
		} catch (error) {
			console.log(error);
			toast.error("Lỗi lấy danh sách thương hiệu");
		} finally {
			setLoading(false);
		}
	};

	const handleLogoSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (!file.type.startsWith("image/"))
			return toast.error("Vui lòng chọn file hình ảnh!");
		setLogoFile(file);
		setLogoPreview(URL.createObjectURL(file));
	};

	const triggerEdit = (brand) => {
		setEditId(brand._id);
		setFormData({
			name: brand.name,
			description: brand.description || "",
			logo: brand.logo || "",
		});
		setLogoPreview(brand.logo || "");
		setLogoFile(null);
	};

	const cancelEdit = () => {
		setEditId(null);
		setFormData({ name: "", description: "", logo: "" });
		setLogoPreview("");
		setLogoFile(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim())
			return toast.error("Tên thương hiệu là bắt buộc");
		if (!logoFile && !formData.logo)
			return toast.error("Vui lòng chọn logo thương hiệu");
		setFormLoading(true);
		try {
			let finalLogoUrl = formData.logo;
			if (logoFile) {
				const uploadData = new FormData();
				uploadData.append("image", logoFile);
				const uploadRes = await apiUploadImage(uploadData);
				if (uploadRes.success) finalLogoUrl = uploadRes.url;
			}
			const payload = { ...formData, logo: finalLogoUrl };
			if (editId) {
				const res = await apiUpdateBrand(editId, payload);
				if (res.success) {
					toast.success("Cập nhật thành công");
					setBrands(
						brands.map((b) => (b._id === editId ? res.result : b)),
					);
					cancelEdit();
				}
			} else {
				const res = await apiCreateBrand(payload);
				if (res.success) {
					toast.success("Thêm mới thành công");
					setBrands([res.result, ...brands]);
					cancelEdit();
				} else {
					Swal.fire({
						title: "Lỗi",
						text: res.message || "Thêm mới thất bại",
						icon: "error",
						confirmButtonText: "Đóng",
						customClass: {
							popup: "rounded-2xl",
							confirmButton: "rounded-xl font-bold",
						},
					});
				}
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Thao tác thất bại");
		} finally {
			setFormLoading(false);
		}
	};

	const handleDelete = async (id, name) => {
		const result = await Swal.fire({
			title: `<span style="font-family:'Syne',sans-serif;font-size:1.05rem">Xóa thương hiệu?</span>`,
			html: `<span style="font-family:'DM Sans',sans-serif;font-size:.88rem;color:#6a5a4a">Thương hiệu <b>${name}</b> sẽ bị xóa vĩnh viễn.</span>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
			customClass: {
				popup: "rounded-2xl",
				confirmButton: "rounded-xl font-bold",
				cancelButton: "rounded-xl font-bold",
			},
		});
		if (!result.isConfirmed) return;
		try {
			const res = await apiDeleteBrand(id);
			if (res.success) {
				toast.success("Đã xóa thương hiệu");
				setBrands(brands.filter((b) => b._id !== id));
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Xóa thất bại");
		}
	};

	return (
		<>
			<style>{`
			@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.ab-root    { font-family:'DM Sans',sans-serif; }
				.ab-heading { font-family:'Syne',sans-serif; }
				.ab-row     { transition: background .15s; }
				.ab-row:hover td { background: #fdf9f6; }
				.ab-fade    { animation: abFadeUp .35s ease both; }
				@keyframes abFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
			`}</style>

			<div className="ab-root ab-fade">
				{/* Header */}
				<div className="mb-5">
					<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-0.5">
						SoleStore Admin
					</p>
					<h2 className="ab-heading text-[#1a1914] text-2xl font-bold">
						Quản lý Thương hiệu
					</h2>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
					{/* ── FORM ── */}
					<div className="lg:col-span-1">
						<div
							className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden sticky top-5"
							style={{
								boxShadow: "0 2px 20px rgba(194,120,77,.07)",
							}}>
							<div
								className="px-5 py-4 border-b border-[#f5ede4] flex items-center gap-2.5"
								style={{
									background:
										"linear-gradient(135deg,#fdf8f4,#fffaf7)",
								}}>
								<div className="w-7 h-7 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
									{editId ? (
										<Edit
											size={13}
											className="text-[#c2784d]"
										/>
									) : (
										<Plus
											size={13}
											className="text-[#c2784d]"
										/>
									)}
								</div>
								<h3 className="ab-heading text-[#1a1914] font-bold text-sm">
									{editId
										? "Chỉnh sửa thương hiệu"
										: "Thêm thương hiệu mới"}
								</h3>
							</div>

							<form
								onSubmit={handleSubmit}
								className="p-5 space-y-4">
								<div>
									<label className={LBL}>
										Tên thương hiệu *
									</label>
									<input
										required
										type="text"
										value={formData.name}
										onChange={(e) =>
											setFormData({
												...formData,
												name: e.target.value,
											})
										}
										className={INP}
										placeholder="VD: Nike, Adidas, Puma..."
									/>
								</div>
								<div>
									<label className={LBL}>Mô tả</label>
									<textarea
										rows={3}
										value={formData.description}
										onChange={(e) =>
											setFormData({
												...formData,
												description: e.target.value,
											})
										}
										className={`${INP} resize-none`}
										placeholder="Mô tả ngắn về thương hiệu..."
									/>
								</div>

								{/* Logo upload */}
								<div>
									<label className={LBL}>
										Logo thương hiệu *
									</label>
									<div className="flex items-center gap-4">
										<div className="w-32 h-32 rounded-xl border-2 border-dashed border-[#e8d8cc] bg-[#fdf8f4] flex items-center justify-center p-2 overflow-hidden shrink-0">
											{logoPreview ? (
												<img
													src={logoPreview}
													alt="preview"
													className="w-full h-full object-cotain"
												/>
											) : (
												<ImageIcon
													size={20}
													className="text-[#d0c0b0]"
												/>
											)}
										</div>
										<div>
											<input
												type="file"
												id="brand-logo"
												accept="image/*"
												onChange={handleLogoSelect}
												className="hidden"
											/>
											<label
												htmlFor="brand-logo"
												className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-[#fff3eb] text-[#c2784d] border border-[#f0ddd0] rounded-xl cursor-pointer hover:bg-[#ffe0c8] transition">
												<UploadCloud size={13} /> Chọn
												logo
											</label>
											{logoPreview && (
												<button
													type="button"
													onClick={() => {
														setLogoPreview("");
														setLogoFile(null);
														setFormData({
															...formData,
															logo: "",
														});
													}}
													className="ml-2 text-[11px] text-red-400 hover:text-red-600 font-semibold">
													Xóa
												</button>
											)}
										</div>
									</div>
								</div>

								<div className="flex gap-2 pt-1">
									<button
										type="submit"
										disabled={formLoading}
										className="flex-1 inline-flex items-center justify-center gap-2 bg-[#c2784d] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#a05e38] disabled:opacity-60 transition"
										style={{
											boxShadow:
												"0 3px 10px rgba(194,120,77,.3)",
										}}>
										{formLoading ? (
											<>
												<Loader2
													size={15}
													className="animate-spin"
												/>{" "}
												Đang lưu...
											</>
										) : editId ? (
											<>
												<Save size={15} /> Lưu thay đổi
											</>
										) : (
											<>
												<Plus size={15} /> Thêm mới
											</>
										)}
									</button>
									{editId && (
										<button
											type="button"
											onClick={cancelEdit}
											className="w-10 flex items-center justify-center bg-[#f5ede4] text-[#8a7060] rounded-xl hover:bg-[#ffe0c8] hover:text-[#c2784d] transition">
											<X size={16} />
										</button>
									)}
								</div>
							</form>
						</div>
					</div>

					{/* ── LIST ── */}
					<div
						className="lg:col-span-2 bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
						style={{
							boxShadow: "0 2px 20px rgba(194,120,77,.07)",
						}}>
						<div className="px-5 py-4 border-b border-[#f5ede4] flex items-center justify-between">
							<h3 className="ab-heading text-[#1a1914] font-bold text-base">
								Danh sách
							</h3>
							<span className="text-xs font-bold text-[#a08070] bg-[#f5ede4] px-2.5 py-1 rounded-full">
								{brands.length} thương hiệu
							</span>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-[#fdf8f4] border-b border-[#f5ede4]">
										{[
											"Logo",
											"Tên hãng",
											"Slug",
											"Thao tác",
										].map((h, i) => (
											<th
												key={h}
												className={`px-5 py-3.5 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] ${i === 3 ? "text-center" : "text-left"}`}>
												{h}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{loading ? (
										<tr>
											<td
												colSpan="4"
												className="text-center py-14">
												<Loader2
													className="animate-spin inline text-[#c2784d]"
													size={26}
												/>
											</td>
										</tr>
									) : (
										brands.map((brand) => (
											<tr
												key={brand._id}
												className="ab-row border-b border-[#f8f0e8] last:border-0">
												<td className="px-5 py-3.5">
													<div className="w-24 h-24 rounded-xl border border-[#f0ddd0] bg-white flex items-center justify-center p-2">
														<img
															src={
																brand.logo ||
																"https://placehold.co/200x200?text=—"
															}
															alt={brand.name}
															className="max-w-full max-h-full object-contain"
														/>
													</div>
												</td>
												<td className="px-5 py-3.5">
													<p className="font-semibold text-[#1a1914]">
														{brand.name}
													</p>
													{brand.description && (
														<p className="text-[11px] text-[#a08070] mt-0.5 truncate max-w-45">
															{brand.description}
														</p>
													)}
												</td>
												<td className="px-5 py-3.5">
													<code className="text-[11px] text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-md">
														{brand.slug}
													</code>
												</td>
												<td className="px-5 py-3.5 text-center">
													<div className="flex items-center justify-center gap-1.5">
														<button
															onClick={() =>
																triggerEdit(
																	brand,
																)
															}
															className="p-2 rounded-lg bg-[#eff4ff] text-[#5b8dee] hover:bg-[#dde8ff] transition">
															<Edit size={14} />
														</button>
														<button
															onClick={() =>
																handleDelete(
																	brand._id,
																	brand.name,
																)
															}
															className="p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition">
															<Trash2 size={14} />
														</button>
													</div>
												</td>
											</tr>
										))
									)}
								</tbody>
							</table>
							{brands.length === 0 && !loading && (
								<div className="text-center py-12">
									<Tag
										size={26}
										className="text-[#e0d0c0] mx-auto mb-2"
									/>
									<p className="text-[#b0a090] text-sm">
										Chưa có thương hiệu nào.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminBrands;
