import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	apiGetAdminProducts,
	apiDeleteProduct,
	apiUpdateProduct,
	apiGetAllCategoriesAdmin,
	apiGetAllBrandsAdmin,
} from "../../api/admin"; // Đổi import API
import Pagination from "../../components/Pagination";
import {
	Loader2,
	Plus,
	Edit,
	Trash2,
	Search,
	Filter,
	Eye,
	EyeOff,
} from "lucide-react"; // Thêm Eye, EyeOff
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AdminProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);

	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [filterCat, setFilterCat] = useState("");
	const [filterBrand, setFilterBrand] = useState("");

	useEffect(() => {
		Promise.all([apiGetAllCategoriesAdmin(), apiGetAllBrandsAdmin()]).then(
			([catRes, brandRes]) => {
				if (catRes.success) setCategories(catRes.result);
				if (brandRes.success) setBrands(brandRes.result);
			},
		);
	}, []);

	useEffect(() => {
		const timer = setTimeout(() => fetchProducts(), 500);
		return () => clearTimeout(timer);
		// eslint-disable-next-line
	}, [page, searchTerm, filterCat, filterBrand]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			const params = {
				page,
				limit: 8,
				keyword: searchTerm,
				...(filterCat && { category: filterCat }),
				...(filterBrand && { brand: filterBrand }),
			};
			// GỌI API ADMIN ĐỂ LẤY CẢ SẢN PHẨM ẨN
			const res = await apiGetAdminProducts(params);
			if (res.success) {
				setProducts(res.result.products);
				setTotalPages(res.result.pages);
			}
		} catch (error) {
			console.log(error);
			toast.error("Lỗi lấy danh sách sản phẩm");
		} finally {
			setLoading(false);
		}
	};

	// --- TÍNH NĂNG MỚI: ẨN/HIỆN NHANH SẢN PHẨM ---
	const handleTogglePublish = async (product) => {
		try {
			// Gọi API update chỉ với trường isPublished
			const res = await apiUpdateProduct(product._id, {
				isPublished: !product.isPublished,
			});
			if (res.success) {
				toast.success(
					product.isPublished
						? "Đã ẩn sản phẩm"
						: "Đã hiển thị sản phẩm",
				);
				// Cập nhật lại UI
				setProducts(
					products.map((p) =>
						p._id === product._id
							? { ...p, isPublished: !p.isPublished }
							: p,
					),
				);
			}
		} catch (error) {
			console.log(error);
			toast.error("Lỗi cập nhật trạng thái");
		}
	};

	const handleDelete = async (id) => {
		const result = await Swal.fire({
			title: "Xóa sản phẩm?",
			text: "Sản phẩm này sẽ bị xóa vĩnh viễn khỏi hệ thống!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Xóa vĩnh viễn",
			cancelButtonText: "Hủy bỏ",
		});

		if (result.isConfirmed) {
			try {
				const res = await apiDeleteProduct(id);
				if (res.success) {
					toast.success("Xóa thành công");
					setProducts(products.filter((p) => p._id !== id));
					if (products.length === 1 && page > 1) setPage(page - 1);
				}
			} catch (error) {
				console.log(error);
				toast.error("Xóa thất bại");
			}
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			{/* TOOLBAR */}
			<div className="p-5 border-b border-gray-100 space-y-4">
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<h2 className="text-xl font-bold text-gray-800">
						Quản lý Sản phẩm
					</h2>
					<Link
						to="/admin/products/new"
						className="bg-gray-900 text-white w-full md:w-auto px-4 py-2 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition">
						<Plus
							size={20}
							className="mr-2"
						/>{" "}
						Thêm Sản Phẩm
					</Link>
				</div>

				<div className="flex flex-col md:flex-row gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
					<div className="relative flex-1">
						<Search
							className="absolute left-3 top-2.5 text-gray-400"
							size={18}
						/>
						<input
							type="text"
							placeholder="Tìm tên sản phẩm..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setPage(1);
							}}
							className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:ring-2 focus:ring-orange-500 outline-none"
						/>
					</div>

					<div className="flex flex-1 gap-3">
						<div className="relative flex-1">
							<Filter
								className="absolute left-3 top-2.5 text-gray-400"
								size={16}
							/>
							<select
								value={filterCat}
								onChange={(e) => {
									setFilterCat(e.target.value);
									setPage(1);
								}}
								className="w-full pl-9 pr-2 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
								<option value="">Tất cả danh mục</option>

								{/* Lọc ra các danh mục CHA (không có parentId) */}
								{categories
									.filter((c) => !c.parentId)
									.map((parent) => (
										<React.Fragment key={parent._id}>
											{/* Render Danh mục Cha */}
											<option
												value={parent._id}
												className="font-bold text-gray-900">
												{parent.name}
											</option>

											{/* Lọc và Render các Danh mục Con tương ứng với Cha này */}
											{categories
												.filter(
													(child) =>
														child.parentId ===
														parent._id,
												)
												.map((child) => (
													<option
														key={child._id}
														value={child._id}
														className="text-gray-600">
														&nbsp;&nbsp;&nbsp;--{" "}
														{child.name}
													</option>
												))}
										</React.Fragment>
									))}
							</select>
						</div>
						<div className="relative flex-1">
							<Filter
								className="absolute left-3 top-2.5 text-gray-400"
								size={16}
							/>
							<select
								value={filterBrand}
								onChange={(e) => {
									setFilterBrand(e.target.value);
									setPage(1);
								}}
								className="w-full pl-9 pr-2 py-2 text-sm border rounded-md outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white">
								<option value="">Tất cả thương hiệu</option>
								{brands.map((b) => (
									<option
										key={b._id}
										value={b._id}>
										{b.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>

			{/* BẢNG DỮ LIỆU */}
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm whitespace-nowrap">
					<thead className="bg-gray-50 text-gray-600 font-medium border-b">
						<tr>
							<th className="px-6 py-4">Sản Phẩm</th>
							<th className="px-6 py-4">Danh Mục / Hãng</th>
							<th className="px-6 py-4">Giá Bán</th>
							<th className="px-6 py-4 text-center">
								Trạng Thái
							</th>
							<th className="px-6 py-4 text-center">Hành Động</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{loading ? (
							<tr>
								<td
									colSpan="5"
									className="text-center py-10">
									<Loader2 className="animate-spin inline text-orange-600" />
								</td>
							</tr>
						) : (
							products.map((product) => (
								<tr
									key={product._id}
									className={`transition ${!product.isPublished ? "bg-gray-50/50 grayscale-20" : "hover:bg-gray-50"}`}>
									<td className="px-6 py-4 flex items-center space-x-4">
										<img
											src={
												product.variants?.[0]
													?.images[0] ||
												"https://placehold.co/100x100?text=No+Image"
											}
											alt="img"
											className="w-12 h-12 rounded object-cover border"
										/>
										<div>
											<p
												className={`font-bold w-48 md:w-56 truncate ${!product.isPublished ? "text-gray-500 line-through" : "text-gray-900"}`}
												title={product.name}>
												{product.name}
											</p>
											<p className="text-xs text-gray-500 mt-1">
												{product.variants?.length || 0}{" "}
												Phiên bản màu
											</p>
										</div>
									</td>
									<td className="px-6 py-4">
										<p className="text-gray-900 font-medium">
											{product.category?.name || "N/A"}
										</p>
										<p className="text-xs text-gray-500 mt-1">
											{product.brand?.name || "N/A"}
										</p>
									</td>
									<td className="px-6 py-4 font-bold text-orange-600">
										{new Intl.NumberFormat("vi-VN", {
											style: "currency",
											currency: "VND",
										}).format(product.price)}
									</td>

									{/* HIỂN THỊ TRẠNG THÁI */}
									<td className="px-6 py-4 text-center">
										<span
											className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${product.isPublished ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
											{product.isPublished
												? "Đang hiện"
												: "Đã ẩn"}
										</span>
									</td>

									<td className="px-6 py-4 text-center space-x-2 flex items-center justify-center">
										{/* Nút Ẩn/Hiện Nhanh */}
										<button
											onClick={() =>
												handleTogglePublish(product)
											}
											title={
												product.isPublished
													? "Nhấn để ẩn sản phẩm"
													: "Nhấn để hiển thị lại"
											}
											className={`p-2 rounded transition ${product.isPublished ? "text-gray-600 hover:text-orange-600 bg-gray-100 hover:bg-orange-50" : "text-green-600 bg-green-50 hover:bg-green-100"}`}>
											{product.isPublished ? (
												<EyeOff size={16} />
											) : (
												<Eye size={16} />
											)}
										</button>

										<Link
											to={`/admin/products/edit/${product.slug}`}
											className="text-blue-600 hover:text-blue-800 transition p-2 bg-blue-50 rounded inline-block">
											<Edit size={16} />
										</Link>
										<button
											onClick={() =>
												handleDelete(product._id)
											}
											className="text-red-600 hover:text-red-800 transition p-2 bg-red-50 rounded inline-block">
											<Trash2 size={16} />
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
				{products.length === 0 && !loading && (
					<div className="text-center py-10 text-gray-500">
						Không tìm thấy sản phẩm.
					</div>
				)}
			</div>

			<div className="p-4 border-t border-gray-100">
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>
		</div>
	);
};

export default AdminProducts;
