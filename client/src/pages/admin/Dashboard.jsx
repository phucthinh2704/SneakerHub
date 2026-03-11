import {
	ArrowUpRight,
	Calendar,
	Loader2,
	Package,
	ShoppingBag,
	TrendingUp,
	Users
} from "lucide-react";
import { useEffect, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { apiGetAllOrdersForAdmin } from "../../api/admin";

const STATUS_COLORS = {
	Delivered: "#c2784d",
	Pending: "#e8b84b",
	Shipping: "#5ecbc8",
	Cancelled: "#e05c5c",
};

const Dashboard = () => {
	const [allOrders, setAllOrders] = useState([]);
	const [timeFilter, setTimeFilter] = useState("30");
	const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0 });
	const [revenueData, setRevenueData] = useState([]);
	const [statusData, setStatusData] = useState([]);
	const [topProductsData, setTopProductsData] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await apiGetAllOrdersForAdmin();
				if (res.success) {
					setAllOrders(res.result);
					processData(res.result, "30");
				}
			} catch (error) {
				console.error("Lỗi lấy dữ liệu dashboard", error);
			} finally {
				setLoading(false);
			}
		};
		fetchStats();
	}, []);

	useEffect(() => {
		if (allOrders.length > 0) processData(allOrders, timeFilter);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [timeFilter]);

	const processData = (orders, days) => {
		const now = new Date();
		const filteredOrders = orders.filter((o) => {
			if (days === "all") return true;
			const diffDays = Math.ceil(
				Math.abs(now - new Date(o.createdAt)) / (1000 * 60 * 60 * 24),
			);
			return diffDays <= parseInt(days);
		});

		const totalRevenue = filteredOrders
			.filter((o) => o.status === "Delivered")
			.reduce((sum, o) => sum + o.totalPrice, 0);
		setStats({ totalRevenue, totalOrders: filteredOrders.length });

		const revMap = {};
		filteredOrders.forEach((o) => {
			if (o.status === "Delivered") {
				const d = new Date(o.createdAt);
				const dateStr = `${d.getDate()}/${d.getMonth() + 1}`;
				revMap[dateStr] = (revMap[dateStr] || 0) + o.totalPrice;
			}
		});
		setRevenueData(
			Object.keys(revMap)
				.map((date) => ({ date, revenue: revMap[date] }))
				.reverse()
				.slice(-15),
		);

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

		const productMap = {};
		filteredOrders.forEach((o) => {
			if (o.status === "Delivered") {
				o.orderItems?.forEach((item) => {
					const shortName =
						item.name.length > 20
							? item.name.substring(0, 20) + "…"
							: item.name;
					productMap[shortName] =
						(productMap[shortName] || 0) + item.qty;
				});
			}
		});
		setTopProductsData(
			Object.keys(productMap)
				.map((name) => ({ name, qty: productMap[name] }))
				.sort((a, b) => b.qty - a.qty)
				.slice(0, 5),
		);
	};

	const formatCurrency = (value) =>
		new Intl.NumberFormat("vi-VN", {
			style: "currency",
			currency: "VND",
		}).format(value);

	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length)
			return (
				<div className="bg-[#1c1f2e] border border-[#2e3245] rounded-xl px-4 py-3 shadow-xl">
					<p className="text-[#c2784d] font-bold text-xs mb-1">
						{label}
					</p>
					<p className="text-white text-sm font-semibold">
						{formatCurrency(payload[0].value)}
					</p>
				</div>
			);
		return null;
	};

	if (loading)
		return (
			<div className="flex h-[80vh] items-center justify-center">
				<div className="flex flex-col items-center gap-3">
					<Loader2
						className="animate-spin text-[#c2784d]"
						size={36}
					/>
					<p
						className="text-[#8a8fa8] text-sm tracking-widest uppercase"
						style={{ fontFamily: "'DM Sans',sans-serif" }}>
						Đang tải...
					</p>
				</div>
			</div>
		);

	return (
		<>
			<style>{`
			@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
				.adm-root { font-family:'DM Sans',sans-serif; }
				.adm-heading { font-family:'Syne',sans-serif; }
				.adm-card { transition: transform .2s, box-shadow .2s; }
				.adm-card:hover { transform: translateY(-2px); }
				.adm-fade { animation: admFade .4s ease both; }
				.adm-fade-1 { animation-delay:.05s; }
				.adm-fade-2 { animation-delay:.1s; }
				.adm-fade-3 { animation-delay:.15s; }
				@keyframes admFade { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
			`}</style>

			<div className="adm-root space-y-6 pb-10">
				{/* ── Header ── */}
				<div className="adm-fade flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div>
						<p className="text-[10px] font-bold tracking-[.25em] uppercase text-[#c2784d] mb-1">
							SoleStore Admin
						</p>
						<h2 className="adm-heading text-[#1a1914] font-bold text-2xl">
							Tổng quan hệ thống
						</h2>
					</div>
					<div className="flex items-center gap-2 bg-white border border-[#e8ddd4] rounded-xl px-4 py-2.5 shadow-sm">
						<Calendar
							size={15}
							className="text-[#c2784d]"
						/>
						<select
							value={timeFilter}
							onChange={(e) => setTimeFilter(e.target.value)}
							className="text-sm font-semibold text-[#3a3020] bg-transparent outline-none cursor-pointer">
							<option value="7">7 ngày qua</option>
							<option value="30">30 ngày qua</option>
							<option value="90">3 tháng qua</option>
							<option value="all">Toàn thời gian</option>
						</select>
					</div>
				</div>

				{/* ── Stat Cards ── */}
				<div className="adm-fade adm-fade-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{[
						{
							Icon: TrendingUp,
							label: "Doanh thu",
							value: formatCurrency(stats.totalRevenue),
							sub: "Đơn đã giao",
							accent: "#c2784d",
							bg: "from-[#fff3eb] to-[#fdf8f4]",
						},
						{
							Icon: ShoppingBag,
							label: "Tổng đơn hàng",
							value: `${stats.totalOrders}`,
							sub: "Đơn hàng",
							accent: "#5b8dee",
							bg: "from-[#eff4ff] to-[#f6f8ff]",
							linkTo: "/admin/orders",
						},
						{
							Icon: Package,
							label: "Sản phẩm",
							value: "Quản lý",
							sub: "Kho hàng",
							accent: "#5ecbc8",
							bg: "from-[#effffe] to-[#f5ffff]",
							linkTo: "/admin/products",
						},
						{
							Icon: Users,
							label: "Khách hàng",
							value: "Quản lý",
							sub: "Tài khoản",
							accent: "#a87fd4",
							bg: "from-[#f6f0ff] to-[#faf7ff]",
							linkTo: "/admin/users",
						},
					].map(
						(
							// eslint-disable-next-line no-unused-vars
							{ Icon, label, value, sub, accent, bg, linkTo },
							i,
						) => {
							const El = linkTo ? "a" : "div";
							return (
								<El
									key={i}
									href={linkTo}
									className={`adm-card bg-linear-to-br ${bg} border border-white rounded-2xl p-5 cursor-${linkTo ? "pointer" : "default"}`}
									style={{
										boxShadow: "0 2px 16px rgba(0,0,0,.05)",
									}}>
									<div className="flex items-start justify-between mb-4">
										<div
											className="w-10 h-10 rounded-xl flex items-center justify-center"
											style={{
												background: `${accent}18`,
											}}>
											<Icon
												size={18}
												style={{ color: accent }}
											/>
										</div>
										{linkTo && (
											<ArrowUpRight
												size={14}
												style={{ color: accent }}
												className="mt-1 opacity-60"
											/>
										)}
									</div>
									<p className="text-xs font-semibold text-[#9a8878] mb-1">
										{label}
									</p>
									<p className="adm-heading text-[#1a1914] text-xl font-bold leading-tight">
										{value}
									</p>
									<p className="text-[11px] text-[#b8a898] mt-1">
										{sub}
									</p>
								</El>
							);
						},
					)}
				</div>

				{/* ── Charts row 1 ── */}
				<div className="adm-fade adm-fade-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* Revenue Line Chart */}
					<div
						className="lg:col-span-2 bg-white border border-[#f0e5d8] rounded-2xl p-6"
						style={{
							boxShadow: "0 2px 16px rgba(194,120,77,.06)",
						}}>
						<div className="flex items-center justify-between mb-6">
							<div>
								<h3 className="adm-heading text-[#1a1914] font-bold text-base">
									Biểu đồ doanh thu
								</h3>
								<p className="text-xs text-[#a08070] mt-0.5">
									Dựa trên đơn đã giao thành công
								</p>
							</div>
							<div className="flex items-center gap-1.5 bg-[#fff3eb] rounded-lg px-3 py-1.5">
								<span className="w-2 h-2 rounded-full bg-[#c2784d]" />
								<span className="text-[11px] font-bold text-[#c2784d]">
									Doanh thu
								</span>
							</div>
						</div>
						<div className="h-64 w-full">
							{revenueData.length > 0 ? (
								<ResponsiveContainer
									width="100%"
									height="100%">
									<LineChart
										data={revenueData}
										margin={{
											top: 5,
											right: 10,
											bottom: 5,
											left: 0,
										}}>
										<defs>
											<linearGradient
												id="revGrad"
												x1="0"
												y1="0"
												x2="0"
												y2="1">
												<stop
													offset="5%"
													stopColor="#c2784d"
													stopOpacity={0.15}
												/>
												<stop
													offset="95%"
													stopColor="#c2784d"
													stopOpacity={0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="3 3"
											vertical={false}
											stroke="#f0e8e0"
										/>
										<XAxis
											dataKey="date"
											axisLine={false}
											tickLine={false}
											tick={{
												fill: "#a08070",
												fontSize: 11,
											}}
											dy={8}
										/>
										<YAxis
											tickFormatter={(v) =>
												`${(v / 1000000).toFixed(0)}tr`
											}
											axisLine={false}
											tickLine={false}
											tick={{
												fill: "#a08070",
												fontSize: 11,
											}}
											dx={-4}
										/>
										<RechartsTooltip
											content={<CustomTooltip />}
										/>
										<Line
											type="monotone"
											dataKey="revenue"
											stroke="#c2784d"
											strokeWidth={2.5}
											dot={{
												r: 3,
												fill: "#c2784d",
												strokeWidth: 0,
											}}
											activeDot={{
												r: 5,
												fill: "#c2784d",
											}}
										/>
									</LineChart>
								</ResponsiveContainer>
							) : (
								<div className="h-full flex items-center justify-center text-[#c0b0a0] text-sm">
									Không có dữ liệu
								</div>
							)}
						</div>
					</div>

					{/* Status Pie Chart */}
					<div
						className="bg-white border border-[#f0e5d8] rounded-2xl p-6"
						style={{
							boxShadow: "0 2px 16px rgba(194,120,77,.06)",
						}}>
						<h3 className="adm-heading text-[#1a1914] font-bold text-base mb-1">
							Trạng thái đơn
						</h3>
						<p className="text-xs text-[#a08070] mb-4">
							Phân bổ theo loại
						</p>
						<div className="h-64 w-full">
							{statusData.length > 0 ? (
								<ResponsiveContainer
									width="100%"
									height="100%">
									<PieChart>
										<Pie
											data={statusData}
											cx="50%"
											cy="42%"
											innerRadius={52}
											outerRadius={78}
											paddingAngle={4}
											dataKey="value">
											{statusData.map((entry, i) => (
												<Cell
													key={`cell-${i}`}
													fill={
														STATUS_COLORS[
															entry.name
														] || "#c0b0a0"
													}
												/>
											))}
										</Pie>
										<RechartsTooltip
											formatter={(v) => [
												`${v} đơn`,
												"Số lượng",
											]}
											contentStyle={{
												borderRadius: "10px",
												border: "none",
												boxShadow:
													"0 4px 20px rgba(0,0,0,.1)",
												fontFamily:
													"'DM Sans',sans-serif",
												fontSize: 12,
											}}
										/>
										<Legend
											verticalAlign="bottom"
											height={40}
											iconType="circle"
											iconSize={8}
											formatter={(v) => (
												<span
													style={{
														color: "#6a5a4a",
														fontSize: 11,
														fontWeight: 600,
													}}>
													{v}
												</span>
											)}
										/>
									</PieChart>
								</ResponsiveContainer>
							) : (
								<div className="h-full flex items-center justify-center text-[#c0b0a0] text-sm">
									Không có dữ liệu
								</div>
							)}
						</div>
					</div>
				</div>

				{/* ── Top Products Bar Chart ── */}
				<div
					className="adm-fade adm-fade-3 bg-white border border-[#f0e5d8] rounded-2xl p-6"
					style={{ boxShadow: "0 2px 16px rgba(194,120,77,.06)" }}>
					<div className="flex items-center justify-between mb-6">
						<div>
							<h3 className="adm-heading text-[#1a1914] font-bold text-base">
								Top 5 sản phẩm bán chạy
							</h3>
							<p className="text-xs text-[#a08070] mt-0.5">
								Tính từ đơn hàng đã giao thành công
							</p>
						</div>
					</div>
					<div className="h-64 w-full">
						{topProductsData.length > 0 ? (
							<ResponsiveContainer
								width="100%"
								height="100%">
								<BarChart
									data={topProductsData}
									layout="vertical"
									margin={{
										top: 0,
										right: 30,
										left: 0,
										bottom: 0,
									}}>
									<CartesianGrid
										strokeDasharray="3 3"
										horizontal={false}
										stroke="#f0e8e0"
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
										width={160}
										tick={{
											fill: "#5a4a3a",
											fontSize: 12,
											fontWeight: 500,
										}}
									/>
									<RechartsTooltip
										formatter={(v) => [
											`${v} đôi`,
											"Đã bán",
										]}
										cursor={{
											fill: "rgba(194,120,77,.06)",
										}}
										contentStyle={{
											borderRadius: "10px",
											border: "none",
											boxShadow:
												"0 4px 20px rgba(0,0,0,.1)",
											fontFamily: "'DM Sans',sans-serif",
											fontSize: 12,
										}}
									/>
									<Bar
										dataKey="qty"
										radius={[0, 6, 6, 0]}
										barSize={24}>
										{topProductsData.map((_, i) => (
											<Cell
												key={`cell-${i}`}
												fill={
													[
														"#c2784d",
														"#d4925e",
														"#e0a870",
														"#ebbf8a",
														"#f5d9b0",
													][i]
												}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						) : (
							<div className="h-full flex items-center justify-center text-[#c0b0a0] text-sm">
								Không có dữ liệu bán hàng
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Dashboard;
