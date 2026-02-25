import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import Components Layout
import {
	PrivateRoute,
	PublicRoute,
	AdminRoute,
} from "./components/AuthWrapper";
import MainLayout from "./components/MainLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ScrollToTop from "./components/ScrollToTop";

// Import Pages
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderDetail from "./pages/OrderDetail";
import OrderHistory from "./pages/OrderHistory";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Policy from "./pages/Policy";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProductForm from "./pages/admin/AdminProductForm";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminBrands from "./pages/admin/AdminBrands";

function App() {
	return (
		<BrowserRouter>
			{/* Hiển thị thông báo Toast ở góc trên */}
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>

			{/* Scroll lên đầu trang khi chuyển route */}
			<ScrollToTop />

			<Routes>
				{/* --- KHU VỰC 1: AUTHENTICATION (Không có Header/Footer) --- */}
				{/* Nếu đã đăng nhập thì tự động đá về Home, chưa thì cho vào Login/Register */}
				<Route element={<PublicRoute />}>
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/register"
						element={<Register />}
					/>
				</Route>

				{/* --- KHU VỰC 2: MAIN APP (Có Header/Footer) --- */}
				<Route element={<MainLayout />}>
					{/* Public Routes (Ai cũng xem được) */}
					<Route
						path="/"
						element={<Home />}
					/>
					<Route
						path="/about"
						element={<About />}
					/>
					<Route
						path="/contact"
						element={<Contact />}
					/>
					<Route
						path="/blog"
						element={<Blog />}
					/>
					<Route
						path="/policy"
						element={<Policy />}
					/>
					<Route
						path="/shop"
						element={<Shop />}
					/>
					<Route
						path="/product/:slug"
						element={<ProductDetail />}
					/>

					{/* Private Routes (Phải đăng nhập mới xem được) */}
					{/* Nếu chưa đăng nhập sẽ bị đá về Login */}
					<Route element={<PrivateRoute />}>
						<Route
							path="/cart"
							element={<Cart />}
						/>
						<Route
							path="/checkout"
							element={<Checkout />}
						/>
						<Route
							path="/my-orders"
							element={<OrderHistory />}
						/>
						<Route
							path="/order/:id"
							element={<OrderDetail />}
						/>
						<Route
							path="/profile"
							element={<Profile />}
						/>
					</Route>
				</Route>

				{/* --- KHU VỰC 3: ADMIN (Có Header/Footer) --- */}
				<Route element={<AdminRoute />}>
					<Route
						path="/admin"
						element={<AdminLayout />}>
						<Route
							index
							element={<Dashboard />}
						/>
						<Route
							path="dashboard"
							element={<Dashboard />}
						/>
						<Route
							path="orders"
							element={<AdminOrders />}
						/>
						<Route
							path="users"
							element={<AdminUsers />}
						/>{" "}
						{/* Route Quản lý KH */}
						{/* Routes Quản lý Sản phẩm */}
						<Route
							path="products"
							element={<AdminProducts />}
						/>
						<Route
							path="products/new"
							element={<AdminProductForm />}
						/>{" "}
						{/* Form Thêm */}
						<Route
							path="products/edit/:slug"
							element={<AdminProductForm />}
						/>
						<Route
							path="categories"
							element={<AdminCategories />}
						/>
						<Route
							path="brands"
							element={<AdminBrands />}
						/>
					</Route>
				</Route>

				{/* --- KHU VỰC 4: CATCH ALL (404) --- */}
				<Route
					path="*"
					element={<NotFound />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
