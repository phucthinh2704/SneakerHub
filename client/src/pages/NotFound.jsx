import { Link } from "react-router-dom";

const NotFound = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
			<h1 className="text-9xl font-extrabold text-orange-600">404</h1>
			<h2 className="text-2xl font-bold text-gray-900 mt-4">
				Không tìm thấy trang
			</h2>
			<p className="text-gray-600 mt-2 mb-8">
				Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
			</p>
			<Link
				to="/"
				className="px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition">
				Về Trang Chủ
			</Link>
		</div>
	);
};

export default NotFound;
