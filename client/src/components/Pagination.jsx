import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	// Nếu chỉ có 1 trang thì không cần hiển thị
	if (totalPages <= 1) return null;

	// Hàm tạo dãy số trang (Logic xử lý dấu "..." nếu quá nhiều trang)
	const getPageNumbers = () => {
		const pages = [];
		const maxVisible = 5; // Số lượng nút trang tối đa muốn hiển thị

		if (totalPages <= maxVisible) {
			// Nếu ít trang, hiển thị hết (VD: 1, 2, 3)
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Nếu nhiều trang, xử lý logic "..."
			if (currentPage <= 3) {
				pages.push(1, 2, 3, 4, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(
					1,
					"...",
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages,
				);
			} else {
				pages.push(
					1,
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages,
				);
			}
		}
		return pages;
	};

	return (
		<div className="flex items-center justify-center space-x-2 mt-8">
			{/* Nút Previous */}
			<button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
				<ChevronLeft size={20} />
			</button>

			{/* Dãy số trang */}
			{getPageNumbers().map((page, index) => (
				<React.Fragment key={index}>
					{page === "..." ? (
						<span className="px-3 py-1 text-gray-400">...</span>
					) : (
						<button
							onClick={() => onPageChange(page)}
							className={`px-4 py-2 rounded-md border font-medium transition ${
								currentPage === page
									? "bg-orange-600 text-white border-orange-600" // Active state
									: "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
							}`}>
							{page}
						</button>
					)}
				</React.Fragment>
			))}

			{/* Nút Next */}
			<button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className="p-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
				<ChevronRight size={20} />
			</button>
		</div>
	);
};

export default Pagination;
