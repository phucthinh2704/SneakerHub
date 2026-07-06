import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import Chatbot from "./Chatbot";

const MainLayout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			{/* flex-1 giúp main đẩy footer xuống dưới cùng nếu nội dung ngắn */}
			<main className="flex-1 bg-gray-50">
				<Outlet />
			</main>
			<Footer />
			<Chatbot />
		</div>
	);
};
export default MainLayout;
