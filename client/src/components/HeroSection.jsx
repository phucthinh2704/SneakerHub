// src/components/HeroSection.jsx
import React from "react";
import { Link } from "react-router-dom";

const HeroSection = ({ onBuyNowClick }) => {
  return (
    <div className="relative bg-gray-900 h-150 overflow-hidden">
      {/* Background Image */}
      <img
        src="https://images.unsplash.com/photo-1552346154-21d32810aba3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      
      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Nâng Tầm <br />
            <span className="text-orange-500">Bước Chạy Của Bạn</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-lg">
            Khám phá bộ sưu tập giày thể thao mới nhất với công nghệ đệm khí tiên tiến. Thoải mái, phong cách và bền bỉ.
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={onBuyNowClick}
              className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-700 transition transform hover:scale-105"
            >
              Mua Ngay
            </button>
            <Link 
              to="/about"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-gray-900 transition"
            >
              Tìm Hiểu Thêm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;