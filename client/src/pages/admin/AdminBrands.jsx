import {
	Edit,
	Image as ImageIcon,
	Loader2,
	Plus,
	Save,
	Trash2,
	UploadCloud,
	X,
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

	// --- THÊM 2 STATE ĐỂ QUẢN LÝ ẢNH LOCAL (PREVIEW) ---
	const [logoFile, setLogoFile] = useState(null); // Lưu file thật chờ up lên Cloudinary
	const [logoPreview, setLogoPreview] = useState(""); // Lưu link ảo để hiển thị xem trước

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

	// --- HÀM XỬ LÝ CHỌN ẢNH (CHỈ XEM TRƯỚC, CHƯA UP) ---
	const handleLogoSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			return toast.error("Vui lòng chọn file hình ảnh!");
		}

		setLogoFile(file); // Lưu file lại chờ lúc bấm Submit
		setLogoPreview(URL.createObjectURL(file)); // Tạo link ảo để hiện hình ngay lập tức
	};

	// Bật chế độ Sửa
	const triggerEdit = (brand) => {
		setEditId(brand._id);
		setFormData({
			name: brand.name,
			description: brand.description || "",
			logo: brand.logo || "",
		});
		// Nếu brand có sẵn logo trên DB thì gán vào preview
		setLogoPreview(brand.logo || "");
		setLogoFile(null); // Reset file mới
	};

	// Hủy Sửa
	const cancelEdit = () => {
		setEditId(null);
		setFormData({ name: "", description: "", logo: "" });
		setLogoPreview("");
		setLogoFile(null);
	};

	// --- HÀM SUBMIT: UPLOAD ẢNH -> LẤY LINK -> LƯU VÀO DB ---
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim())
			return toast.error("Tên thương hiệu là bắt buộc");
		if (!logoFile && !formData.logo)
			return toast.error("Vui lòng chọn logo thương hiệu");

		setFormLoading(true);
		try {
			let finalLogoUrl = formData.logo; // Mặc định là link cũ nếu không đổi ảnh

			// Nếu người dùng chọn ảnh MỚI -> Up lên Cloudinary
			if (logoFile) {
				const uploadData = new FormData();
				uploadData.append("image", logoFile); // Key "image" khớp với multer backend

				const uploadRes = await apiUploadImage(uploadData);
				if (uploadRes.success) {
					finalLogoUrl = uploadRes.url; // Lấy link trả về từ Cloudinary
				}
			}

			// Payload dữ liệu gửi lên DB
			const payload = { ...formData, logo: finalLogoUrl };

			if (editId) {
				// Cập nhật
				const res = await apiUpdateBrand(editId, payload);
				if (res.success) {
					toast.success("Cập nhật thành công");
					setBrands(
						brands.map((b) => (b._id === editId ? res.result : b)),
					);
					cancelEdit();
				}
			} else {
				// Thêm mới
				const res = await apiCreateBrand(payload);
				if (res.success) {
					toast.success("Thêm mới thành công");
					setBrands([res.result, ...brands]);
					cancelEdit();
				}
				else {
					Swal.fire({
						title: "Lỗi",
						text: res.message || "Thêm mới thất bại",
						icon: "error",
						confirmButtonText: "Đóng"
					});
				}
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Thao tác thất bại");
		} finally {
			setFormLoading(false);
		}
	};

	const handleDelete = async (id) => {
		const result = await Swal.fire({
			title: "Xóa thương hiệu?",
			text: "Thương hiệu này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?",
			icon: "error",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Xóa",
			cancelButtonText: "Hủy",
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
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* FORM THÊM / SỬA */}
			<div className="lg:col-span-1">
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
					<h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
						{editId
							? "Chỉnh sửa Thương hiệu"
							: "Thêm Thương hiệu mới"}
					</h2>
					<form
						onSubmit={handleSubmit}
						className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
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
								className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Mô tả
							</label>
							<textarea
								rows="3"
								value={formData.description}
								onChange={(e) =>
									setFormData({
										...formData,
										description: e.target.value,
									})
								}
								className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
							/>
						</div>

						{/* Vùng Upload Logo Local */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Logo Thương Hiệu *
							</label>
							<div className="flex items-center space-x-4">
								<div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden p-1">
									{/* Hiển thị logoPreview */}
									{logoPreview ? (
										<img
											src={logoPreview}
											alt="preview"
											className="w-full h-full object-contain"
										/>
									) : (
										<ImageIcon className="text-gray-300" />
									)}
								</div>
								<div className="flex-1">
									<input
										type="file"
										id="brand-logo"
										accept="image/*"
										onChange={handleLogoSelect}
										className="hidden"
									/>
									<label
										htmlFor="brand-logo"
										className="cursor-pointer inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition">
										<UploadCloud
											size={16}
											className="mr-2"
										/>{" "}
										Chọn Logo
									</label>
								</div>
							</div>
						</div>

						<div className="flex space-x-3 pt-2">
							<button
								type="submit"
								disabled={formLoading}
								className="flex-1 bg-gray-900 text-white py-2.5 rounded-lg font-bold hover:bg-gray-800 flex justify-center items-center disabled:opacity-50">
								{formLoading ? (
									<Loader2
										size={18}
										className="animate-spin mr-2"
									/>
								) : editId ? (
									<Save
										size={18}
										className="mr-2"
									/>
								) : (
									<Plus
										size={18}
										className="mr-2"
									/>
								)}
								{formLoading
									? "Đang lưu..."
									: editId
										? "Lưu"
										: "Thêm"}
							</button>
							{editId && (
								<button
									type="button"
									onClick={cancelEdit}
									className="px-4 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
									<X size={18} />
								</button>
							)}
						</div>
					</form>
				</div>
			</div>

			{/* DANH SÁCH */}
			<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-800">
						Danh sách ({brands.length})
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm whitespace-nowrap">
						<thead className="bg-gray-50 text-gray-600 font-medium">
							<tr>
								<th className="px-6 py-4">Logo</th>
								<th className="px-6 py-4">Tên Hãng</th>
								<th className="px-6 py-4">Slug</th>
								<th className="px-6 py-4 text-center">
									Thao Tác
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100">
							{loading ? (
								<tr>
									<td
										colSpan="4"
										className="text-center py-10">
										<Loader2 className="animate-spin inline text-orange-600" />
									</td>
								</tr>
							) : (
								brands.map((brand) => (
									<tr
										key={brand._id}
										className="hover:bg-gray-50">
										<td className="px-6 py-3">
											<div className="w-12 h-12 bg-white border rounded-md p-1 flex items-center justify-center">
												<img
													src={
														brand.logo ||
														"https://placehold.co/100x100?text=No+Logo"
													}
													alt="logo"
													className="max-w-full max-h-full object-contain"
												/>
											</div>
										</td>
										<td className="px-6 py-3 font-bold text-gray-900">
											{brand.name}
										</td>
										<td className="px-6 py-3 text-gray-500 font-mono text-xs">
											{brand.slug}
										</td>
										<td className="px-6 py-3 text-center space-x-2">
											<button
												onClick={() =>
													triggerEdit(brand)
												}
												className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded transition">
												<Edit size={16} />
											</button>
											<button
												onClick={() =>
													handleDelete(brand._id)
												}
												className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded transition">
												<Trash2 size={16} />
											</button>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default AdminBrands;
