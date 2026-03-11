import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
	apiGetAdminProducts,
	apiDeleteProduct,
	apiUpdateProduct,
	apiGetAllCategoriesAdmin,
	apiGetAllBrandsAdmin,
} from "../../api/admin";
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
	ChevronDown,
	Package,
} from "lucide-react";
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

	const handleTogglePublish = async (product) => {
		try {
			const res = await apiUpdateProduct(product._id, {
				isPublished: !product.isPublished,
			});
			if (res.success) {
				toast.success(
					product.isPublished
						? "Đã ẩn sản phẩm"
						: "Đã hiển thị sản phẩm",
				);
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

	const handleDelete = async (id, name) => {
		const result = await Swal.fire({
			title: `<span style="font-family:'Syne',sans-serif;font-size:1.05rem">Xóa sản phẩm?</span>`,
			html: `<span style="font-family:'DM Sans',sans-serif;font-size:.88rem;color:#6a5a4a"><b>${name}</b> sẽ bị xóa vĩnh viễn khỏi hệ thống!</span>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Xóa vĩnh viễn",
			cancelButtonText: "Hủy bỏ",
			customClass: {
				popup: "rounded-2xl",
				confirmButton: "rounded-xl font-bold",
				cancelButton: "rounded-xl font-bold",
			},
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

	const fmt = (n) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(n);

	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.adm-root { font-family:'DM Sans',sans-serif; }
				.adm-heading { font-family:'Syne',sans-serif; }
				.adm-row { transition: background .15s; }
				.adm-row:hover td { background: #fdf9f6; }
				.adm-fade { animation: admFadeUp .35s ease both; }
				@keyframes admFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
			`}</style>

			<div className="adm-root adm-fade">
				{/* ── Header ── */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
					<div>
						<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-0.5">
							SoleStore Admin
						</p>
						<h2 className="adm-heading text-[#1a1914] text-2xl font-bold">
							Quản lý Sản phẩm
						</h2>
					</div>
					<Link
						to="/admin/products/new"
						className="inline-flex items-center gap-2 bg-[#c2784d] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-[#a05e38] transition"
						style={{
							boxShadow: "0 4px 14px rgba(194,120,77,.35)",
						}}>
						<Plus size={16} /> Thêm sản phẩm
					</Link>
				</div>

				<div
					className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
					style={{ boxShadow: "0 2px 20px rgba(194,120,77,.07)" }}>
					{/* ── Filters ── */}
					<div className="px-6 py-4 border-b border-[#f5ede4] flex flex-col md:flex-row gap-3">
						{/* Search */}
						<div className="relative flex-1">
							<Search
								className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c0a890]"
								size={15}
							/>
							<input
								type="text"
								placeholder="Tìm tên sản phẩm..."
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setPage(1);
								}}
								className="w-full pl-10 pr-4 py-2.5 bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl text-sm placeholder-[#c0a890] text-[#3a2818] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15 transition"
							/>
						</div>
						{/* Category filter */}
						<div className="relative">
							<Filter
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c0a890]"
								size={13}
							/>
							<select
								value={filterCat}
								onChange={(e) => {
									setFilterCat(e.target.value);
									setPage(1);
								}}
								className="appearance-none bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl pl-9 pr-8 py-2.5 text-sm text-[#3a2818] outline-none focus:border-[#c2784d] transition cursor-pointer">
								<option value="">Tất cả danh mục</option>
								{categories
									.filter((c) => !c.parentId)
									.map((parent) => (
										<React.Fragment key={parent._id}>
											<option
												value={parent._id}
												className="font-bold">
												{parent.name}
											</option>
											{categories
												.filter(
													(child) =>
														child.parentId ===
														parent._id,
												)
												.map((child) => (
													<option
														key={child._id}
														value={child._id}>
														&nbsp;&nbsp;—{" "}
														{child.name}
													</option>
												))}
										</React.Fragment>
									))}
							</select>
							<ChevronDown
								size={12}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08070] pointer-events-none"
							/>
						</div>
						{/* Brand filter */}
						<div className="relative">
							<Filter
								className="absolute left-3 top-1/2 -translate-y-1/2 text-[#c0a890]"
								size={13}
							/>
							<select
								value={filterBrand}
								onChange={(e) => {
									setFilterBrand(e.target.value);
									setPage(1);
								}}
								className="appearance-none bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl pl-9 pr-8 py-2.5 text-sm text-[#3a2818] outline-none focus:border-[#c2784d] transition cursor-pointer">
								<option value="">Tất cả thương hiệu</option>
								{brands.map((b) => (
									<option
										key={b._id}
										value={b._id}>
										{b.name}
									</option>
								))}
							</select>
							<ChevronDown
								size={12}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08070] pointer-events-none"
							/>
						</div>
					</div>

					{/* ── Table ── */}
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-[#fdf8f4] border-b border-[#f5ede4]">
									{[
										{ label: "Sản phẩm", align: "left" },
										{
											label: "Danh mục / Hãng",
											align: "left",
										},
										{ label: "Giá bán", align: "left" },
										{
											label: "Trạng thái",
											align: "center",
										},
										{ label: "Hành động", align: "center" },
									].map(({ label, align }) => (
										<th
											key={label}
											className={`px-5 py-3.5 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] text-${align}`}>
											{label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan="5"
											className="text-center py-16">
											<Loader2
												className="animate-spin inline text-[#c2784d]"
												size={28}
											/>
										</td>
									</tr>
								) : (
									products.map((product) => (
										<tr
											key={product._id}
											className={`adm-row border-b border-[#f8f0e8] last:border-0 ${!product.isPublished ? "opacity-60" : ""}`}>
											{/* Product */}
											<td className="px-5 py-3.5">
												<div className="flex items-center gap-3">
													<div className="w-12 h-12 rounded-xl overflow-hidden border border-[#f0ddd0] bg-[#fdf8f4] shrink-0">
														<img
															src={
																product
																	.variants?.[0]
																	?.images[0] ||
																"https://placehold.co/100x100?text=—"
															}
															alt="img"
															className="w-full h-full object-cover"
														/>
													</div>
													<div>
														<p
															className={`font-semibold w-44 truncate text-sm ${!product.isPublished ? "text-[#9a8878] line-through" : "text-[#1a1914]"}`}
															title={
																product.name
															}>
															{product.name}
														</p>
														<p className="text-[11px] text-[#b0a090] mt-0.5">
															{product.variants
																?.length ||
																0}{" "}
															màu sắc
														</p>
													</div>
												</div>
											</td>
											{/* Category / Brand */}
											<td className="px-5 py-3.5">
												<p className="text-[#3a2818] font-medium text-sm">
													{product.category?.name ||
														"N/A"}
												</p>
												<p className="text-[11px] text-[#a08070] mt-0.5">
													{product.brand?.name ||
														"N/A"}
												</p>
											</td>
											{/* Price */}
											<td className="px-5 py-3.5">
												<span
													className="font-bold text-[#c2784d]"
													style={{
														fontFamily:
															"'Syne',sans-serif",
													}}>
													{fmt(product.price)}
												</span>
											</td>
											{/* Status */}
											<td className="px-5 py-3.5 text-center">
												<span
													className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
														product.isPublished
															? "bg-green-50 text-green-700 border-green-200"
															: "bg-[#f5f5f5] text-[#9a8878] border-[#e0d8d0]"
													}`}>
													<span
														className={`w-1.5 h-1.5 rounded-full ${product.isPublished ? "bg-green-500" : "bg-[#c0b0a0]"}`}
													/>
													{product.isPublished
														? "Đang hiện"
														: "Đã ẩn"}
												</span>
											</td>
											{/* Actions */}
											<td className="px-5 py-3.5">
												<div className="flex items-center justify-center gap-1.5">
													<button
														onClick={() =>
															handleTogglePublish(
																product,
															)
														}
														title={
															product.isPublished
																? "Ẩn sản phẩm"
																: "Hiện lại"
														}
														className={`p-2 rounded-lg transition text-sm font-medium ${
															product.isPublished
																? "bg-[#f5ede4] text-[#a08070] hover:bg-[#ffe0c8] hover:text-[#c2784d]"
																: "bg-green-50 text-green-600 hover:bg-green-100"
														}`}>
														{product.isPublished ? (
															<EyeOff size={14} />
														) : (
															<Eye size={14} />
														)}
													</button>
													<Link
														to={`/admin/products/edit/${product.slug}`}
														className="p-2 rounded-lg bg-[#eff4ff] text-[#5b8dee] hover:bg-[#dde8ff] transition">
														<Edit size={14} />
													</Link>
													<button
														onClick={() =>
															handleDelete(
																product._id,
																product.name,
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
						{products.length === 0 && !loading && (
							<div className="text-center py-14">
								<Package
									size={28}
									className="text-[#e0d0c0] mx-auto mb-3"
								/>
								<p className="text-[#b0a090] text-sm">
									Không tìm thấy sản phẩm nào.
								</p>
							</div>
						)}
					</div>

					{/* ── Pagination ── */}
					<div className="px-5 py-4 border-t border-[#f5ede4]">
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminProducts;
