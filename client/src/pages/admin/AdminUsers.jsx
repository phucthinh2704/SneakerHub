import {
	Loader2,
	Mail,
	Phone,
	Search,
	Shield,
	Trash2,
	User,
	ChevronDown,
	UserCog,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
	apiDeleteUser,
	apiGetAllUsers,
	apiUpdateUserRole,
} from "../../api/admin";
import Pagination from "../../components/Pagination";

const ROLE_CFG = {
	admin: {
		label: "Admin",
		cls: "bg-[#fff0e8] text-[#c2784d] border-[#f0ddd0]",
		dot: "bg-[#c2784d]",
	},
	user: {
		label: "User",
		cls: "bg-[#f0f4ff] text-[#5b8dee] border-[#d0dfff]",
		dot: "bg-[#5b8dee]",
	},
};

const AdminUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [searchTerm, setSearchTerm] = useState("");
	const [sort, setSort] = useState("newest");

	useEffect(() => {
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

	const handleRoleChange = async (user) => {
		const newRole = user.role === "admin" ? "user" : "admin";
		const result = await Swal.fire({
			title: `<span style="font-family:'Syne',sans-serif;font-size:1.1rem">Thay đổi quyền hạn?</span>`,
			html: `<span style="font-family:'DM Sans',sans-serif;font-size:.9rem;color:#6a5a4a">Chuyển <b>${user.name}</b> thành <b>${newRole.toUpperCase()}</b>?</span>`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#c2784d",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Xác nhận",
			cancelButtonText: "Hủy",
			customClass: {
				popup: "rounded-2xl",
				confirmButton: "rounded-xl font-bold",
				cancelButton: "rounded-xl font-bold",
			},
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

	const handleDeleteUser = async (id, name) => {
		const result = await Swal.fire({
			title: `<span style="font-family:'Syne',sans-serif;font-size:1.1rem">Xóa tài khoản?</span>`,
			html: `<span style="font-family:'DM Sans',sans-serif;font-size:.9rem;color:#6a5a4a">Tài khoản <b>${name}</b> sẽ bị xóa vĩnh viễn.</span>`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#ef4444",
			cancelButtonColor: "#9ca3af",
			confirmButtonText: "Xóa tài khoản",
			cancelButtonText: "Hủy",
			customClass: {
				popup: "rounded-2xl",
				confirmButton: "rounded-xl font-bold",
				cancelButton: "rounded-xl font-bold",
			},
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
		<>
			<style>{`
			@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.adm-root { font-family:'DM Sans',sans-serif; }
				.adm-heading { font-family:'Syne',sans-serif; }
				.adm-row { transition: background .15s; }
				.adm-row:hover { background: #fdf9f6; }
				.adm-fade { animation: admFadeUp .35s ease both; }
				@keyframes admFadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
			`}</style>

			<div className="adm-root adm-fade">
				{/* ── Header ── */}
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
					<div>
						<p className="text-[10px] font-bold tracking-[.2em] uppercase text-[#c2784d] mb-0.5">
							SoleStore Admin
						</p>
						<h2 className="adm-heading text-[#1a1914] text-2xl font-bold">
							Quản lý Khách hàng
						</h2>
					</div>
					<div className="flex items-center gap-2 bg-[#fff3eb] border border-[#f0ddd0] rounded-xl px-3.5 py-2">
						<UserCog
							size={14}
							className="text-[#c2784d]"
						/>
						<span className="text-xs font-bold text-[#c2784d]">
							{users.length} tài khoản
						</span>
					</div>
				</div>

				<div
					className="bg-white border border-[#f0e5d8] rounded-2xl overflow-hidden"
					style={{ boxShadow: "0 2px 20px rgba(194,120,77,.07)" }}>
					{/* ── Toolbar ── */}
					<div className="px-6 py-4 border-b border-[#f5ede4] flex flex-col md:flex-row gap-3">
						<div className="relative flex-1">
							<Search
								className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c0a890]"
								size={15}
							/>
							<input
								type="text"
								placeholder="Tìm theo tên, email..."
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setPage(1);
								}}
								className="w-full pl-10 pr-4 py-2.5 bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl text-sm text-[#3a2818] placeholder-[#c0a890] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15 transition"
							/>
						</div>
						<div className="relative">
							<select
								value={sort}
								onChange={(e) => {
									setSort(e.target.value);
									setPage(1);
								}}
								className="appearance-none bg-[#fdf8f4] border border-[#e8d8cc] rounded-xl pl-4 pr-9 py-2.5 text-sm font-medium text-[#3a2818] outline-none focus:border-[#c2784d] focus:ring-2 focus:ring-[#c2784d]/15 transition cursor-pointer">
								<option value="newest">Mới nhất</option>
								<option value="oldest">Cũ nhất</option>
								<option value="name_asc">Tên (A–Z)</option>
								<option value="name_desc">Tên (Z–A)</option>
							</select>
							<ChevronDown
								size={13}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a08070] pointer-events-none"
							/>
						</div>
					</div>

					{/* ── Table ── */}
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="bg-[#fdf8f4] border-b border-[#f5ede4]">
									{[
										"Khách hàng",
										"Liên hệ",
										"Vai trò",
										"Ngày tham gia",
										"Hành động",
									].map((h, i) => (
										<th
											key={h}
											className={`px-5 py-3.5 text-[10px] font-bold tracking-[.15em] uppercase text-[#a08070] ${i >= 2 ? "text-center" : "text-left"}`}>
											{h}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{loading ? (
									<tr>
										<td
											colSpan="5"
											className="text-center py-16">
											<Loader2
												className="animate-spin inline text-[#c2784d]"
												size={28}
											/>
										</td>
									</tr>
								) : (
									users.map((user) => {
										const role =
											ROLE_CFG[user.role] ||
											ROLE_CFG.user;
										const initials = user.name
											.split(" ")
											.map((n) => n[0])
											.slice(0, 2)
											.join("")
											.toUpperCase();
										return (
											<tr
												key={user._id}
												className="adm-row border-b border-[#f8f0e8] last:border-0">
												<td className="px-5 py-4">
													<div className="flex items-center gap-3">
														<div className="w-9 h-9 rounded-xl bg-[#fff0e8] border border-[#f0ddd0] flex items-center justify-center text-[#c2784d] text-xs font-bold shrink-0">
															{initials}
														</div>
														<div>
															<p className="font-semibold text-[#1a1914] text-sm">
																{user.name}
															</p>
														</div>
													</div>
												</td>
												<td className="px-5 py-4">
													<div className="space-y-1">
														<div className="flex items-center gap-1.5 text-[#6a5a4a] text-xs">
															<Mail
																size={11}
																className="text-[#a08070]"
															/>{" "}
															{user.email}
														</div>
														<div className="flex items-center gap-1.5 text-[#6a5a4a] text-xs">
															<Phone
																size={11}
																className="text-[#a08070]"
															/>{" "}
															{user.phone ||
																"Chưa cập nhật"}
														</div>
													</div>
												</td>
												<td className="px-5 py-4 text-center">
													<span
														className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${role.cls}`}>
														<span
															className={`w-1.5 h-1.5 rounded-full ${role.dot}`}
														/>
														{role.label}
													</span>
												</td>
												<td className="px-5 py-4 text-center text-xs text-[#9a8878]">
													{new Date(
														user.createdAt,
													).toLocaleDateString(
														"vi-VN",
													)}
												</td>
												<td className="px-5 py-4">
													<div className="flex items-center justify-center gap-2">
														<button
															onClick={() =>
																handleRoleChange(
																	user,
																)
															}
															title={
																user.role ===
																"admin"
																	? "Hạ quyền User"
																	: "Cấp quyền Admin"
															}
															className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-[#eff4ff] text-[#5b8dee] border border-[#d0dfff] rounded-lg hover:bg-[#dde8ff] transition">
															<Shield size={12} />
															{user.role ===
															"admin"
																? "Hạ quyền"
																: "Cấp Admin"}
														</button>
														{user.role !==
															"admin" && (
															<button
																onClick={() =>
																	handleDeleteUser(
																		user._id,
																		user.name,
																	)
																}
																title="Xóa tài khoản"
																className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-red-50 text-red-500 border border-red-200 rounded-lg hover:bg-red-100 transition">
																<Trash2
																	size={12}
																/>
															</button>
														)}
													</div>
												</td>
											</tr>
										);
									})
								)}
							</tbody>
						</table>
						{users.length === 0 && !loading && (
							<div className="text-center py-14">
								<User
									size={28}
									className="text-[#e0d0c0] mx-auto mb-3"
								/>
								<p className="text-[#b0a090] text-sm">
									Không tìm thấy tài khoản nào.
								</p>
							</div>
						)}
					</div>

					{/* ── Pagination ── */}
					<div className="px-5 py-4 border-t border-[#f5ede4]">
						<Pagination
							currentPage={page}
							totalPages={totalPages}
							onPageChange={setPage}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default AdminUsers;
