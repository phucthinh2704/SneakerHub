// src/pages/Home.jsx
import {
  Headphones,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Truck
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetProducts } from "../api/product"; // Đổi tên hàm cho khớp với service

// Import các component
import CategorySection from "../components/CategorySection"; // Đã thêm ở trên
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";

const Home = () => {
	const [newProducts, setNewProducts] = useState([]); // Hàng mới
	const [bestSellers, setBestSellers] = useState([]); // Bán chạy
	const [loading, setLoading] = useState(true);

	const productSectionRef = useRef(null);

	useEffect(() => {
		loadData();
	}, []);

	const loadData = async () => {
		try {
			setLoading(true);

			// Gọi API song song:
			// 1. Lấy 4-8 sản phẩm mới nhất (sort: -createdAt)
			// 2. Lấy 4-8 sản phẩm bán chạy (sort: -sold) hoặc featured
			const [newRes, bestRes] = await Promise.all([
				apiGetProducts({ limit: 8, sort: "newest" }), // Backend bạn cần handle sort=newest hoặc createdAt
				apiGetProducts({ limit: 4, sort: "rating" }), // Hoặc tiêu chí khác
			]);

			if (newRes.success) setNewProducts(newRes.result.products);
			if (bestRes.success) setBestSellers(bestRes.result.products);
		} catch (error) {
			console.error("Lỗi tải dữ liệu Home:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleScrollToShop = () => {
		productSectionRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-white">
				<Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
			</div>
		);
	}

	return (
		<div className="bg-gray-50 min-h-screen font-sans">
			{/* 1. HERO SECTION */}
			<HeroSection onBuyNowClick={handleScrollToShop} />

			{/* 2. POLICY BAR (Dịch vụ) */}
			{/* Đặt đè lên Hero một chút hoặc ngay dưới */}
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 sm:-mt-16 mb-12">
				<div className="bg-white rounded-xl shadow-lg p-6 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					<ServiceItem
						icon={<Truck size={28} />}
						title="Miễn phí vận chuyển"
						desc="Cho đơn hàng > 2tr"
					/>
					<ServiceItem
						icon={<ShieldCheck size={28} />}
						title="Cam kết chính hãng"
						desc="Bồi hoàn 111% nếu fake"
					/>
					<ServiceItem
						icon={<RefreshCw size={28} />}
						title="Đổi trả 30 ngày"
						desc="Thủ tục đơn giản"
					/>
					<ServiceItem
						icon={<Headphones size={28} />}
						title="Hỗ trợ 24/7"
						desc="Hotline: 1900 xxxx"
					/>
				</div>
			</div>

			<main className="space-y-20 pb-20">
				{/* 3. CATEGORY SECTION */}
				<CategorySection />

				{/* 4. NEW ARRIVALS (Hàng Mới Về) - Đặt ở đây là hợp lý nhất */}
				<div
					ref={productSectionRef}
					className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<SectionHeader
						title="Hàng Mới Về"
						subtitle="Những mẫu sneakers hot nhất vừa cập bến Shoe Store"
					/>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
						{newProducts.map((product) => (
							<ProductCard
								key={product._id}
								product={product}
							/>
						))}
					</div>

					<div className="text-center mt-10">
						<Link
							to="/shop?sort=newest"
							className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 md:text-lg transition">
							Xem tất cả sản phẩm mới
						</Link>
					</div>
				</div>

				{/* 5. PROMO BANNER */}
				<div className="relative py-24 bg-gray-900">
					<div className="absolute inset-0 overflow-hidden">
						<img
							src="https://images.unsplash.com/photo-1556906781-9a412961d289?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
							alt="Banner Promo"
							className="w-full h-full object-cover opacity-30"
						/>
					</div>
					<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-3xl font-extrabold text-white sm:text-4xl">
							<span className="block">Giảm giá mùa hè</span>
							<span className="block text-orange-500">
								lên đến 50%
							</span>
						</h2>
						<p className="mt-4 text-lg leading-6 text-gray-300">
							Cơ hội sở hữu những đôi giày yêu thích với mức giá
							không thể tốt hơn.
						</p>
						<Link
							to="/shop"
							className="mt-8 inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-900 bg-white hover:bg-gray-100 md:text-lg transition">
							Săn Deal Ngay
						</Link>
					</div>
				</div>

				{/* 6. BEST SELLERS / TRENDING */}
				{bestSellers.length > 0 && (
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<SectionHeader
							title="Sản Phẩm Bán Chạy"
							subtitle="Được cộng đồng yêu thích và lựa chọn nhiều nhất"
						/>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
							{bestSellers.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
								/>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
};

// --- Sub Components ---

const SectionHeader = ({ title, subtitle }) => (
	<div className="text-center mb-10">
		<h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
			{title}
		</h2>
		<div className="w-24 h-1 bg-orange-600 mx-auto mt-4 mb-4 rounded-full"></div>
		{subtitle && (
			<p className="text-lg text-gray-500 max-w-2xl mx-auto">
				{subtitle}
			</p>
		)}
	</div>
);

const ServiceItem = ({ icon, title, desc }) => (
	<div className="flex items-start space-x-4">
		<div className="shrink-0 text-orange-600 bg-orange-50 p-3 rounded-xl">
			{icon}
		</div>
		<div>
			<h3 className="text-lg font-bold text-gray-900">{title}</h3>
			<p className="text-sm text-gray-500 mt-1">{desc}</p>
		</div>
	</div>
);

export default Home;
