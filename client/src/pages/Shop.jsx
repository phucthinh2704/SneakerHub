import { Check, DollarSign, Filter, Loader2, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGetBrands } from "../api/brand";
import { apiGetCategories, apiGetProducts } from "../api/product";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";

const PRICE_RANGES = [
	{ id: "all", label: "Tất cả", min: "", max: "" },
	{ id: "under_1m", label: "Dưới 1 triệu", min: "", max: 1000000 },
	{ id: "1m_2m", label: "1 triệu - 2 triệu", min: 1000000, max: 2000000 },
	{ id: "2m_5m", label: "2 triệu - 5 triệu", min: 2000000, max: 5000000 },
	{ id: "above_5m", label: "Trên 5 triệu", min: 5000000, max: "" },
];

const Shop = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);

	// Filter state giờ lưu SLUG
	const [filter, setFilter] = useState({
		category: searchParams.get("category") || "",
		brand: searchParams.get("brand")
			? searchParams.get("brand").split(",")
			: [],
		sort: searchParams.get("sort") || "newest",
		minPrice: searchParams.get("minPrice") || "",
		maxPrice: searchParams.get("maxPrice") || "",
	});

	const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
	const [totalPages, setTotalPages] = useState(0);

	const [priceRange, setPriceRange] = useState({
		min: searchParams.get("minPrice") || "",
		max: searchParams.get("maxPrice") || "",
	});

	// --- EFFECT: SYNC URL -> STATE ---
	useEffect(() => {
		const categoryParam = searchParams.get("category") || "";
		const brandParam = searchParams.get("brand");
		const brandArray = brandParam ? brandParam.split(",") : [];
		const sortParam = searchParams.get("sort") || "newest";
		const minParam = searchParams.get("minPrice") || "";
		const maxParam = searchParams.get("maxPrice") || "";
		const pageParam = Number(searchParams.get("page")) || 1;

		setFilter({
			category: categoryParam,
			brand: brandArray,
			sort: sortParam,
			minPrice: minParam,
			maxPrice: maxParam,
		});
		setPage(pageParam);
		setPriceRange({ min: minParam, max: maxParam });
	}, [searchParams]);

	// --- EFFECT: FETCH API ---
	useEffect(() => {
		fetchData();
		// eslint-disable-next-line
	}, [filter, page]);

	const fetchData = async () => {
		setLoading(true);
		if (page > 1) window.scrollTo({ top: 0, behavior: "smooth" });

		try {
			const params = {
				page: page,
				limit: 12,
				sort: filter.sort,
				// Backend giờ đã hỗ trợ nhận slug, nên cứ gửi filter.category (là slug) lên
				...(filter.category && { category: filter.category }),
				...(filter.brand.length > 0 && {
					brand: filter.brand.join(","),
				}),
				...(filter.minPrice && { minPrice: filter.minPrice }),
				...(filter.maxPrice && { maxPrice: filter.maxPrice }),
			};

			const [resProd, resCat, resBrand] = await Promise.all([
				apiGetProducts(params),
				apiGetCategories(),
				apiGetBrands(),
			]);

			if (resProd.success) {
				setProducts(resProd.result.products);
				setTotalPages(resProd.result.pages);
			}
			if (resCat.success) setCategories(resCat.result);
			if (resBrand.success) setBrands(resBrand.result);
		} catch (error) {
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	// --- HELPER: UPDATE URL ---
	const updateParams = (newFilters) => {
		const params = new URLSearchParams(searchParams);

		if (newFilters.category) params.set("category", newFilters.category);
		else params.delete("category");

		if (newFilters.brand && newFilters.brand.length > 0)
			params.set("brand", newFilters.brand.join(","));
		else params.delete("brand");

		if (newFilters.sort) params.set("sort", newFilters.sort);

		if (newFilters.minPrice) params.set("minPrice", newFilters.minPrice);
		else params.delete("minPrice");

		if (newFilters.maxPrice) params.set("maxPrice", newFilters.maxPrice);
		else params.delete("maxPrice");

		params.set("page", "1");
		setSearchParams(params);
	};

	// --- HANDLERS (SỬA ĐỂ DÙNG SLUG) ---

	// Nhận vào slug thay vì ID
	const handleCategoryChange = (catSlug) => {
		const newCat = filter.category === catSlug ? "" : catSlug;
		updateParams({ ...filter, category: newCat });
	};

	// Nhận vào slug thay vì ID
	const handleBrandToggle = (brandSlug) => {
		const isSelected = filter.brand.includes(brandSlug);
		const newBrands = isSelected
			? filter.brand.filter((s) => s !== brandSlug)
			: [...filter.brand, brandSlug];
		updateParams({ ...filter, brand: newBrands });
	};

	const handlePresetPrice = (min, max) => {
		updateParams({ ...filter, minPrice: min, maxPrice: max });
	};

	const handlePageChange = (newPage) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", newPage);
		setSearchParams(params);
	};

	const handleSortChange = (e) => {
		updateParams({ ...filter, sort: e.target.value });
	};

	const handleResetFilter = () => {
		setSearchParams({});
	};

	// Debounce Price
	useEffect(() => {
		const timer = setTimeout(() => {
			if (
				String(priceRange.min) !== String(filter.minPrice) ||
				String(priceRange.max) !== String(filter.maxPrice)
			) {
				updateParams({
					...filter,
					minPrice: priceRange.min,
					maxPrice: priceRange.max,
				});
			}
		}, 500);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [priceRange]);

	const handleManualPriceChange = (e) => {
		const { name, value } = e.target;
		setPriceRange((prev) => ({ ...prev, [name]: value }));
	};

	const isRangeActive = (min, max) =>
		String(filter.minPrice) === String(min) &&
		String(filter.maxPrice) === String(max);

	return (
		<div className="bg-gray-50 min-h-screen font-sans">
			<div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
				{/* SIDEBAR */}
				<aside className="w-full md:w-1/4 space-y-6">
					<div className="bg-white p-5 rounded-lg shadow-sm sticky top-24">
						{/* ... Header Sidebar ... */}
						<div className="flex items-center justify-between mb-4 md:hidden">
							<span className="font-bold text-gray-900">
								Bộ lọc
							</span>
							<button
								onClick={handleResetFilter}
								className="text-sm text-red-500">
								Đặt lại
							</button>
						</div>

						{/* DANH MỤC */}
						<div className="border-b pb-6 mb-6">
							<h3 className="font-bold mb-4 flex items-center text-lg text-gray-800">
								<Filter
									size={20}
									className="mr-2 text-orange-600"
								/>{" "}
								Danh mục
							</h3>
							<ul className="space-y-2 text-sm text-gray-600">
								<li
									className={`cursor-pointer transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600 ${
										filter.category === ""
											? "font-bold text-orange-600 bg-orange-50"
											: ""
									}`}
									onClick={() => handleCategoryChange("")}>
									Tất cả sản phẩm
								</li>
								{categories.map((cat) => (
									<li
										key={cat._id}
										className={`cursor-pointer transition px-2 py-1 rounded hover:bg-orange-50 hover:text-orange-600 ${
											filter.category === cat.slug // <--- SO SÁNH SLUG
												? "font-bold text-orange-600 bg-orange-50"
												: ""
										}`}
										onClick={() =>
											handleCategoryChange(cat.slug)
										} // <--- TRUYỀN SLUG
									>
										{cat.name}
									</li>
								))}
							</ul>
						</div>

						{/* THƯƠNG HIỆU */}
						<div className="border-b pb-6 mb-6">
							<h3 className="font-bold mb-4 flex items-center text-lg text-gray-800">
								<Tag
									size={20}
									className="mr-2 text-orange-600"
								/>{" "}
								Thương hiệu
							</h3>
							<div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
								{brands.map((brand) => {
									const isChecked = filter.brand.includes(
										brand.slug,
									); // <--- SO SÁNH SLUG
									return (
										<label
											key={brand._id}
											className="flex items-center space-x-3 cursor-pointer group select-none hover:bg-gray-50 p-1 rounded">
											<div
												className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isChecked ? "bg-orange-600 border-orange-600" : "border-gray-300 bg-white"}`}>
												<input
													type="checkbox"
													className="hidden"
													checked={isChecked}
													onChange={() =>
														handleBrandToggle(
															brand.slug,
														)
													}
												/>{" "}
												{/* <--- TRUYỀN SLUG */}
												{isChecked && (
													<Check
														size={14}
														className="text-white"
													/>
												)}
											</div>
											<span
												className={`text-sm ${isChecked ? "font-bold text-gray-900" : "text-gray-600"}`}>
												{brand.name}
											</span>
										</label>
									);
								})}
							</div>
						</div>

						{/* ... CÁC PHẦN GIÁ VÀ SẮP XẾP GIỮ NGUYÊN ... */}
						<div className="border-b pb-6 mb-6">
							<h3 className="font-bold mb-4 text-lg text-gray-800 flex items-center">
								<DollarSign
									size={20}
									className="mr-2 text-orange-600"
								/>{" "}
								Khoảng giá
							</h3>
							<div className="space-y-2 mb-4">
								{PRICE_RANGES.map((range) => (
									<label
										key={range.id}
										className="flex items-center space-x-3 cursor-pointer group hover:bg-gray-50 p-1 rounded">
										<div
											className={`w-4 h-4 rounded-full border flex items-center justify-center ${isRangeActive(range.min, range.max) ? "border-orange-600" : "border-gray-300"}`}>
											<input
												type="radio"
												name="preset"
												className="hidden"
												checked={isRangeActive(
													range.min,
													range.max,
												)}
												onChange={() =>
													handlePresetPrice(
														range.min,
														range.max,
													)
												}
											/>
											{isRangeActive(
												range.min,
												range.max,
											) && (
												<div className="w-2 h-2 bg-orange-600 rounded-full"></div>
											)}
										</div>
										<span
											className={`text-sm ${isRangeActive(range.min, range.max) ? "font-bold text-orange-600" : "text-gray-600"}`}>
											{range.label}
										</span>
									</label>
								))}
							</div>
							<div className="pt-3 border-t border-dashed flex items-center space-x-2">
								<input
									name="min"
									type="number"
									value={priceRange.min}
									onChange={handleManualPriceChange}
									placeholder="Từ"
									className="w-full border rounded px-3 py-2 text-sm outline-none"
								/>
								<span>-</span>
								<input
									name="max"
									type="number"
									value={priceRange.max}
									onChange={handleManualPriceChange}
									placeholder="Đến"
									className="w-full border rounded px-3 py-2 text-sm outline-none"
								/>
							</div>
						</div>

						<div className="mb-6">
							<h3 className="font-bold mb-4 text-lg text-gray-800">
								Sắp xếp
							</h3>
							<select
								className="w-full border rounded px-3 py-2 text-sm outline-none bg-white cursor-pointer"
								onChange={handleSortChange}
								value={filter.sort}>
								<option value="newest">Mới nhất</option>
								<option value="price_asc">
									Giá: Thấp đến Cao
								</option>
								<option value="price_desc">
									Giá: Cao đến Thấp
								</option>
								<option value="rating">Đánh giá cao</option>
							</select>
						</div>

						<button
							onClick={handleResetFilter}
							className="w-full py-2.5 flex items-center justify-center border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-100 transition">
							<X
								size={16}
								className="mr-2"
							/>{" "}
							Xóa tất cả bộ lọc
						</button>
					</div>
				</aside>

				{/* MAIN CONTENT */}
				<main className="flex-1">
					{loading ? (
						<div className="flex flex-col justify-center items-center h-96">
							<Loader2 className="animate-spin text-orange-600 w-10 h-10 mb-4" />
							<p>Đang tải sản phẩm...</p>
						</div>
					) : (
						<>
							{/* TAGS ĐANG LỌC */}
							{(filter.category ||
								filter.brand.length > 0 ||
								filter.minPrice ||
								filter.maxPrice) && (
								<div className="mb-6 flex flex-wrap items-center gap-2">
									<span className="text-sm text-gray-500 mr-2">
										Đang lọc:
									</span>

									{/* Tag Category (Dùng Slug để tìm) */}
									{/* TÌM DÒNG NÀY */}
									{filter.category && (
										<span className="px-3 py-1 bg-white border border-orange-200 rounded-full text-xs font-medium text-orange-700 flex items-center shadow-sm">
											{/* SỬA LẠI ĐIỀU KIỆN SO SÁNH TRONG FIND (.slug hoặc ._id tùy thuộc vào URL bạn đang dùng) */}
											{categories.find(
												(c) =>
													c._id === filter.category,
											)?.name ||
												categories.find(
													(c) =>
														c.slug ===
														filter.category,
												)?.name ||
												"Danh mục"}
											<button
												onClick={() =>
													handleCategoryChange(
														filter.category,
													)
												}
												className="ml-2 hover:text-red-500">
												<X size={12} />
											</button>
										</span>
									)}

									{/* Tag Brand (Dùng Slug để tìm) */}
									{filter.brand.map((bSlug) => (
										<span
											key={bSlug}
											className="px-3 py-1 bg-white border border-orange-200 rounded-full text-xs font-medium text-orange-700 flex items-center shadow-sm">
											{brands.find(
												(b) => b.slug === bSlug,
											)?.name || "Brand"}
											<button
												onClick={() =>
													handleBrandToggle(bSlug)
												}
												className="ml-2 hover:text-red-500">
												<X size={12} />
											</button>
										</span>
									))}

									{/* ... GIÁ & RESET GIỮ NGUYÊN ... */}
									{(filter.minPrice || filter.maxPrice) && (
										<span className="px-3 py-1 bg-white border border-orange-200 rounded-full text-xs font-medium text-orange-700 flex items-center shadow-sm">
											{filter.minPrice
												? new Intl.NumberFormat().format(
														filter.minPrice,
													)
												: "0"}{" "}
											-{" "}
											{filter.maxPrice
												? new Intl.NumberFormat().format(
														filter.maxPrice,
													)
												: "∞"}
											<button
												onClick={() =>
													handlePresetPrice("", "")
												}
												className="ml-2 hover:text-red-500">
												<X size={12} />
											</button>
										</span>
									)}
									<button
										onClick={handleResetFilter}
										className="text-xs text-gray-500 hover:text-red-500 hover:underline ml-2">
										Xóa hết
									</button>
								</div>
							)}

							{/* ... LIST SẢN PHẨM & PHÂN TRANG GIỮ NGUYÊN ... */}
							{products.length > 0 ? (
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
									{products.map((p) => (
										<ProductCard
											key={p._id}
											product={p}
										/>
									))}
								</div>
							) : (
								<div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg shadow-sm border border-gray-100 text-center">
									<div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
										<Filter
											className="text-gray-400"
											size={30}
										/>
									</div>
									<h3 className="text-lg font-bold text-gray-900">
										Không tìm thấy sản phẩm
									</h3>
									<button
										onClick={handleResetFilter}
										className="mt-6 text-orange-600 font-bold hover:underline">
										Xóa bộ lọc
									</button>
								</div>
							)}

							{products.length > 0 && (
								<Pagination
									currentPage={page}
									totalPages={totalPages}
									onPageChange={handlePageChange}
								/>
							)}
						</>
					)}
				</main>
			</div>
		</div>
	);
};

export default Shop;
