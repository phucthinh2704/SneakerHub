import {
	ArrowLeft,
	ImagePlus,
	Loader2,
	Plus,
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

const AdminProductForm = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const isEditMode = !!slug;

	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(isEditMode);
	const [productId, setProductId] = useState(null);

	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	// STATE CHÍNH CỦA FORM
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		brand: "",
		isPublished: true,
		variants: [],
		// Cấu trúc mới của variants:
		// { color: "", hexCode: "", sizes: [], imagesUI: [ { file: File, url: "DB_Link", preview: "blob:..." } ] }
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

						// Chuyển đổi mảng chuỗi ảnh từ DB thành mảng Object imagesUI để quản lý Preview
						const mappedVariants = p.variants.map((v) => ({
							...v,
							imagesUI: v.images
								? v.images.map((imgUrl) => ({
										file: null, // Không có file vật lý vì ảnh từ DB
										url: imgUrl, // Link thật từ DB
										preview: imgUrl, // Dùng link thật làm preview
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

	// --- QUẢN LÝ BIẾN THỂ CƠ BẢN ---
	const addVariant = () => {
		setFormData((prev) => ({
			...prev,
			variants: [
				...prev.variants,
				{
					color: "",
					hexCode: "#000000",
					imagesUI: [],
					sizes: [{ size: "", quantity: 0 }],
				},
			],
		}));
	};

	const removeVariant = async (vIndex) => {
		const result = await Swal.fire({
			title: "Xóa màu sắc này?",
			text: "Các hình ảnh và kích thước thuộc màu này sẽ bị xóa!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
		});

		if (result.isConfirmed) {
			const newVariants = [...formData.variants];
			// Dọn dẹp bộ nhớ các URL preview ảo
			newVariants[vIndex].imagesUI.forEach((img) => {
				if (img.file) URL.revokeObjectURL(img.preview);
			});
			newVariants.splice(vIndex, 1);
			setFormData({ ...formData, variants: newVariants });
		}
	};

	const updateVariant = (vIndex, field, value) => {
		const newVariants = [...formData.variants];
		newVariants[vIndex][field] = value;
		setFormData({ ...formData, variants: newVariants });
	};

	// --- QUẢN LÝ SIZE ---
	const addSize = (vIndex) => {
		const newVariants = [...formData.variants];
		newVariants[vIndex].sizes.push({ size: "", quantity: 0 });
		setFormData({ ...formData, variants: newVariants });
	};

	const removeSize = (vIndex, sIndex) => {
		const newVariants = [...formData.variants];
		newVariants[vIndex].sizes.splice(sIndex, 1);
		setFormData({ ...formData, variants: newVariants });
	};

	const updateSize = (vIndex, sIndex, field, value) => {
		const newVariants = [...formData.variants];
		newVariants[vIndex].sizes[sIndex][field] = value;
		setFormData({ ...formData, variants: newVariants });
	};

	// ==========================================
	// QUẢN LÝ ẢNH (LOCAL PREVIEW) TỐI ĐA 5 ẢNH
	// ==========================================
	const handleImageSelect = (e, vIndex) => {
		const files = Array.from(e.target.files);
		if (files.length === 0) return;

		const currentVariant = formData.variants[vIndex];

		// Kiểm tra giới hạn 5 ảnh
		if (currentVariant.imagesUI.length + files.length > 5) {
			return toast.error("Chỉ được tải lên tối đa 5 ảnh cho mỗi màu!");
		}

		// Lọc chỉ nhận file ảnh
		const validFiles = files.filter((f) => f.type.startsWith("image/"));

		// Tạo cấu trúc object cho UI
		const newImagesUI = validFiles.map((file) => ({
			file: file,
			url: null,
			preview: URL.createObjectURL(file), // Tạo link ảo để xem ngay lập tức
		}));

		const newVariants = [...formData.variants];
		newVariants[vIndex].imagesUI = [
			...currentVariant.imagesUI,
			...newImagesUI,
		];
		setFormData({ ...formData, variants: newVariants });

		// Reset input file để chọn lại ảnh cùng tên được
		e.target.value = null;
	};

	const handleRemoveImage = (vIndex, imgIndex) => {
		const newVariants = [...formData.variants];
		const removedImg = newVariants[vIndex].imagesUI[imgIndex];

		// Giải phóng bộ nhớ ảo nếu là file chọn từ máy
		if (removedImg.file) URL.revokeObjectURL(removedImg.preview);

		newVariants[vIndex].imagesUI.splice(imgIndex, 1);
		setFormData({ ...formData, variants: newVariants });
	};

	// ==========================================
	// XỬ LÝ SUBMIT (UPLOAD ẢNH -> LƯU DB)
	// ==========================================
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate Front-end
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
		const toastId = toast.loading("Đang xử lý dữ liệu và tải ảnh lên...");

		try {
			// Deep copy variants để xử lý trước khi gửi API
			const payloadVariants = JSON.parse(
				JSON.stringify(formData.variants),
			);

			// Lặp qua từng biến thể để upload ảnh
			for (let i = 0; i < formData.variants.length; i++) {
				const variantUI = formData.variants[i];

				// Tách ra những ảnh là File mới (cần upload)
				const filesToUpload = variantUI.imagesUI
					.filter((img) => img.file !== null)
					.map((img) => img.file);
				let uploadedUrls = [];

				// Gọi API Upload Nhiều Ảnh cho các file mới
				if (filesToUpload.length > 0) {
					const uploadData = new FormData();
					filesToUpload.forEach((file) =>
						uploadData.append("images", file),
					); // Key "images" map với Backend

					const uploadRes = await apiUploadMultipleImages(uploadData);
					if (uploadRes.success) {
						uploadedUrls = uploadRes.urls;
					} else {
						throw new Error(`Lỗi tải ảnh màu ${variantUI.color}`);
					}
				}

				// Gom lại mảng URLs cuối cùng (Ảnh cũ DB + Ảnh mới Upload)
				let newUrlIndex = 0;
				const finalImages = variantUI.imagesUI.map((img) => {
					if (img.url) return img.url; // Giữ nguyên link ảnh cũ từ DB

					const newLink = uploadedUrls[newUrlIndex];
					newUrlIndex++;
					return newLink;
				});

				// Gán mảng strings chuẩn bị lưu DB
				payloadVariants[i].images = finalImages;
				delete payloadVariants[i].imagesUI; // Xóa key imagesUI dùng tạm ở UI
			}

			// Payload cuối cùng gửi xuống backend
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
				<Loader2 className="animate-spin text-orange-600 w-10 h-10" />
			</div>
		);

	return (
		<div className="max-w-5xl mx-auto pb-20">
			<div className="flex items-center mb-6 space-x-4">
				<button
					onClick={() => navigate(-1)}
					className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
					<ArrowLeft size={20} />
				</button>
				<h1 className="text-2xl font-bold text-gray-800">
					{isEditMode ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
				</h1>
			</div>

			<form
				onSubmit={handleSubmit}
				className="space-y-8">
				{/* --- KHỐI THÔNG TIN CƠ BẢN --- */}
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 space-y-5">
					<h2 className="text-lg font-bold text-gray-900 border-b pb-3">
						Thông tin cơ bản
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="md:col-span-2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Tên sản phẩm *
							</label>
							<input
								required
								value={formData.name}
								onChange={(e) =>
									setFormData({
										...formData,
										name: e.target.value,
									})
								}
								className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
								placeholder="VD: Nike Air Force 1"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Giá bán (VNĐ) *
							</label>
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
								className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
								placeholder="VD: 2500000"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Danh mục *
							</label>
							<select
								required
								value={formData.category}
								onChange={(e) =>
									setFormData({
										...formData,
										category: e.target.value,
									})
								}
								className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white">
								<option value="">-- Chọn danh mục --</option>
								{categories.map((c) => (
									<option
										key={c._id}
										value={c._id}>
										{c.name}
									</option>
								))}
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Thương hiệu *
							</label>
							<select
								required
								value={formData.brand}
								onChange={(e) =>
									setFormData({
										...formData,
										brand: e.target.value,
									})
								}
								className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white">
								<option value="">-- Chọn thương hiệu --</option>
								{brands.map((b) => (
									<option
										key={b._id}
										value={b._id}>
										{b.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex items-end pb-3">
							<label className="flex items-center space-x-3 cursor-pointer">
								<input
									type="checkbox"
									checked={formData.isPublished}
									onChange={(e) =>
										setFormData({
											...formData,
											isPublished: e.target.checked,
										})
									}
									className="w-6 h-6 text-orange-600 rounded"
								/>
								<span className="font-bold text-gray-800">
									Hiển thị trên cửa hàng (Publish)
								</span>
							</label>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Mô tả sản phẩm
						</label>
						<textarea
							rows="4"
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
							placeholder="Nhập mô tả chi tiết..."
						/>
					</div>
				</div>

				{/* --- KHỐI QUẢN LÝ BIẾN THỂ --- */}
				<div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
					<div className="flex justify-between items-center border-b pb-4 mb-6">
						<div>
							<h2 className="text-xl font-bold text-gray-900">
								Biến thể Sản phẩm
							</h2>
							<p className="text-sm text-gray-500 mt-1">
								Quản lý Màu sắc, Hình ảnh và Kích thước
							</p>
						</div>
						<button
							type="button"
							onClick={addVariant}
							className="flex items-center bg-gray-900 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition shadow-sm">
							<Plus
								size={18}
								className="mr-2"
							/>{" "}
							Thêm Màu
						</button>
					</div>

					<div className="space-y-8">
						{formData.variants.map((variant, vIndex) => (
							<div
								key={vIndex}
								className="p-6 border-2 border-gray-100 rounded-2xl bg-gray-50/50 relative">
								{/* Nút xóa biến thể */}
								<button
									type="button"
									onClick={() => removeVariant(vIndex)}
									className="absolute -top-3 -right-3 bg-red-100 text-red-600 hover:bg-red-600 hover:text-white p-2 rounded-full shadow-sm transition">
									<Trash2 size={20} />
								</button>

								<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
									{/* Cột Trái: Cấu hình Màu & Kích thước */}
									<div className="lg:col-span-5 space-y-5">
										<div className="flex gap-4">
											<div className="flex-1">
												<label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
													Tên Màu
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
													className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
												/>
											</div>
											<div className="w-24">
												<label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wide">
													Mã Màu
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
													className="w-full h-11.5 p-1 border rounded-lg cursor-pointer bg-white"
												/>
											</div>
										</div>

										{/* Quản lý Size */}
										<div className="bg-white p-4 rounded-xl border border-gray-200">
											<div className="flex justify-between items-center mb-3">
												<span className="text-sm font-bold text-gray-800">
													Kích thước & Tồn kho
												</span>
												<button
													type="button"
													onClick={() =>
														addSize(vIndex)
													}
													className="text-xs font-bold text-orange-600 hover:bg-orange-50 px-2 py-1 rounded flex items-center">
													<Plus
														size={14}
														className="mr-1"
													/>{" "}
													Thêm Size
												</button>
											</div>

											<div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
												{variant.sizes.map(
													(sizeObj, sIndex) => (
														<div
															key={sIndex}
															className="flex items-center space-x-2">
															<input
																required
																placeholder="Size"
																value={
																	sizeObj.size
																}
																onChange={(e) =>
																	updateSize(
																		vIndex,
																		sIndex,
																		"size",
																		e.target
																			.value,
																	)
																}
																className="w-1/2 p-2 text-sm border rounded bg-gray-50 focus:bg-white focus:ring-1 outline-none"
															/>
															<input
																required
																type="number"
																min="0"
																placeholder="Kho"
																value={
																	sizeObj.quantity
																}
																onChange={(e) =>
																	updateSize(
																		vIndex,
																		sIndex,
																		"quantity",
																		e.target
																			.value,
																	)
																}
																className="w-1/2 p-2 text-sm border rounded bg-gray-50 focus:bg-white focus:ring-1 outline-none"
															/>
															<button
																type="button"
																onClick={() =>
																	removeSize(
																		vIndex,
																		sIndex,
																	)
																}
																className="text-gray-400 hover:text-red-500 p-1">
																<XCircle
																	size={18}
																/>
															</button>
														</div>
													),
												)}
												{variant.sizes.length === 0 && (
													<p className="text-xs text-red-500 italic">
														Vui lòng thêm kích
														thước.
													</p>
												)}
											</div>
										</div>
									</div>

									{/* Cột Phải: Quản lý Ảnh (Grid 5) */}
									<div className="lg:col-span-7">
										<div className="flex justify-between items-end mb-3">
											<label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
												Hình ảnh biến thể (
												{variant.imagesUI.length}/5)
											</label>

											{/* Nút Upload */}
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
													className={`flex items-center px-4 py-2 text-sm font-bold rounded-lg transition shadow-sm
                            ${variant.imagesUI.length >= 5 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-orange-100 text-orange-600 hover:bg-orange-200 cursor-pointer"}`}>
													<ImagePlus
														size={16}
														className="mr-2"
													/>{" "}
													Chọn Ảnh
												</label>
											</div>
										</div>

										{/* Vùng Grid hiển thị 5 ô ảnh */}
										<div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
											{/* Render các ảnh đã chọn */}
											{variant.imagesUI.map(
												(img, imgIndex) => (
													<div
														key={imgIndex}
														className="relative aspect-w-1 aspect-h-1 rounded-xl overflow-hidden border-2 border-gray-200 group bg-white shadow-sm">
														<img
															src={img.preview}
															alt="preview"
															className="w-full h-full object-cover"
														/>

														{/* Label nhỏ hiển thị trạng thái ảnh */}
														<div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 rounded backdrop-blur-sm">
															{img.file
																? "Mới"
																: "Đã lưu"}
														</div>

														{/* Nút xóa ảnh */}
														<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
															<button
																type="button"
																onClick={() =>
																	handleRemoveImage(
																		vIndex,
																		imgIndex,
																	)
																}
																className="bg-red-500 text-white p-2 rounded-full hover:scale-110 transition transform">
																<Trash2
																	size={16}
																/>
															</button>
														</div>
													</div>
												),
											)}

											{/* Render các ô trống còn lại cho đủ 5 ô */}
											{[
												...Array(
													5 - variant.imagesUI.length,
												),
											].map((_, i) => (
												<div
													key={`empty-${i}`}
													className="aspect-w-1 aspect-h-1 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-gray-300">
													<ImagePlus
														size={24}
														className="opacity-50"
													/>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>
						))}

						{formData.variants.length === 0 && (
							<div className="text-center py-16 bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl">
								<p className="text-gray-500 text-lg">
									Sản phẩm chưa có màu sắc nào.
								</p>
								<button
									type="button"
									onClick={addVariant}
									className="mt-4 text-orange-600 font-bold hover:underline">
									Bấm vào đây để thêm màu đầu tiên
								</button>
							</div>
						)}
					</div>
				</div>

				{/* --- NÚT LƯU --- */}
				<div className="flex justify-end space-x-4 bg-white p-6 border-t border-gray-200 sticky bottom-0 z-50">
					<button
						type="button"
						onClick={() => navigate("/admin/products")}
						className="px-6 py-3 border border-gray-300 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition">
						Hủy bỏ
					</button>
					<button
						type="submit"
						disabled={loading}
						className="px-10 py-3 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 disabled:opacity-60 flex items-center transition shadow-lg hover:shadow-orange-600/30 transform hover:-translate-y-0.5">
						{loading ? (
							<>
								<Loader2
									className="animate-spin mr-3"
									size={20}
								/>{" "}
								Đang tải lên...
							</>
						) : isEditMode ? (
							"Cập nhật Sản phẩm"
						) : (
							"Đăng Sản phẩm"
						)}
					</button>
				</div>
			</form>
		</div>
	);
};

export default AdminProductForm;
