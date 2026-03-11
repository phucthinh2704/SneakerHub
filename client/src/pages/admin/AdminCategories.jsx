import {
	Edit,
	Image as ImageIcon,
	Loader2,
	Plus,
	Save,
	Trash2,
	UploadCloud,
	X,
	ListTree,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	apiCreateCategory,
	apiDeleteCategory,
	apiGetAllCategoriesAdmin,
	apiUpdateCategory,
	apiUploadImage,
} from "../../api/admin";

const INP =
	"w-full bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2418] placeholder-[#c0a890] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15 transition";
const LBL =
	"block text-[10px] font-bold tracking-[.15em] uppercase text-[#8a7060] mb-1.5";

const AdminCategories = () => {
	const [categories, setCategories] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editId, setEditId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		image: "",
	});
	const [formLoading, setFormLoading] = useState(false);
	const [imageFile, setImageFile] = useState(null);
	const [imagePreview, setImagePreview] = useState("");

	useEffect(() => {
		fetchCategories();
	}, []);

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const res = await apiGetAllCategoriesAdmin();
			if (res.success) setCategories(res.result);
		} catch (error) {
			console.log(error);
			toast.error("Lỗi lấy danh mục");
		} finally {
			setLoading(false);
		}
	};

	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;
		if (!file.type.startsWith("image/"))
			return toast.error("Vui lòng chọn file hình ảnh!");
		setImageFile(file);
		setImagePreview(URL.createObjectURL(file));
	};

	const triggerEdit = (cat) => {
		setEditId(cat._id);
		setFormData({
			name: cat.name,
			description: cat.description || "",
			image: cat.image || "",
		});
		setImagePreview(cat.image || "");
		setImageFile(null);
	};

	const cancelEdit = () => {
		setEditId(null);
		setFormData({ name: "", description: "", image: "" });
		setImagePreview("");
		setImageFile(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim())
			return toast.error("Tên danh mục là bắt buộc");
		setFormLoading(true);
		try {
			let finalImageUrl = formData.image;
			if (imageFile) {
				const uploadData = new FormData();
				uploadData.append("image", imageFile);
				const uploadRes = await apiUploadImage(uploadData);
				if (uploadRes.success) finalImageUrl = uploadRes.url;
			}
			const payload = { ...formData, image: finalImageUrl };
			if (editId) {
				const res = await apiUpdateCategory(editId, payload);
				if (res.success) {
					toast.success("Cập nhật thành công");
					setCategories(
						categories.map((c) =>
							c._id === editId ? res.result : c,
						),
					);
					cancelEdit();
				}
			} else {
				const res = await apiCreateCategory(payload);
				if (res.success) {
					toast.success("Thêm mới thành công");
					setCategories([res.result, ...categories]);
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
			title: `<span style="font-family:'Syne',sans-serif;font-size:1.05rem">Xóa danh mục?</span>`,
			html: `<span style="font-family:'DM Sans',sans-serif;font-size:.88rem;color:#6a5a4a">Danh mục <b>${name}</b> sẽ bị xóa. Các sản phẩm liên kết có thể bị ảnh hưởng.</span>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Vẫn xóa",
			cancelButtonText: "Quay lại",
			customClass: {
				popup: "rounded-2xl",
				confirmButton: "rounded-xl font-bold",
				cancelButton: "rounded-xl font-bold",
			},
		});
		if (result.isConfirmed) {
			try {
				const res = await apiDeleteCategory(id);
				if (res.success) {
					toast.success("Đã xóa thành công");
					setCategories(categories.filter((c) => c._id !== id));
				}
			} catch (error) {
				toast.error(error.response?.data?.message || "Xóa thất bại");
			}
		}
	};

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.ac-root    { font-family:'DM Sans',sans-serif; }
				.ac-heading { font-family:'Syne',sans-serif; }
				.ac-row     { transition: background .15s; }
				.ac-row:hover td { background: #fdf9f6; }
				.ac-fade    { animation: acFadeUp .35s ease both; }
				@keyframes acFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
			`}</style>

			<div className="ac-root ac-fade">
				{/* Header */}
				<div className="mb-5">
					<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-0.5">
						SoleStore Admin
					</p>
					<h2 className="ac-heading text-[#1a1914] text-2xl font-bold">
						Quản lý Danh mục
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
							{/* Form header */}
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
								<h3 className="ac-heading text-[#1a1914] font-bold text-sm">
									{editId
										? "Chỉnh sửa danh mục"
										: "Thêm danh mục mới"}
								</h3>
							</div>

							<form
								onSubmit={handleSubmit}
								className="p-5 space-y-4">
								<div>
									<label className={LBL}>
										Tên danh mục *
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
										placeholder="VD: Giày thể thao"
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
										placeholder="Mô tả ngắn về danh mục..."
									/>
								</div>

								{/* Image upload */}
								<div>
									<label className={LBL}>Ảnh đại diện</label>
									<div className="flex items-center gap-4">
										<div className="w-32 h-32 rounded-xl border-2 border-dashed border-[#e8d8cc] bg-[#fdf8f4] flex items-center justify-center overflow-hidden shrink-0">
											{imagePreview ? (
												<img
													src={imagePreview}
													alt="preview"
													className="w-full h-full object-cover rounded-xl"
												/>
											) : (
												<ImageIcon
													size={20}
													className="text-[#d0c0b0]"
												/>
											)}
										</div>
										<div className="flex-1">
											<input
												type="file"
												id="cat-image"
												accept="image/*"
												onChange={handleImageSelect}
												className="hidden"
											/>
											<label
												htmlFor="cat-image"
												className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-[#fff3eb] text-[#c2784d] border border-[#f0ddd0] rounded-xl cursor-pointer hover:bg-[#ffe0c8] transition">
												<UploadCloud size={13} /> Chọn
												ảnh
											</label>
											{imagePreview && (
												<button
													type="button"
													onClick={() => {
														setImagePreview("");
														setImageFile(null);
														setFormData({
															...formData,
															image: "",
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
							<h3 className="ac-heading text-[#1a1914] font-bold text-base">
								Danh sách
							</h3>
							<span className="text-xs font-bold text-[#a08070] bg-[#f5ede4] px-2.5 py-1 rounded-full">
								{categories.length} danh mục
							</span>
						</div>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="bg-[#fdf8f4] border-b border-[#f5ede4]">
										{[
											"Hình ảnh",
											"Tên danh mục",
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
										categories.map((cat) => (
											<tr
												key={cat._id}
												className="ac-row border-b border-[#f8f0e8] last:border-0">
												<td className="p-3.5">
													<div className="w-24 h-24 rounded-xl overflow-hidden border border-[#f0ddd0] bg-[#fdf8f4]">
														<img
															src={
																cat.image ||
																"https://placehold.co/200x200?text=—"
															}
															alt={cat.name}
															className="w-full h-full object-cover"
														/>
													</div>
												</td>
												<td className="px-5 py-3.5">
													<p className="font-semibold text-[#1a1914]">
														{cat.name}
													</p>
													{cat.description && (
														<p className="text-[11px] text-[#a08070] mt-0.5 truncate max-w-45">
															{cat.description}
														</p>
													)}
												</td>
												<td className="px-5 py-3.5">
													<code className="text-[11px] text-[#8a7060] bg-[#f5ede4] px-2 py-0.5 rounded-md">
														{cat.slug}
													</code>
												</td>
												<td className="px-5 py-3.5 text-center">
													<div className="flex items-center justify-center gap-1.5">
														<button
															onClick={() =>
																triggerEdit(cat)
															}
															className="p-2 rounded-lg bg-[#eff4ff] text-[#5b8dee] hover:bg-[#dde8ff] transition">
															<Edit size={14} />
														</button>
														<button
															onClick={() =>
																handleDelete(
																	cat._id,
																	cat.name,
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
							{categories.length === 0 && !loading && (
								<div className="text-center py-12">
									<ListTree
										size={26}
										className="text-[#e0d0c0] mx-auto mb-2"
									/>
									<p className="text-[#b0a090] text-sm">
										Chưa có danh mục nào.
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

export default AdminCategories;
