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
	apiCreateCategory,
	apiDeleteCategory,
	apiGetAllCategoriesAdmin,
	apiUpdateCategory,
	apiUploadImage,
} from "../../api/admin";
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

	// --- THÊM 2 STATE MỚI ĐỂ QUẢN LÝ ẢNH LOCAL ---
	const [imageFile, setImageFile] = useState(null); // Lưu file thật để lúc Submit mới up
	const [imagePreview, setImagePreview] = useState(""); // Lưu link ảo (blob) để hiển thị preview

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

	// --- SỬA HÀM NÀY: CHỈ TẠO PREVIEW, KHÔNG UP LÊN SERVER NGAY ---
	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		if (!file.type.startsWith("image/")) {
			return toast.error("Vui lòng chọn file hình ảnh!");
		}

		setImageFile(file); // Lưu file lại chờ submit
		setImagePreview(URL.createObjectURL(file)); // Tạo link ảo hiển thị luôn cho lẹ
	};

	const triggerEdit = (cat) => {
		setEditId(cat._id);
		setFormData({
			name: cat.name,
			description: cat.description || "",
			image: cat.image || "",
		});
		// Nếu có ảnh cũ trên DB thì gán vào preview, reset file chờ up
		setImagePreview(cat.image || "");
		setImageFile(null);
	};

	const cancelEdit = () => {
		setEditId(null);
		setFormData({ name: "", description: "", image: "" });
		setImagePreview("");
		setImageFile(null);
	};

	// --- SỬA HÀM SUBMIT: KẾT HỢP UPLOAD ẢNH RỒI MỚI LƯU DB ---
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.name.trim())
			return toast.error("Tên danh mục là bắt buộc");

		setFormLoading(true);
		try {
			let finalImageUrl = formData.image; // Mặc định là link ảnh cũ (nếu đang Edit)

			// Nếu người dùng có chọn ảnh MỚI từ máy tính -> Bắt đầu up lên Cloudinary
			if (imageFile) {
				const uploadData = new FormData();
				uploadData.append("image", imageFile);

				// Gọi API up ảnh
				const uploadRes = await apiUploadImage(uploadData);
				if (uploadRes.success) {
					finalImageUrl = uploadRes.url; // Lấy link thật từ Cloudinary
				}
			}

			// Tạo payload chuẩn bị gửi xuống DB
			const payload = { ...formData, image: finalImageUrl };

			if (editId) {
				// Cập nhật Danh mục
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
				// Thêm mới Danh mục
				const res = await apiCreateCategory(payload);
				if (res.success) {
					toast.success("Thêm mới thành công");
					setCategories([res.result, ...categories]);
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
			title: "Xóa danh mục/thương hiệu?",
			text: "Cảnh báo: Các sản phẩm thuộc danh mục/thương hiệu này có thể bị mất liên kết. Bạn có chắc chắn tiếp tục?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Vẫn xóa",
			cancelButtonText: "Quay lại",
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
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
			{/* FORM THÊM / SỬA */}
			<div className="lg:col-span-1">
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
					<h2 className="text-lg font-bold text-gray-800 mb-4 border-b pb-3">
						{editId ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
					</h2>
					<form
						onSubmit={handleSubmit}
						className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
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

						{/* Upload Ảnh Local */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Ảnh đại diện
							</label>
							<div className="flex items-center space-x-4">
								<div className="w-16 h-16 border rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
									{/* Hiển thị imagePreview thay vì formData.image */}
									{imagePreview ? (
										<img
											src={imagePreview}
											alt="preview"
											className="w-full h-full object-cover"
										/>
									) : (
										<ImageIcon className="text-gray-300" />
									)}
								</div>
								<div className="flex-1">
									{/* Hàm onChange giờ dùng handleImageSelect */}
									<input
										type="file"
										id="cat-image"
										accept="image/*"
										onChange={handleImageSelect}
										className="hidden"
									/>
									<label
										htmlFor="cat-image"
										className="cursor-pointer inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 transition">
										<UploadCloud
											size={16}
											className="mr-2"
										/>{" "}
										Chọn ảnh
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

			{/* DANH SÁCH (Giữ nguyên không thay đổi) */}
			<div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
				<div className="p-6 border-b border-gray-100">
					<h2 className="text-lg font-bold text-gray-800">
						Danh sách ({categories.length})
					</h2>
				</div>
				<div className="overflow-x-auto">
					<table className="w-full text-left text-sm whitespace-nowrap">
						<thead className="bg-gray-50 text-gray-600 font-medium">
							<tr>
								<th className="px-6 py-4">Hình ảnh</th>
								<th className="px-6 py-4">Tên Danh Mục</th>
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
								categories.map((cat) => (
									<tr
										key={cat._id}
										className="hover:bg-gray-50">
										<td className="px-6 py-3">
											<img
												src={
													cat.image ||
													"https://placehold.co/100x100?text=No+Image"
												}
												alt="cat"
												className="w-10 h-10 rounded-md object-cover border"
											/>
										</td>
										<td className="px-6 py-3 font-bold text-gray-900">
											{cat.name}
										</td>
										<td className="px-6 py-3 text-gray-500 font-mono text-xs">
											{cat.slug}
										</td>
										<td className="px-6 py-3 text-center space-x-2">
											<button
												onClick={() => triggerEdit(cat)}
												className="text-blue-600 hover:text-blue-800 p-1.5 bg-blue-50 rounded">
												<Edit size={16} />
											</button>
											<button
												onClick={() =>
													handleDelete(cat._id)
												}
												className="text-red-600 hover:text-red-800 p-1.5 bg-red-50 rounded">
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

export default AdminCategories;
