import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import Components Layout
import { PrivateRoute, PublicRoute } from "./components/AuthWrapper";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./components/MainLayout";

// Import Pages
import About from "./pages/About";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OrderHistory from "./pages/OrderHistory";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Shop from "./pages/Shop";

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
							path="/profile"
							element={<Profile />}
						/>
					</Route>
				</Route>

				{/* --- KHU VỰC 3: CATCH ALL (404) --- */}
				<Route
					path="*"
					element={<NotFound />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
