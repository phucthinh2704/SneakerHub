import React from "react";
import { Award, Users, Smile, TrendingUp } from "lucide-react";

const About = () => {
	return (
		<div className="bg-white">
			{/* Hero Banner About */}
			<div className="relative h-75 bg-gray-900 flex items-center justify-center">
				<img
					src="https://images.unsplash.com/photo-1556906781-9a412961d289?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
					alt="About Banner"
					className="absolute inset-0 w-full h-full object-cover opacity-40"
				/>
				<div className="relative z-10 text-center text-white">
					<h1 className="text-4xl font-bold mb-2">Về Chúng Tôi</h1>
					<p className="text-gray-300">
						Hành trình mang đến những bước chân êm ái
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				{/* Section: Our Story */}
				<div className="flex flex-col md:flex-row items-center gap-12 mb-20">
					<div className="w-full md:w-1/2">
						<img
							src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
							alt="Our Story"
							className="rounded-lg shadow-xl"
						/>
					</div>
					<div className="w-full md:w-1/2">
						<h4 className="text-orange-600 font-bold uppercase mb-2">
							Câu chuyện của chúng tôi
						</h4>
						<h2 className="text-3xl font-bold text-gray-900 mb-6">
							Chúng tôi không chỉ bán giày, chúng tôi bán phong
							cách.
						</h2>
						<p className="text-gray-600 leading-relaxed mb-4">
							Được thành lập vào năm 2023, Shoe Store bắt đầu với
							một sứ mệnh đơn giản: Cung cấp những đôi giày thể
							thao chất lượng cao nhất với mức giá hợp lý nhất cho
							người Việt.
						</p>
						<p className="text-gray-600 leading-relaxed">
							Chúng tôi tin rằng một đôi giày tốt sẽ đưa bạn đến
							những nơi tuyệt vời. Đội ngũ của chúng tôi luôn nỗ
							lực tìm kiếm những mẫu mã mới nhất, công nghệ êm ái
							nhất để phục vụ đam mê của bạn.
						</p>
					</div>
				</div>

				{/* Section: Statistics */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20">
					<div className="p-6 border rounded-lg bg-gray-50">
						<Award className="w-10 h-10 text-orange-600 mx-auto mb-3" />
						<h3 className="text-3xl font-bold text-gray-900">
							10+
						</h3>
						<p className="text-gray-600">Năm kinh nghiệm</p>
					</div>
					<div className="p-6 border rounded-lg bg-gray-50">
						<Users className="w-10 h-10 text-orange-600 mx-auto mb-3" />
						<h3 className="text-3xl font-bold text-gray-900">
							50K+
						</h3>
						<p className="text-gray-600">Khách hàng tin dùng</p>
					</div>
					<div className="p-6 border rounded-lg bg-gray-50">
						<Smile className="w-10 h-10 text-orange-600 mx-auto mb-3" />
						<h3 className="text-3xl font-bold text-gray-900">
							99%
						</h3>
						<p className="text-gray-600">Hài lòng</p>
					</div>
					<div className="p-6 border rounded-lg bg-gray-50">
						<TrendingUp className="w-10 h-10 text-orange-600 mx-auto mb-3" />
						<h3 className="text-3xl font-bold text-gray-900">
							100+
						</h3>
						<p className="text-gray-600">Thương hiệu đối tác</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default About;
