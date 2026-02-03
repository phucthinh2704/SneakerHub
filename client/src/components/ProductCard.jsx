import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  // Lấy ảnh từ variant đầu tiên để hiển thị
  const mainImage = product.variants?.[0]?.images?.[0] || "";
  const price = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price);

  return (
    <div className="group relative border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
      <div className="flex items-center justify-center aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-white lg:aspect-none lg:h-80">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full object-contain object-center group-hover:scale-105 transition duration-300"
        />
      </div>
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700 font-bold">
            <Link to={`/product/${product.slug}`}>
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.category?.name}</p>
        </div>
        <p className="text-sm font-medium text-orange-600">{price}</p>
      </div>
    </div>
  );
};

export default ProductCard;