import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiGetBrands } from "../api/brand";
import { apiGetCategories, apiGetProducts } from "../api/product";
import Pagination from "../components/Pagination";
import ProductCard from "../components/ProductCard";

// ─── Icons (inline SVG để không cần thêm dependency) ─────────────────────────
const IconFilter = () => (
	<svg
		width="16"
		height="16"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round">
		<line
			x1="4"
			y1="6"
			x2="20"
			y2="6"
		/>
		<line
			x1="8"
			y1="12"
			x2="16"
			y2="12"
		/>
		<line
			x1="11"
			y1="18"
			x2="13"
			y2="18"
		/>
	</svg>
);
const IconX = ({ size = 14 }) => (
	<svg
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2.5"
		strokeLinecap="round">
		<line
			x1="18"
			y1="6"
			x2="6"
			y2="18"
		/>
		<line
			x1="6"
			y1="6"
			x2="18"
			y2="18"
		/>
	</svg>
);
const IconCheck = () => (
	<svg
		width="11"
		height="11"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="3"
		strokeLinecap="round"
		strokeLinejoin="round">
		<polyline points="20 6 9 17 4 12" />
	</svg>
);
const IconSpinner = () => (
	<svg
		className="animate-spin"
		width="36"
		height="36"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		strokeWidth="2">
		<circle
			cx="12"
			cy="12"
			r="10"
			strokeOpacity="0.2"
		/>
		<path
			d="M12 2a10 10 0 0 1 10 10"
			stroke="#c2784d"
		/>
	</svg>
);
const IconShoe = () => (
	<svg
		width="40"
		height="40"
		viewBox="0 0 24 24"
		fill="none"
		stroke="#6b6b5e"
		strokeWidth="1.2"
		strokeLinecap="round"
		strokeLinejoin="round">
		<path d="M3 14c0 2 1 3 3 3h12c1.5 0 3-1 3-3v-1H3v1z" />
		<path d="M3 13L6 7l3 2 3-3 3 3 3-2 1 4.5" />
	</svg>
);

// ─── Price Ranges ─────────────────────────────────────────────────────────────
const PRICE_RANGES = [
	{ id: "all", label: "Tất cả", min: "", max: "" },
	{ id: "under_1m", label: "Dưới 1 triệu", min: "", max: 1000000 },
	{ id: "1m_2m", label: "1 – 2 triệu", min: 1000000, max: 2000000 },
	{ id: "2m_5m", label: "2 – 5 triệu", min: 2000000, max: 5000000 },
	{ id: "above_5m", label: "Trên 5 triệu", min: 5000000, max: "" },
];

// ─── Reusable Section Header ──────────────────────────────────────────────────
const SectionLabel = ({ children }) => (
	<p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#c2784d] mb-3">
		{children}
	</p>
);

// ═════════════════════════════════════════════════════════════════════════════
const Shop = () => {
	const [searchParams, setSearchParams] = useSearchParams();

	const [products, setProducts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [brands, setBrands] = useState([]);
	const [loading, setLoading] = useState(true);

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
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// ── Sync from URL ─────────────────────────────────────────────────────────
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

	useEffect(() => {
		fetchData();
	}, [filter, page]); // eslint-disable-line

	// ── Fetch ─────────────────────────────────────────────────────────────────
	const fetchData = async () => {
		setLoading(true);
		if (page > 1) window.scrollTo({ top: 0, behavior: "smooth" });
		try {
			const params = {
				page,
				limit: 9,
				sort: filter.sort,
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
		} catch (e) {
			console.error(e);
		} finally {
			setLoading(false);
		}
	};

	// ── URL helpers ───────────────────────────────────────────────────────────
	const updateParams = (nf) => {
		const p = new URLSearchParams(searchParams);
		nf.category ? p.set("category", nf.category) : p.delete("category");
		nf.brand?.length > 0
			? p.set("brand", nf.brand.join(","))
			: p.delete("brand");
		if (nf.sort) p.set("sort", nf.sort);
		nf.minPrice ? p.set("minPrice", nf.minPrice) : p.delete("minPrice");
		nf.maxPrice ? p.set("maxPrice", nf.maxPrice) : p.delete("maxPrice");
		p.set("page", "1");
		setSearchParams(p);
	};

	const handleCategoryChange = (slug) =>
		updateParams({
			...filter,
			category: filter.category === slug ? "" : slug,
		});
	const handleBrandToggle = (slug) => {
		const isSel = filter.brand.includes(slug);
		updateParams({
			...filter,
			brand: isSel
				? filter.brand.filter((s) => s !== slug)
				: [...filter.brand, slug],
		});
	};
	const handlePresetPrice = (min, max) =>
		updateParams({ ...filter, minPrice: min, maxPrice: max });
	const handlePageChange = (np) => {
		const p = new URLSearchParams(searchParams);
		p.set("page", np);
		setSearchParams(p);
	};
	const handleSortChange = (e) =>
		updateParams({ ...filter, sort: e.target.value });
	const handleResetFilter = () => setSearchParams({});

	useEffect(() => {
		const t = setTimeout(() => {
			if (
				String(priceRange.min) !== String(filter.minPrice) ||
				String(priceRange.max) !== String(filter.maxPrice)
			)
				updateParams({
					...filter,
					minPrice: priceRange.min,
					maxPrice: priceRange.max,
				});
		}, 500);
		return () => clearTimeout(t);
	}, [priceRange]); // eslint-disable-line

	const handleManualPriceChange = (e) => {
		const { name, value } = e.target;
		setPriceRange((prev) => ({ ...prev, [name]: value }));
	};
	const isRangeActive = (min, max) =>
		String(filter.minPrice) === String(min) &&
		String(filter.maxPrice) === String(max);

	const hasActiveFilters =
		filter.category ||
		filter.brand.length > 0 ||
		filter.minPrice ||
		filter.maxPrice;

	// ── Sidebar content (shared between desktop & mobile) ────────────────────
	const renderSidebarContent = () => (
		<div className="space-y-7">
			{/* ── Danh mục ── */}
			<div>
				<SectionLabel>Danh mục</SectionLabel>
				<ul className="space-y-0.5">
					{[{ slug: "", name: "Tất cả sản phẩm" }, ...categories].map(
						(cat) => {
							const active = filter.category === cat.slug;
							return (
								<li
									key={cat._id || "all"}
									onClick={() =>
										handleCategoryChange(cat.slug)
									}
									className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
									${
										active
											? "bg-[#c2784d] text-white shadow-sm"
											: "text-[#5a4a3a] hover:bg-[#fff3eb] hover:text-[#c2784d]"
									}`}>
									<span className="text-sm font-medium">
										{cat.name}
									</span>
									{active && (
										<span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
									)}
								</li>
							);
						},
					)}
				</ul>
			</div>

			{/* ── Thương hiệu ── */}
			<div>
				<SectionLabel>Thương hiệu</SectionLabel>
				<div
					className="space-y-0.5 max-h-52 overflow-y-auto pr-1"
					style={{
						scrollbarWidth: "thin",
						scrollbarColor: "#e0d5c8 transparent",
					}}>
					{brands.map((brand) => {
						const checked = filter.brand.includes(brand.slug);
						return (
							<label
								key={brand._id}
								className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#fff3eb] select-none">
								<div
									onClick={() =>
										handleBrandToggle(brand.slug)
									}
									className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all duration-200
										${checked ? "bg-[#c2784d] border-[#c2784d]" : "border-2 border-[#d0c4b8] bg-white"}`}>
									<input
										type="checkbox"
										className="hidden"
										checked={checked}
										onChange={() =>
											handleBrandToggle(brand.slug)
										}
									/>
									{checked && <IconCheck />}
								</div>
								<span
									className={`text-sm transition-colors ${checked ? "text-[#c2784d] font-semibold" : "text-[#5a4a3a]"}`}>
									{brand.name}
								</span>
							</label>
						);
					})}
				</div>
			</div>

			{/* ── Khoảng giá ── */}
			<div>
				<SectionLabel>Khoảng giá</SectionLabel>
				<div className="space-y-0.5 mb-4">
					{PRICE_RANGES.map((range) => {
						const active = isRangeActive(range.min, range.max);
						return (
							<label
								key={range.id}
								onClick={() =>
									handlePresetPrice(range.min, range.max)
								}
								className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 select-none
									${active ? "bg-[#fff3eb]" : "hover:bg-[#faf7f4]"}`}>
								<div
									className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
									${active ? "border-[#c2784d]" : "border-[#d0c4b8]"}`}>
									{active && (
										<div className="w-1.5 h-1.5 rounded-full bg-[#c2784d]" />
									)}
								</div>
								<span
									className={`text-sm ${active ? "text-[#c2784d] font-semibold" : "text-[#5a4a3a]"}`}>
									{range.label}
								</span>
							</label>
						);
					})}
				</div>
				{/* Manual price input */}
				<div className="flex items-center gap-2 mt-2">
					<input
						name="min"
						type="number"
						value={priceRange.min}
						onChange={handleManualPriceChange}
						placeholder="Từ"
						className="w-full bg-white border border-[#e0d5c8] rounded-lg px-3 py-2 text-sm text-[#3a2a1a] placeholder-[#c0b5a8] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/10 transition-all"
					/>
					<span className="text-[#c0b5a8] text-sm">—</span>
					<input
						name="max"
						type="number"
						value={priceRange.max}
						onChange={handleManualPriceChange}
						placeholder="Đến"
						className="w-full bg-white border border-[#e0d5c8] rounded-lg px-3 py-2 text-sm text-[#3a2a1a] placeholder-[#c0b5a8] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/10 transition-all"
					/>
				</div>
			</div>

			{/* ── Sắp xếp ── */}
			<div>
				<SectionLabel>Sắp xếp theo</SectionLabel>
				<div className="space-y-0.5">
					{[
						{ value: "newest", label: "Mới nhất" },
						{ value: "price_asc", label: "Giá: Thấp → Cao" },
						{ value: "price_desc", label: "Giá: Cao → Thấp" },
						{ value: "rating", label: "Đánh giá cao nhất" },
					].map((opt) => {
						const active = filter.sort === opt.value;
						return (
							<div
								key={opt.value}
								onClick={() =>
									handleSortChange({
										target: { value: opt.value },
									})
								}
								className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-all duration-200
									${
										active
											? "bg-[#fff3eb] text-[#c2784d] font-semibold border border-[#f0d5c0]"
											: "text-[#5a4a3a] hover:bg-[#faf7f4]"
									}`}>
								{opt.label}
							</div>
						);
					})}
				</div>
			</div>

			{/* ── Reset ── */}
			<button
				onClick={handleResetFilter}
				className="w-full py-2.5 rounded-lg border border-[#e0d5c8] text-[#8a7060] text-sm font-medium
					hover:border-[#c2784d] hover:text-[#c2784d] hover:bg-[#fff8f4] transition-all duration-200 flex items-center justify-center gap-2">
				<IconX size={13} /> Xóa tất cả bộ lọc
			</button>
		</div>
	);

	// ─────────────────────────────────────────────────────────────────────────
	return (
		<>
			<style>{`
				@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.shop-root { font-family: 'DM Sans', sans-serif; }
				.shop-title { font-family: 'Playfair Display', serif; }
				.tag-pill { animation: fadeIn .2s ease; }
				@keyframes fadeIn { from { opacity:0; transform:translateY(-4px); } to { opacity:1; transform:translateY(0); } }
				.product-grid > * { animation: cardIn .35s ease both; }
				@keyframes cardIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
				.product-grid > *:nth-child(1) { animation-delay:.05s }
				.product-grid > *:nth-child(2) { animation-delay:.1s  }
				.product-grid > *:nth-child(3) { animation-delay:.15s }
				.product-grid > *:nth-child(4) { animation-delay:.2s  }
				.product-grid > *:nth-child(5) { animation-delay:.25s }
				.product-grid > *:nth-child(6) { animation-delay:.3s  }
				.product-grid > *:nth-child(7) { animation-delay:.35s }
				.product-grid > *:nth-child(8) { animation-delay:.4s  }
				.product-grid > *:nth-child(9) { animation-delay:.45s }
				.mobile-overlay { backdrop-filter: blur(4px); }
			`}</style>

			<div className="shop-root bg-white min-h-screen">
				{/* ── Page Header ── */}
				<div className="bg-linear-to-br from-[#fff8f3] via-[#fdf4ee] to-[#fef9f6] border-b border-[#f0e5d8] px-4 py-10 text-center relative overflow-hidden">
					<div
						className="absolute inset-0 opacity-30"
						style={{
							backgroundImage:
								"radial-gradient(circle at 20% 50%, #f5d5be 0%, transparent 50%), radial-gradient(circle at 80% 50%, #fce8d4 0%, transparent 50%)",
						}}
					/>
					<p className="text-[10px] tracking-[0.3em] uppercase text-[#c2784d] mb-2 relative">
						Bộ sưu tập
					</p>
					<h1 className="shop-title text-3xl md:text-4xl font-medium text-[#2a1a0e] relative">
						Cửa Hàng Giày
					</h1>
					<div className="w-12 h-0.5 bg-[#c2784d] mx-auto mt-4 relative" />
				</div>

				{/* ── Main Layout ──────────────────────────────────────────────── */}
				<div className="max-w-7xl mx-auto px-4 py-8 flex gap-8 bg-[#fafaf9]">
					{/* ── Desktop Sidebar ───────────────────────────────────────── */}
					<aside className="hidden lg:block w-64 shrink-0">
						<div className="bg-white rounded-2xl p-6 sticky top-24 shadow-md shadow-[#e8d5c0]/40 border border-[#f0e5d8]">
							<div className="flex items-center gap-2 mb-7 pb-5 border-b border-[#f0e5d8]">
								<span className="text-[#c2784d]">
									<IconFilter />
								</span>
								<span className="shop-title text-base text-[#2a1a0e]">
									Bộ lọc
								</span>
								{hasActiveFilters && (
									<span className="ml-auto bg-[#c2784d] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
										{[
											filter.category ? 1 : 0,
											...filter.brand.map(() => 1),
											filter.minPrice || filter.maxPrice
												? 1
												: 0,
										].reduce((a, b) => a + b, 0)}
									</span>
								)}
							</div>
							{renderSidebarContent()}
						</div>
					</aside>

					{/* ── Mobile Filter Trigger ─────────────────────────────────── */}
					<div className="lg:hidden fixed bottom-6 right-6 z-40">
						<button
							onClick={() => setSidebarOpen(true)}
							className="flex items-center gap-2 bg-[#c2784d] text-white px-5 py-3 rounded-full shadow-lg text-sm font-semibold">
							<IconFilter /> Bộ lọc
							{hasActiveFilters && (
								<span className="bg-white text-[#c2784d] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
									{[
										filter.category ? 1 : 0,
										...filter.brand.map(() => 1),
										filter.minPrice || filter.maxPrice
											? 1
											: 0,
									].reduce((a, b) => a + b, 0)}
								</span>
							)}
						</button>
					</div>

					{/* ── Mobile Sidebar Overlay ───────────────────────────────── */}
					{sidebarOpen && (
						<div className="lg:hidden fixed inset-0 z-50 flex">
							<div
								className="mobile-overlay flex-1 bg-black/30"
								onClick={() => setSidebarOpen(false)}
							/>
							<div className="w-80 bg-white h-full overflow-y-auto p-6 shadow-2xl">
								<div className="flex items-center justify-between mb-6 pb-4 border-b border-[#f0e5d8]">
									<span className="shop-title text-lg text-[#2a1a0e]">
										Bộ lọc
									</span>
									<button
										onClick={() => setSidebarOpen(false)}
										className="text-[#a0957e] hover:text-[#c2784d] transition-colors p-1">
										<IconX size={20} />
									</button>
								</div>
								{renderSidebarContent()}
							</div>
						</div>
					)}

					{/* ── Main Content ──────────────────────────────────────────── */}
					<main className="flex-1 min-w-0">
						{/* ── Active Filter Tags ────────────────────────────────── */}
						{hasActiveFilters && (
							<div className="mb-5 flex flex-wrap items-center gap-2">
								<span className="text-xs text-[#8a8070] mr-1 font-medium">
									Đang lọc:
								</span>

								{filter.category && (
									<span className="tag-pill inline-flex items-center gap-1.5 bg-white border border-[#e0d5c8] text-[#5a4a3a] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
										{categories.find(
											(c) => c._id === filter.category,
										)?.name ||
											categories.find(
												(c) =>
													c.slug === filter.category,
											)?.name ||
											"Danh mục"}
										<button
											onClick={() =>
												handleCategoryChange(
													filter.category,
												)
											}
											className="text-[#a0957e] hover:text-[#c2784d] transition-colors ml-0.5">
											<IconX size={11} />
										</button>
									</span>
								)}

								{filter.brand.map((bSlug) => (
									<span
										key={bSlug}
										className="tag-pill inline-flex items-center gap-1.5 bg-white border border-[#e0d5c8] text-[#5a4a3a] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
										{brands.find((b) => b.slug === bSlug)
											?.name || "Brand"}
										<button
											onClick={() =>
												handleBrandToggle(bSlug)
											}
											className="text-[#a0957e] hover:text-[#c2784d] transition-colors ml-0.5">
											<IconX size={11} />
										</button>
									</span>
								))}

								{(filter.minPrice || filter.maxPrice) && (
									<span className="tag-pill inline-flex items-center gap-1.5 bg-white border border-[#e0d5c8] text-[#5a4a3a] text-xs font-medium px-3 py-1.5 rounded-full shadow-sm">
										{filter.minPrice
											? new Intl.NumberFormat("vi-VN", {
													notation: "compact",
												}).format(filter.minPrice)
											: "0"}
										{" – "}
										{filter.maxPrice
											? new Intl.NumberFormat("vi-VN", {
													notation: "compact",
												}).format(filter.maxPrice)
											: "∞"}
										<button
											onClick={() =>
												handlePresetPrice("", "")
											}
											className="text-[#a0957e] hover:text-[#c2784d] transition-colors ml-0.5">
											<IconX size={11} />
										</button>
									</span>
								)}

								<button
									onClick={handleResetFilter}
									className="text-xs text-[#a0957e] hover:text-[#c2784d] hover:underline ml-1 transition-colors">
									Xóa hết
								</button>
							</div>
						)}

						{/* ── Loading ───────────────────────────────────────────── */}
						{loading ? (
							<div className="flex flex-col items-center justify-center h-96 gap-4">
								<IconSpinner />
								<p className="text-sm text-[#a08070] tracking-widest uppercase">
									Đang tải...
								</p>
							</div>
						) : products.length > 0 ? (
							<>
								{/* ── Count ── */}
								<p className="text-xs text-[#a08070] mb-5">
									Hiển thị{" "}
									<span className="text-[#3a2a1a] font-semibold">
										{products.length}
									</span>{" "}
									sản phẩm
								</p>

								{/* ── Grid ── */}
								<div className="product-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
									{products.map((p) => (
										<ProductCard
											key={p._id}
											product={p}
										/>
									))}
								</div>

								{/* ── Pagination ── */}
								<div className="mt-10">
									<Pagination
										currentPage={page}
										totalPages={totalPages}
										onPageChange={handlePageChange}
									/>
								</div>
							</>
						) : (
							/* ── Empty State ── */
							<div className="flex flex-col items-center justify-center py-24 bg-[#fffaf7] rounded-2xl shadow-sm border border-[#f0e5d8] text-center">
								<div className="w-20 h-20 bg-[#fff3eb] rounded-full flex items-center justify-center mb-5">
									<IconShoe />
								</div>
								<h3 className="shop-title text-xl text-[#2a1a0e] mb-2">
									Không tìm thấy sản phẩm
								</h3>
								<p className="text-sm text-[#a08070] max-w-xs mb-6">
									Thử điều chỉnh bộ lọc để tìm kiếm nhiều kết
									quả hơn.
								</p>
								<button
									onClick={handleResetFilter}
									className="bg-[#c2784d] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:bg-[#b06840] transition-colors">
									Xóa bộ lọc
								</button>
							</div>
						)}
					</main>
				</div>
			</div>
		</>
	);
};

export default Shop;
