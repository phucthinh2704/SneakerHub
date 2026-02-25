import React, { useEffect, useState } from "react";
import {
	DollarSign,
	ShoppingBag,
	Package,
	Users,
	Loader2,
	Calendar,
} from "lucide-react";
import { apiGetAllOrdersForAdmin } from "../../api/admin";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
	Legend,
	BarChart,
	Bar,
} from "recharts";

const Dashboard = () => {
	const [allOrders, setAllOrders] = useState([]); // Lưu toàn bộ data gốc
	const [timeFilter, setTimeFilter] = useState("30"); // Mặc định 30 ngày

	// States thống kê
	const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
	const [revenueData, setRevenueData] = useState([]);
	const [statusData, setStatusData] = useState([]);
	const [topProductsData, setTopProductsData] = useState([]); // Data biểu đồ mới

	const [loading, setLoading] = useState(true);

	const STATUS_COLORS = {
		Delivered: "#22c55e",
		Pending: "#eab308",
		Processing: "#3b82f6",
		Shipping: "#a855f7",
		Cancelled: "#ef4444",
	};

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await apiGetAllOrdersForAdmin();
				if (res.success) {
					setAllOrders(res.result);
					processData(res.result, "30"); // Xử lý lần đầu với 30 ngày
				}
			} catch (error) {
				console.error("Lỗi lấy dữ liệu dashboard", error);
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	// Lắng nghe thay đổi bộ lọc
	useEffect(() => {
		if (allOrders.length > 0) {
			processData(allOrders, timeFilter);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeFilter]);

	// HÀM XỬ LÝ DỮ LIỆU DỰA TRÊN THỜI GIAN
	const processData = (orders, days) => {
		const now = new Date();
		// Lọc đơn hàng theo thời gian
		const filteredOrders = orders.filter((o) => {
			if (days === "all") return true;
			const orderDate = new Date(o.createdAt);
			const diffTime = Math.abs(now - orderDate);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			return diffDays <= parseInt(days);
		});

		// 1. TÍNH TỔNG QUAN
		const totalRevenue = filteredOrders
			.filter((o) => o.status === "Delivered")
			.reduce((sum, o) => sum + o.totalPrice, 0);

		setStats({ totalRevenue, totalOrders: filteredOrders.length });

		// 2. BIỂU ĐỒ DOANH THU (Line Chart)
		const revMap = {};
		filteredOrders.forEach((o) => {
			if (o.status === "Delivered") {
				const d = new Date(o.createdAt);
				const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
				revMap[dateStr] = (revMap[dateStr] || 0) + o.totalPrice;
			}
		});
		const chartRevData = Object.keys(revMap)
			.map((date) => ({ date, revenue: revMap[date] }))
			.reverse() // Đảo mảng để ngày cũ trước
			.slice(-15); // Lấy tối đa 15 điểm
		setRevenueData(chartRevData);

		// 3. BIỂU ĐỒ TRẠNG THÁI (Pie Chart)
		const statusMap = {};
		filteredOrders.forEach((o) => {
			statusMap[o.status] = (statusMap[o.status] || 0) + 1;
		});
		setStatusData(
			Object.keys(statusMap).map((status) => ({
				name: status,
				value: statusMap[status],
			})),
		);

		// 4. BIỂU ĐỒ TOP SẢN PHẨM (Bar Chart - MỚI)
		const productMap = {};
		filteredOrders.forEach((o) => {
			if (o.status === "Delivered") {
				// Chỉ tính sản phẩm đã giao thành công
				o.orderItems?.forEach((item) => {
					// Rút gọn tên SP nếu quá dài
					const shortName =
						item.name.length > 20
							? item.name.substring(0, 20) + "..."
							: item.name;
					productMap[shortName] =
						(productMap[shortName] || 0) + item.qty;
				});
			}
		});
		const topProducts = Object.keys(productMap)
			.map((name) => ({ name, qty: productMap[name] }))
			.sort((a, b) => b.qty - a.qty) // Sắp xếp giảm dần
			.slice(0, 5); // Lấy Top 5
		setTopProductsData(topProducts);
	};

	const formatCurrency = (value) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(value);

	if (loading)
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<Loader2
					className="animate-spin text-orange-600"
					size={40}
				/>
			</div>
		);

	return (
		<div className="space-y-6 pb-10">
			{/* HEADER & FILTER */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
				<h2 className="text-2xl font-bold text-gray-800">
					Tổng quan hệ thống
				</h2>
				<div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
					<Calendar
						size={18}
						className="text-gray-500"
					/>
					<select
						value={timeFilter}
						onChange={(e) => setTimeFilter(e.target.value)}
						className="text-sm font-bold text-gray-700 bg-transparent outline-none cursor-pointer">
						<option value="7">7 ngày qua</option>
						<option value="30">30 ngày qua</option>
						<option value="90">3 tháng qua</option>
						<option value="all">Toàn thời gian</option>
					</select>
				</div>
			</div>

			{/* STAT CARDS */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					icon={
						<DollarSign
							size={28}
							className="text-green-600"
						/>
					}
					title="Tổng Doanh Thu"
					value={formatCurrency(stats.totalRevenue)}
					bgColor="bg-green-100"
				/>
				<StatCard
					icon={
						<ShoppingBag
							size={28}
							className="text-blue-600"
						/>
					}
					title="Tổng Đơn Hàng"
					value={`${stats.totalOrders} Đơn`}
					bgColor="bg-blue-100"
					linkTo="/admin/orders"
				/>
				<StatCard
					icon={
						<Package
							size={28}
							className="text-orange-600"
						/>
					}
					title="Sản Phẩm"
					value="Quản lý"
					bgColor="bg-orange-100"
					linkTo="/admin/products"
				/>
				<StatCard
					icon={
						<Users
							size={28}
							className="text-purple-600"
						/>
					}
					title="Khách Hàng"
					value="Quản lý"
					bgColor="bg-purple-100"
					linkTo="/admin/users"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
				{/* Biểu đồ Doanh Thu */}
				<div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h3 className="text-lg font-bold text-gray-800 mb-6">
						Biểu đồ Doanh thu
					</h3>
					<div className="h-80 w-full">
						{revenueData.length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height="100%">
								<LineChart
									data={revenueData}
									margin={{
										top: 5,
										right: 20,
										bottom: 5,
										left: 0,
									}}>
									<CartesianGrid
										strokeDasharray="3 3"
										vertical={false}
										stroke="#e5e7eb"
									/>
									<XAxis
										dataKey="date"
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#6b7280", fontSize: 12 }}
										dy={10}
									/>
									<YAxis
										tickFormatter={(val) =>
											`${val / 1000000}tr`
										}
										axisLine={false}
										tickLine={false}
										tick={{ fill: "#6b7280", fontSize: 12 }}
										dx={-10}
									/>
									<RechartsTooltip
										formatter={(value) => [
											formatCurrency(value),
											"Doanh thu",
										]}
										contentStyle={{
											borderRadius: "8px",
											border: "none",
											boxShadow:
												"0 4px 6px -1px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Line
										type="monotone"
										dataKey="revenue"
										stroke="#ea580c"
										strokeWidth={3}
										dot={{ r: 4, strokeWidth: 2 }}
										activeDot={{ r: 6 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						) : (
							<div className="h-full flex items-center justify-center text-gray-400">
								Không có dữ liệu
							</div>
						)}
					</div>
				</div>

				{/* Biểu đồ Trạng thái */}
				<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h3 className="text-lg font-bold text-gray-800 mb-6">
						Trạng thái Đơn hàng
					</h3>
					<div className="h-80 w-full flex flex-col items-center justify-center">
						{statusData.length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height="100%">
								<PieChart>
									<Pie
										data={statusData}
										cx="50%"
										cy="45%"
										innerRadius={60}
										outerRadius={90}
										paddingAngle={5}
										dataKey="value">
										{statusData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													STATUS_COLORS[entry.name] ||
													"#9ca3af"
												}
											/>
										))}
									</Pie>
									<RechartsTooltip
										formatter={(value) => [
											`${value} đơn`,
											"Số lượng",
										]}
										contentStyle={{
											borderRadius: "8px",
											border: "none",
											boxShadow:
												"0 4px 6px -1px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Legend
										verticalAlign="bottom"
										height={36}
										iconType="circle"
									/>
								</PieChart>
							</ResponsiveContainer>
						) : (
							<div className="text-gray-400">
								Không có dữ liệu
							</div>
						)}
					</div>
				</div>

				{/* MỚI: Biểu đồ Top Sản phẩm bán chạy */}
				<div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
					<h3 className="text-lg font-bold text-gray-800 mb-6">
						Top 5 Sản phẩm bán chạy nhất
					</h3>
					<div className="h-80 w-full">
						{topProductsData.length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height="100%">
								<BarChart
									data={topProductsData}
									margin={{
										top: 5,
										right: 30,
										left: 0,
										bottom: 5,
									}}
									layout="vertical">
									<CartesianGrid
										strokeDasharray="3 3"
										horizontal={false}
										stroke="#e5e7eb"
									/>
									<XAxis
										type="number"
										hide
									/>
									<YAxis
										dataKey="name"
										type="category"
										axisLine={false}
										tickLine={false}
										width={150}
										tick={{
											fill: "#374151",
											fontSize: 13,
											fontWeight: 500,
										}}
									/>
									<RechartsTooltip
										formatter={(value) => [
											`${value} sản phẩm`,
											"Đã bán",
										]}
										cursor={{ fill: "transparent" }}
										contentStyle={{
											borderRadius: "8px",
											border: "none",
											boxShadow:
												"0 4px 6px -1px rgb(0 0 0 / 0.1)",
										}}
									/>
									<Bar
										dataKey="qty"
										fill="#3b82f6"
										radius={[0, 4, 4, 0]}
										barSize={32}>
										{topProductsData.map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={
													[
														"#ea580c",
														"#f97316",
														"#fb923c",
														"#fdba74",
														"#fed7aa",
													][index]
												}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-full flex items-center justify-center text-gray-400">
								Không có dữ liệu bán hàng
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

const StatCard = ({ icon, title, value, bgColor, linkTo }) => {
	const CardWrapper = linkTo ? "a" : "div";
	return (
		<CardWrapper
			href={linkTo || "#"}
			className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition ${linkTo ? "hover:shadow-md hover:border-gray-300 cursor-pointer" : ""}`}>
			<div className={`p-4 rounded-full ${bgColor}`}>{icon}</div>
			<div>
				<p className="text-sm font-medium text-gray-500 mb-1">
					{title}
				</p>
				<h3 className="text-2xl font-bold text-gray-900">{value}</h3>
			</div>
		</CardWrapper>
	);
};

export default Dashboard;
