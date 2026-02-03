// src/components/CategorySection.jsx
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiGetCategories } from "../api/product";

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await apiGetCategories();
        if (res.success) setCategories(res.result);
      } catch (error) {
        console.error("Lỗi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null; // Hoặc skeleton loading nếu muốn
  if (categories.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Danh Mục Nổi Bật</h2>
            <p className="text-gray-500 mt-2">Khám phá phong cách phù hợp với bạn</p>
          </div>
          <Link to="/shop" className="hidden md:flex items-center text-orange-600 font-medium hover:text-orange-700 transition">
            Xem tất cả <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

        {/* Grid Danh Mục */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link 
              key={cat._id} 
              to={`/shop?category=${cat._id}`} 
              className="group relative block overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition duration-300"
            >
              {/* Ảnh nền danh mục */}
              <div className="aspect-w-4 aspect-h-5 sm:aspect-none sm:h-80 bg-gray-200 h-64">
                <img 
                  src={cat.image || "https://placehold.co/400x600?text=No+Image"} 
                  alt={cat.name} 
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-110 transition duration-500"
                />
              </div>
              
              {/* Overlay Gradient tối để chữ dễ đọc */}
              <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition"></div>

              {/* Nội dung text */}
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-xl font-bold text-white group-hover:text-orange-400 transition">
                  {cat.name}
                </h3>
                <p className="text-gray-300 text-sm mt-1 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition duration-300">
                  Khám phá ngay &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;