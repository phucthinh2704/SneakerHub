import {
	Loader2,
	Mail,
	Phone,
	Search,
	Shield,
	Trash2,
	User,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	apiDeleteUser,
	apiGetAllUsers,
	apiUpdateUserRole,
} from "../../api/admin";
import Pagination from "../../components/Pagination"; // Import component phân trang của bạn

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	// States cho Phân trang, Search, Sort
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [sort, setSort] = useState("newest");

	// Fetch API với Params
	useEffect(() => {
		// Dùng timer để Debounce khi gõ tìm kiếm (tránh spam API)
		const timer = setTimeout(() => {
			fetchUsers();
		}, 500);
		return () => clearTimeout(timer);
		// eslint-disable-next-line
	}, [page, searchTerm, sort]);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const res = await apiGetAllUsers({
				page,
				limit: 8,
				keyword: searchTerm,
				sort,
			});
			if (res.success) {
				setUsers(res.result);
				setTotalPages(res.pages);
			}
		} catch (error) {
			console.log(error);
			toast.error("Lỗi tải danh sách người dùng");
		} finally {
			setLoading(false);
		}
	};

	// --- HÀNH ĐỘNG 1: THAY ĐỔI QUYỀN (ROLE) ---
	const handleRoleChange = async (user) => {
		const newRole = user.role === "admin" ? "user" : "admin";

		const result = await Swal.fire({
			title: "Thay đổi quyền?",
			text: `Bạn muốn chuyển tài khoản ${user.name} thành ${newRole.toUpperCase()}?`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#ea580c",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Xác nhận",
			cancelButtonText: "Hủy",
		});

		if (result.isConfirmed) {
			try {
				const res = await apiUpdateUserRole(user._id, newRole);
				if (res.success) {
					toast.success(res.message);
					setUsers(
						users.map((u) =>
							u._id === user._id ? { ...u, role: newRole } : u,
						),
					);
				}
			} catch (error) {
				toast.error(
					error.response?.data?.message || "Lỗi cập nhật quyền",
				);
			}
		}
	};

	// Hàm xóa User
	const handleDeleteUser = async (id) => {
		const result = await Swal.fire({
			title: "Xóa người dùng?",
			text: "Tài khoản này sẽ bị xóa vĩnh viễn. Bạn có chắc chắn?",
			icon: "error", // Icon màu đỏ nhấn mạnh sự nguy hiểm
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#6b7280",
			confirmButtonText: "Xóa tài khoản",
			cancelButtonText: "Hủy",
		});

		if (result.isConfirmed) {
			try {
				const res = await apiDeleteUser(id);
				if (res.success) {
					toast.success(res.message);
					setUsers(users.filter((u) => u._id !== id));
				}
			} catch (error) {
				toast.error(
					error.response?.data?.message ||
						"Không thể xóa người dùng này",
				);
			}
		}
	};

	return (
		<div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
			{/* Header: Search & Sort */}
			<div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
				<h2 className="text-xl font-bold text-gray-800 hidden lg:block">
					Quản lý Khách hàng
				</h2>

				<div className="flex w-full lg:w-auto items-center space-x-3">
					<div className="relative w-full md:w-80">
						<Search
							className="absolute left-3 top-2.5 text-gray-400"
							size={18}
						/>
						<input
							type="text"
							placeholder="Tìm tên, email..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setPage(1);
							}}
							className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 outline-none"
						/>
					</div>

					<select
						value={sort}
						onChange={(e) => {
							setSort(e.target.value);
							setPage(1);
						}}
						className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500">
						<option value="newest">Mới nhất</option>
						<option value="oldest">Cũ nhất</option>
						<option value="name_asc">Tên (A-Z)</option>
						<option value="name_desc">Tên (Z-A)</option>
					</select>
				</div>
			</div>

			{/* Bảng dữ liệu */}
			<div className="overflow-x-auto">
				<table className="w-full text-left text-sm whitespace-nowrap">
					<thead className="bg-gray-50 text-gray-600 font-medium border-b">
						<tr>
							<th className="px-6 py-4">Khách Hàng</th>
							<th className="px-6 py-4">Liên Hệ</th>
							<th className="px-6 py-4 text-center">Vai Trò</th>
							<th className="px-6 py-4">Ngày Tham Gia</th>
							<th className="px-6 py-4 text-center">Hành Động</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{loading ? (
							<tr>
								<td
									colSpan="5"
									className="text-center py-12">
									<Loader2 className="animate-spin inline w-8 h-8 text-orange-600" />
								</td>
							</tr>
						) : (
							users.map((user) => (
								<tr
									key={user._id}
									className="hover:bg-gray-50 transition">
									<td className="px-6 py-4 flex items-center space-x-3">
										<div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
											{user.name.charAt(0).toUpperCase()}
										</div>
										<span className="font-bold text-gray-900">
											{user.name}
										</span>
									</td>
									<td className="px-6 py-4 space-y-1">
										<div className="flex items-center text-gray-600">
											<Mail
												size={14}
												className="mr-2"
											/>{" "}
											{user.email}
										</div>
										<div className="flex items-center text-gray-600">
											<Phone
												size={14}
												className="mr-2"
											/>{" "}
											{user.phone || "Chưa cập nhật"}
										</div>
									</td>
									<td className="px-6 py-4 text-center">
										<span
											className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase ${user.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"}`}>
											{user.role === "admin" ? (
												<Shield
													size={12}
													className="mr-1"
												/>
											) : (
												<User
													size={12}
													className="mr-1"
												/>
											)}
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4 text-gray-500">
										{new Date(
											user.createdAt,
										).toLocaleDateString("vi-VN")}
									</td>
									<td className="px-6 py-4 text-center space-x-2">
										{/* Nút Đổi quyền */}
										<button
											onClick={() =>
												handleRoleChange(user)
											}
											title={
												user.role === "admin"
													? "Hạ quyền xuống User"
													: "Cấp quyền Admin"
											}
											className="text-blue-600 hover:text-blue-800 p-2 bg-blue-50 rounded transition">
											<Shield size={16} />
										</button>
										{/* Nút Xóa (Ẩn nếu là admin để tránh tự xóa mình) */}
										{user.role !== "admin" && (
											<button
												onClick={() =>
													handleDeleteUser(user._id)
												}
												title="Xóa tài khoản"
												className="text-red-600 hover:text-red-800 p-2 bg-red-50 rounded transition">
												<Trash2 size={16} />
											</button>
										)}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
				{users.length === 0 && !loading && (
					<div className="text-center py-10 text-gray-500">
						Không tìm thấy dữ liệu.
					</div>
				)}
			</div>

			{/* Tích hợp Phân trang */}
			<div className="p-4 border-t border-gray-100">
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>
		</div>
	);
};

export default AdminUsers;
