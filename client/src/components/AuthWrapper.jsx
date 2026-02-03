// src/components/AuthWrapper.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

/**
 * 1. PublicRoute: Dùng cho Login, Register
 * - Nếu đã có token (đã đăng nhập) => Chuyển hướng về trang chủ ("/")
 * - Nếu chưa => Cho phép hiển thị nội dung (Outlet hoặc children)
 */
export const PublicRoute = ({ children }) => {
	const { isLoggedIn } = useSelector((state) => state.auth);

	if (isLoggedIn) {
		// replace={true} để người dùng không bấm Back quay lại trang login được
		return (
			<Navigate
				to="/"
				replace={true}
			/>
		);
	}

	// Nếu chưa đăng nhập, render component con (Login/Register)
	return children ? children : <Outlet />;
};

/**
 * 2. PrivateRoute: Dùng cho Profile, Cart, Checkout...
 * - Nếu chưa có token => Chuyển hướng về Login
 * - Nếu có => Cho phép hiển thị
 */
export const PrivateRoute = () => {
	// Lấy trạng thái đăng nhập từ Redux
	const { isLoggedIn } = useSelector((state) => state.auth);

	return isLoggedIn ? (
		<Outlet />
	) : (
		<Navigate
			to="/login"
			replace
		/>
	);
};
