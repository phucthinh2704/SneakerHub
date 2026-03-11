import {
	ArrowLeft,
	ImagePlus,
	Loader2,
	Package,
	Palette,
	Plus,
	Ruler,
	Save,
	Trash2,
	XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import {
	apiCreateProduct,
	apiGetAllBrandsAdmin,
	apiGetAllCategoriesAdmin,
	apiUpdateProduct,
	apiUploadMultipleImages,
} from "../../api/admin";
import { apiGetProductDetail } from "../../api/product";

/* ─── Shared input style ─────────────────────────────────────────────────── */
const INP =
	"w-full bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl px-3.5 py-2.5 text-sm text-[#2d2418] placeholder-[#c0a890] outline-none transition focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15";
const LBL =
	"block text-[10px] font-bold tracking-[.15em] uppercase text-[#8a7060] mb-1.5";

const AdminProductForm = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const isEditMode = !!slug;

	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(isEditMode);
	const [productId, setProductId] = useState(null);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		brand: "",
		isPublished: true,
		variants: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [catRes, brandRes] = await Promise.all([
					apiGetAllCategoriesAdmin(),
					apiGetAllBrandsAdmin(),
				]);
				if (catRes.success) setCategories(catRes.result);
				if (brandRes.success) setBrands(brandRes.result);

				if (isEditMode) {
					const prodRes = await apiGetProductDetail(slug);
					if (prodRes.success) {
						const p = prodRes.result;
						setProductId(p._id);
						const mappedVariants = p.variants.map((v) => ({
							...v,
							imagesUI: v.images
								? v.images.map((imgUrl) => ({
										file: null,
										url: imgUrl,
										preview: imgUrl,
									}))
								: [],
						}));
						setFormData({
							name: p.name,
							description: p.description,
							price: p.price,
							category: p.category?._id || "",
							brand: p.brand?._id || "",
							isPublished: p.isPublished,
							variants: mappedVariants,
						});
					}
				}
			} catch (error) {
				console.log(error);
				toast.error("Lỗi tải dữ liệu sản phẩm");
			} finally {
				setInitialLoading(false);
			}
		};
		fetchData();
	}, [slug, isEditMode]);

	/* ── Variants ──────────────────────────────────────────────────────────── */
	const addVariant = () =>
		setFormData((prev) => ({
			...prev,
			variants: [
				...prev.variants,
				{
					color: "",
					hexCode: "#c2784d",
					imagesUI: [],
					sizes: [{ size: "", quantity: 0 }],
				},
			],
		}));

	const removeVariant = async (vIndex) => {
		const result = await Swal.fire({
			title: `<span style="font-family:'Syne',sans-serif;font-size:1rem">Xóa màu sắc này?</span>`,
			html: `<span style="font-family:'DM Sans',sans-serif;font-size:.88rem;color:#6a5a4a">Các ảnh và kích thước thuộc màu này sẽ bị xóa!</span>`,
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
		if (result.isConfirmed) {
			const newVariants = [...formData.variants];
			newVariants[vIndex].imagesUI.forEach((img) => {
				if (img.file) URL.revokeObjectURL(img.preview);
			});
			newVariants.splice(vIndex, 1);
			setFormData({ ...formData, variants: newVariants });
		}
	};

	const updateVariant = (vIndex, field, value) => {
		const nv = [...formData.variants];
		nv[vIndex][field] = value;
		setFormData({ ...formData, variants: nv });
	};

	/* ── Sizes ──────────────────────────────────────────────────────────────── */
	const addSize = (vIndex) => {
		const nv = [...formData.variants];
		nv[vIndex].sizes.push({ size: "", quantity: 0 });
		setFormData({ ...formData, variants: nv });
	};
	const removeSize = (vIndex, sIndex) => {
		const nv = [...formData.variants];
		nv[vIndex].sizes.splice(sIndex, 1);
		setFormData({ ...formData, variants: nv });
	};
	const updateSize = (vIndex, sIndex, field, value) => {
		const nv = [...formData.variants];
		nv[vIndex].sizes[sIndex][field] = value;
		setFormData({ ...formData, variants: nv });
	};

	/* ── Images ─────────────────────────────────────────────────────────────── */
	const handleImageSelect = (e, vIndex) => {
		const files = Array.from(e.target.files);
		if (!files.length) return;
		const cv = formData.variants[vIndex];
		if (cv.imagesUI.length + files.length > 5)
			return toast.error("Tối đa 5 ảnh mỗi màu!");
		const validFiles = files.filter((f) => f.type.startsWith("image/"));
		const newImagesUI = validFiles.map((file) => ({
			file,
			url: null,
			preview: URL.createObjectURL(file),
		}));
		const nv = [...formData.variants];
		nv[vIndex].imagesUI = [...cv.imagesUI, ...newImagesUI];
		setFormData({ ...formData, variants: nv });
		e.target.value = null;
	};

	const handleRemoveImage = (vIndex, imgIndex) => {
		const nv = [...formData.variants];
		const removed = nv[vIndex].imagesUI[imgIndex];
		if (removed.file) URL.revokeObjectURL(removed.preview);
		nv[vIndex].imagesUI.splice(imgIndex, 1);
		setFormData({ ...formData, variants: nv });
	};

	/* ── Submit ─────────────────────────────────────────────────────────────── */
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (formData.variants.length === 0)
			return toast.error("Vui lòng thêm ít nhất 1 biến thể (Màu sắc)");
		for (const v of formData.variants) {
			if (v.imagesUI.length === 0)
				return toast.error(
					`Vui lòng chọn ít nhất 1 ảnh cho màu ${v.color || "mới"}`,
				);
			if (v.sizes.length === 0)
				return toast.error(
					`Vui lòng thêm ít nhất 1 size cho màu ${v.color}`,
				);
		}
		setLoading(true);
		const toastId = toast.loading("Đang xử lý và tải ảnh lên...");
		try {
			const payloadVariants = JSON.parse(
				JSON.stringify(formData.variants),
			);
			for (let i = 0; i < formData.variants.length; i++) {
				const variantUI = formData.variants[i];
				const filesToUpload = variantUI.imagesUI
					.filter((img) => img.file !== null)
					.map((img) => img.file);
				let uploadedUrls = [];
				if (filesToUpload.length > 0) {
					const uploadData = new FormData();
					filesToUpload.forEach((file) =>
						uploadData.append("images", file),
					);
					const uploadRes = await apiUploadMultipleImages(uploadData);
					if (uploadRes.success) uploadedUrls = uploadRes.urls;
					else throw new Error(`Lỗi tải ảnh màu ${variantUI.color}`);
				}
				let newUrlIndex = 0;
				const finalImages = variantUI.imagesUI.map((img) => {
					if (img.url) return img.url;
					return uploadedUrls[newUrlIndex++];
				});
				payloadVariants[i].images = finalImages;
				delete payloadVariants[i].imagesUI;
			}
			const finalPayload = { ...formData, variants: payloadVariants };
			if (isEditMode) {
				await apiUpdateProduct(productId, finalPayload);
				toast.success("Cập nhật sản phẩm thành công", { id: toastId });
			} else {
				await apiCreateProduct(finalPayload);
				toast.success("Thêm sản phẩm thành công", { id: toastId });
			}
			navigate("/admin/products");
		} catch (error) {
			toast.error(
				error.response?.data?.message ||
					error.message ||
					"Lỗi lưu sản phẩm",
				{ id: toastId },
			);
		} finally {
			setLoading(false);
		}
	};

	if (initialLoading)
		return (
			<div className="flex h-64 items-center justify-center">
				<Loader2
					className="animate-spin text-[#c2784d]"
					size={36}
				/>
			</div>
		);

	return (
		<>
			<style>{`
			@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.apf-root    { font-family:'DM Sans',sans-serif; }
				.apf-heading { font-family:'Syne',sans-serif; }
				.apf-fade    { animation: apfFadeUp .35s ease both; }
				@keyframes apfFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
				.apf-variant-card { transition: border-color .2s; }
				.apf-variant-card:hover { border-color: rgba(194,120,77,.3); }
			`}</style>

			<div className="apf-root apf-fade max-w-5xl mx-auto pb-24">
				{/* ── Page header ── */}
				<div className="flex items-center gap-4 mb-6">
					<button
						onClick={() => navigate(-1)}
						className="w-9 h-9 bg-white border border-[#e8d8cc] rounded-xl flex items-center justify-center hover:bg-[#fdf8f4] transition shadow-sm">
						<ArrowLeft
							size={16}
							className="text-[#5a4a3a]"
						/>
					</button>
					<div>
						<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d]">
							SoleStore Admin
						</p>
						<h1 className="apf-heading text-[#1a1914] text-xl font-bold">
							{isEditMode
								? "Chỉnh sửa sản phẩm"
								: "Thêm sản phẩm mới"}
						</h1>
					</div>
				</div>

				<form
					onSubmit={handleSubmit}
					className="space-y-5">
					{/* ── Block 1: Basic info ── */}
					<div
						className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
						style={{
							boxShadow: "0 2px 16px rgba(194,120,77,.06)",
						}}>
						<div className="px-6 py-4 border-b border-[#f5ede4] flex items-center gap-2.5">
							<div className="w-7 h-7 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
								<Package
									size={13}
									className="text-[#c2784d]"
								/>
							</div>
							<h2 className="apf-heading text-[#1a1914] font-bold text-base">
								Thông tin cơ bản
							</h2>
						</div>
						<div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
							{/* Name */}
							<div className="md:col-span-2">
								<label className={LBL}>Tên sản phẩm *</label>
								<input
									required
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									className={INP}
									placeholder="VD: Nike Air Force 1 Low '07"
								/>
							</div>
							{/* Price */}
							<div>
								<label className={LBL}>Giá bán (VNĐ) *</label>
								<input
									required
									type="number"
									min="0"
									value={formData.price}
									onChange={(e) =>
										setFormData({
											...formData,
											price: e.target.value,
										})
									}
									className={INP}
									placeholder="VD: 2500000"
								/>
							</div>
							{/* Category */}
							<div>
								<label className={LBL}>Danh mục *</label>
								<select
									required
									value={formData.category}
									onChange={(e) =>
										setFormData({
											...formData,
											category: e.target.value,
										})
									}
									className={`${INP} cursor-pointer`}>
									<option value="">— Chọn danh mục —</option>
									{categories.map((c) => (
										<option
											key={c._id}
											value={c._id}>
											{c.name}
										</option>
									))}
								</select>
							</div>
							{/* Brand */}
							<div>
								<label className={LBL}>Thương hiệu *</label>
								<select
									required
									value={formData.brand}
									onChange={(e) =>
										setFormData({
											...formData,
											brand: e.target.value,
										})
									}
									className={`${INP} cursor-pointer`}>
									<option value="">
										— Chọn thương hiệu —
									</option>
									{brands.map((b) => (
										<option
											key={b._id}
											value={b._id}>
											{b.name}
										</option>
									))}
								</select>
							</div>
							{/* Publish toggle */}
							<div className="flex items-center">
								<label className="flex items-center gap-3 cursor-pointer select-none">
									{/* BỎ SỰ KIỆN ONCLICK Ở THẺ DIV NÀY */}
									<div
										className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${formData.isPublished ? "bg-[#c2784d]" : "bg-[#e0d0c0]"}`}>
										<input
											type="checkbox"
											checked={formData.isPublished}
											onChange={(e) =>
												setFormData({
													...formData,
													isPublished:
														e.target.checked,
												})
											}
											className="sr-only"
										/>
										<span
											className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200"
											style={{
												transform: formData.isPublished
													? "translateX(20px)"
													: "translateX(0)",
											}}
										/>
									</div>
									<div>
										<p className="text-sm font-semibold text-[#1a1914]">
											Hiển thị trên cửa hàng
										</p>
										<p className="text-[11px] text-[#a08070]">
											{formData.isPublished
												? "Sản phẩm đang được hiển thị"
												: "Sản phẩm đang bị ẩn"}
										</p>
									</div>
								</label>
							</div>
							{/* Description */}
							<div className="md:col-span-2">
								<label className={LBL}>Mô tả sản phẩm</label>
								<textarea
									rows={4}
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									className={`${INP} resize-none`}
									placeholder="Nhập mô tả chi tiết sản phẩm..."
								/>
							</div>
						</div>
					</div>

					{/* ── Block 2: Variants ── */}
					<div
						className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
						style={{
							boxShadow: "0 2px 16px rgba(194,120,77,.06)",
						}}>
						<div className="px-6 py-4 border-b border-[#f5ede4] flex items-center justify-between">
							<div className="flex items-center gap-2.5">
								<div className="w-7 h-7 rounded-lg bg-[#fff3eb] border border-[#f0ddd0] flex items-center justify-center">
									<Palette
										size={13}
										className="text-[#c2784d]"
									/>
								</div>
								<div>
									<h2 className="apf-heading text-[#1a1914] font-bold text-base">
										Biến thể sản phẩm
									</h2>
									<p className="text-[11px] text-[#a08070]">
										Màu sắc, hình ảnh & kích thước
									</p>
								</div>
							</div>
							<button
								type="button"
								onClick={addVariant}
								className="inline-flex items-center gap-2 bg-[#c2784d] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#a05e38] transition"
								style={{
									boxShadow: "0 3px 10px rgba(194,120,77,.3)",
								}}>
								<Plus size={14} /> Thêm màu
							</button>
						</div>

						<div className="p-6 space-y-5">
							{formData.variants.map((variant, vIndex) => (
								<div
									key={vIndex}
									className="apf-variant-card relative bg-[#fdf8f4] border-2 border-[#f0e5d8] rounded-2xl p-5">
									{/* Remove variant */}
									<button
										type="button"
										onClick={() => removeVariant(vIndex)}
										className="absolute -top-3 -right-3 w-7 h-7 bg-red-100 text-red-500 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center transition shadow-sm">
										<Trash2 size={13} />
									</button>

									{/* Variant header */}
									<div className="flex items-center gap-3 mb-5">
										<div
											className="w-8 h-8 rounded-xl border-2 border-white shadow-md shrink-0"
											style={{
												backgroundColor:
													variant.hexCode ||
													"#c2784d",
											}}
										/>
										<div>
											<p className="text-xs font-bold text-[#a08070] uppercase tracking-wider">
												Biến thể #{vIndex + 1}
											</p>
											<p className="text-sm font-semibold text-[#1a1914]">
												{variant.color ||
													"Chưa đặt tên màu"}
											</p>
										</div>
									</div>

									<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
										{/* Left: Color config + Sizes */}
										<div className="lg:col-span-5 space-y-4">
											{/* Color name + hex */}
											<div className="flex gap-3">
												<div className="flex-1">
													<label className={LBL}>
														Tên màu
													</label>
													<input
														required
														placeholder="VD: Trắng Đỏ"
														value={variant.color}
														onChange={(e) =>
															updateVariant(
																vIndex,
																"color",
																e.target.value,
															)
														}
														className={INP}
													/>
												</div>
												<div className="w-20">
													<label className={LBL}>
														Mã màu
													</label>
													<input
														type="color"
														value={variant.hexCode}
														onChange={(e) =>
															updateVariant(
																vIndex,
																"hexCode",
																e.target.value,
															)
														}
														className="w-full h-10 p-0.5 border border-[#e8d8cc] rounded-xl cursor-pointer bg-white"
													/>
												</div>
											</div>

											{/* Sizes */}
											<div className="bg-white rounded-xl border border-[#e8d8cc] overflow-hidden">
												<div className="flex items-center justify-between px-4 py-3 border-b border-[#f0e5d8]">
													<div className="flex items-center gap-2">
														<Ruler
															size={13}
															className="text-[#c2784d]"
														/>
														<span className="text-xs font-bold text-[#5a4a3a] uppercase tracking-wider">
															Kích thước & Tồn kho
														</span>
													</div>
													<button
														type="button"
														onClick={() =>
															addSize(vIndex)
														}
														className="inline-flex items-center gap-1 text-[11px] font-bold text-[#c2784d] bg-[#fff3eb] px-2.5 py-1 rounded-lg hover:bg-[#ffe0c8] transition">
														<Plus size={11} /> Thêm
														size
													</button>
												</div>
												<div className="p-3 space-y-2 max-h-48 overflow-y-auto">
													{variant.sizes.map(
														(sizeObj, sIndex) => (
															<div
																key={sIndex}
																className="flex items-center gap-2">
																<input
																	required
																	placeholder="Size"
																	value={
																		sizeObj.size
																	}
																	onChange={(
																		e,
																	) =>
																		updateSize(
																			vIndex,
																			sIndex,
																			"size",
																			e
																				.target
																				.value,
																		)
																	}
																	className="flex-1 bg-[#fdf8f4] border border-[#e8d8cc] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c2784d] transition"
																/>
																<input
																	required
																	type="number"
																	min="0"
																	placeholder="Kho"
																	value={
																		sizeObj.quantity
																	}
																	onChange={(
																		e,
																	) =>
																		updateSize(
																			vIndex,
																			sIndex,
																			"quantity",
																			e
																				.target
																				.value,
																		)
																	}
																	className="flex-1 bg-[#fdf8f4] border border-[#e8d8cc] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#c2784d] transition"
																/>
																<button
																	type="button"
																	onClick={() =>
																		removeSize(
																			vIndex,
																			sIndex,
																		)
																	}
																	className="text-[#c0b0a0] hover:text-red-400 transition p-1">
																	<XCircle
																		size={
																			16
																		}
																	/>
																</button>
															</div>
														),
													)}
													{variant.sizes.length ===
														0 && (
														<p className="text-xs text-red-400 italic px-1 py-1">
															Vui lòng thêm kích
															thước.
														</p>
													)}
												</div>
											</div>
										</div>

										{/* Right: Images */}
										<div className="lg:col-span-7">
											<div className="flex items-center justify-between mb-3">
												<label
													className={`${LBL} mb-0`}>
													Hình ảnh (
													{variant.imagesUI.length}/5)
												</label>
												<div className="relative">
													<input
														type="file"
														multiple
														accept="image/*"
														id={`upload-${vIndex}`}
														className="hidden"
														onChange={(e) =>
															handleImageSelect(
																e,
																vIndex,
															)
														}
														disabled={
															variant.imagesUI
																.length >= 5
														}
													/>
													<label
														htmlFor={`upload-${vIndex}`}
														className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
															variant.imagesUI
																.length >= 5
																? "bg-[#f5f5f5] text-[#b0a090] cursor-not-allowed"
																: "bg-[#fff3eb] text-[#c2784d] border border-[#f0ddd0] hover:bg-[#ffe0c8]"
														}`}>
														<ImagePlus size={13} />{" "}
														Chọn ảnh
													</label>
												</div>
											</div>

											<div className="grid grid-cols-5 gap-2">
												{variant.imagesUI.map(
													(img, imgIndex) => (
														<div
															key={imgIndex}
															className="relative aspect-square rounded-xl overflow-hidden border-2 border-[#e8d8cc] group bg-[#fdf8f4]">
															<img
																src={
																	img.preview
																}
																alt="preview"
																className="w-full h-full object-cover"
															/>
															<div className="absolute top-1 left-1">
																<span
																	className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${img.file ? "bg-[#c2784d] text-white" : "bg-white/80 text-[#8a7060]"}`}>
																	{img.file
																		? "Mới"
																		: "Đã lưu"}
																</span>
															</div>
															<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
																<button
																	type="button"
																	onClick={() =>
																		handleRemoveImage(
																			vIndex,
																			imgIndex,
																		)
																	}
																	className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 transition">
																	<Trash2
																		size={
																			13
																		}
																	/>
																</button>
															</div>
														</div>
													),
												)}
												{[
													...Array(
														5 -
															variant.imagesUI
																.length,
													),
												].map((_, i) => (
													<div
														key={`empty-${i}`}
														className="aspect-square rounded-xl border-2 border-dashed border-[#e8d8cc] bg-[#fdf8f4] flex items-center justify-center">
														<ImagePlus
															size={18}
															className="text-[#d8c8b8]"
														/>
													</div>
												))}
											</div>
										</div>
									</div>
								</div>
							))}

							{formData.variants.length === 0 && (
								<div className="text-center py-14 border-2 border-dashed border-[#e8d8cc] rounded-2xl bg-[#fdf8f4]">
									<Palette
										size={28}
										className="text-[#d8c8b8] mx-auto mb-3"
									/>
									<p className="text-[#b0a090] text-sm">
										Sản phẩm chưa có màu sắc nào.
									</p>
									<button
										type="button"
										onClick={addVariant}
										className="mt-3 text-[#c2784d] font-bold text-sm hover:underline">
										Bấm vào đây để thêm màu đầu tiên
									</button>
								</div>
							)}
						</div>
					</div>
				</form>

				{/* ── Sticky footer ── */}
				<div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-t border-[#f0e5d8] px-6 py-4 flex justify-end gap-3">
					<button
						type="button"
						onClick={() => navigate("/admin/products")}
						className="px-5 py-2.5 border border-[#e8d8cc] rounded-xl text-sm font-bold text-[#6a5a4a] hover:bg-[#fdf8f4] transition">
						Hủy bỏ
					</button>
					<button
						onClick={handleSubmit}
						disabled={loading}
						className="inline-flex items-center gap-2 px-7 py-2.5 bg-[#c2784d] text-white rounded-xl font-bold text-sm hover:bg-[#a05e38] disabled:opacity-60 transition"
						style={{
							boxShadow: "0 4px 14px rgba(194,120,77,.35)",
						}}>
						{loading ? (
							<>
								<Loader2
									className="animate-spin"
									size={15}
								/>{" "}
								Đang tải lên...
							</>
						) : (
							<>
								<Save size={15} />{" "}
								{isEditMode
									? "Cập nhật sản phẩm"
									: "Đăng sản phẩm"}
							</>
						)}
					</button>
				</div>
			</div>
		</>
	);
};

export default AdminProductForm;
