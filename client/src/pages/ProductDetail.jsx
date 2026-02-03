import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGetProductDetail } from "../api/product";
import { apiAddToCart } from "../api/cart";
import { Loader2, Star, Truck, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ProductDetail = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { isLoggedIn } = useSelector((state) => state.auth);

	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);

	// State cho lựa chọn của khách hàng
	const [selectedVariant, setSelectedVariant] = useState(null); // Variant màu đang chọn
	const [selectedSize, setSelectedSize] = useState(null); // Size object đang chọn
	const [quantity, setQuantity] = useState(1);
	const [activeImage, setActiveImage] = useState("");

	useEffect(() => {
		const fetchProduct = async () => {
			try {
				const res = await apiGetProductDetail(slug);
				if (res.success) {
					setProduct(res.result);
					// Mặc định chọn biến thể đầu tiên
					if (res.result.variants?.length > 0) {
						const firstVar = res.result.variants[0];
						setSelectedVariant(firstVar);
						setActiveImage(firstVar.images[0]);
					}
				}
			} catch (error) {
				console.error(error);
				toast.error("Lỗi tải sản phẩm");
			} finally {
				setLoading(false);
			}
		};
		fetchProduct();
	}, [slug]);

	const handleColorChange = (variant) => {
		setSelectedVariant(variant);
		setActiveImage(variant.images[0]);
		setSelectedSize(null); // Reset size khi đổi màu
		setQuantity(1);
	};

	const handleAddToCart = async () => {
		if (!isLoggedIn) {
			toast.error("Vui lòng đăng nhập để mua hàng");
			return navigate("/login");
		}
		if (!selectedSize) return toast.error("Vui lòng chọn Size");

		try {
			const payload = {
				productId: product._id,
				color: selectedVariant.color,
				size: selectedSize.size,
				quantity: quantity,
			};

			const res = await apiAddToCart(payload);
			if (res.success) {
				toast.success("Đã thêm vào giỏ hàng!");
				// Có thể dispatch action để cập nhật số lượng trên header
			}
		} catch (error) {
			toast.error(error.response?.data?.message || "Lỗi thêm giỏ hàng");
		}
	};

	if (loading)
		return (
			<div className="min-h-screen flex justify-center items-center">
				<Loader2 className="animate-spin" />
			</div>
		);
	if (!product)
		return <div className="text-center pt-20">Sản phẩm không tồn tại</div>;

	return (
		<div className="max-w-7xl mx-auto px-4 py-10">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">
				{/* Gallery Ảnh */}
				<div className="space-y-4">
					<div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
						<img
							src={activeImage}
							alt={product.name}
							className="w-full h-full object-cover object-center"
						/>
					</div>
					{/* List ảnh nhỏ của variant hiện tại */}
					<div className="flex space-x-2 overflow-x-auto">
						{selectedVariant?.images.map((img, idx) => (
							<img
								key={idx}
								src={img}
								onClick={() => setActiveImage(img)}
								className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${activeImage === img ? "border-orange-600" : "border-transparent"}`}
								alt="thumbnail"
							/>
						))}
					</div>
				</div>

				{/* Thông tin sản phẩm */}
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						{product.name}
					</h1>
					<div className="flex items-center mt-2 space-x-2">
						<div className="flex text-yellow-400">
							{[...Array(5)].map((_, i) => (
								<Star
									key={i}
									size={16}
									fill={
										i < Math.round(product.rating)
											? "currentColor"
											: "none"
									}
								/>
							))}
						</div>
						<span className="text-gray-500 text-sm">
							({product.numReviews} đánh giá)
						</span>
					</div>

					<p className="text-2xl font-bold text-orange-600 mt-4">
						{new Intl.NumberFormat("vi-VN", {
							style: "currency",
							currency: "VND",
						}).format(product.price)}
					</p>

					<p className="text-gray-600 mt-4 text-sm leading-relaxed">
						{product.description}
					</p>

					{/* Chọn Màu */}
					<div className="mt-6">
						<h3 className="text-sm font-medium text-gray-900">
							Màu sắc:{" "}
							<span className="font-bold">
								{selectedVariant?.color}
							</span>
						</h3>
						<div className="flex items-center space-x-3 mt-2">
							{product.variants.map((v) => (
								<button
									key={v._id}
									onClick={() => handleColorChange(v)}
									className={`w-10 h-10 rounded-full border-2 focus:outline-none ${selectedVariant?._id === v._id ? "border-orange-600 ring-2 ring-orange-200" : "border-gray-200"}`}
									style={{
										backgroundColor: v.hexCode || "#ccc",
									}} // Cần thêm field hexCode trong DB hoặc map cứng
									title={v.color}
								/>
							))}
						</div>
					</div>

					{/* Chọn Size */}
					<div className="mt-6">
						<h3 className="text-sm font-medium text-gray-900">
							Kích thước
						</h3>
						<div className="grid grid-cols-4 gap-2 mt-2 sm:grid-cols-6">
							{selectedVariant?.sizes.map((s) => (
								<button
									key={s._id}
									onClick={() => setSelectedSize(s)}
									disabled={s.quantity === 0}
									className={`border py-2 text-sm font-medium rounded-md sm:flex-1 cursor-pointer 
                    ${s.quantity === 0 ? "opacity-40 cursor-not-allowed bg-gray-100" : ""}
                    ${selectedSize?._id === s._id ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-900 hover:bg-gray-50"}
                  `}>
									{s.size}
								</button>
							))}
						</div>
					</div>

					{/* Chọn Số lượng & Add to Cart */}
					<div className="mt-8 flex items-center gap-4">
						<div className="flex items-center border border-gray-300 rounded">
							<button
								onClick={() =>
									setQuantity(Math.max(1, quantity - 1))
								}
								className="px-3 py-1 bg-gray-100 hover:bg-gray-200">
								-
							</button>
							<span className="px-4 py-1">{quantity}</span>
							<button
								onClick={() =>
									setQuantity(
										Math.min(
											selectedSize?.quantity || 99,
											quantity + 1,
										),
									)
								}
								className="px-3 py-1 bg-gray-100 hover:bg-gray-200">
								+
							</button>
						</div>

						<button
							onClick={handleAddToCart}
							disabled={
								!selectedSize || selectedSize?.quantity === 0
							}
							className="flex-1 bg-gray-900 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50">
							{selectedSize?.quantity === 0
								? "Hết hàng"
								: "Thêm vào giỏ"}
						</button>
					</div>

					{/* Policies */}
					<div className="mt-8 border-t pt-6 space-y-4">
						<div className="flex items-center text-gray-600 text-sm">
							<Truck className="w-5 h-5 mr-3 text-orange-600" />
							<span>Miễn phí vận chuyển toàn quốc</span>
						</div>
						<div className="flex items-center text-gray-600 text-sm">
							<ShieldCheck className="w-5 h-5 mr-3 text-orange-600" />
							<span>Bảo hành chính hãng 12 tháng</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductDetail;
