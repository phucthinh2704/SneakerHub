import React, { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../api/chat";
import ReactMarkdown from "react-markdown";

const Chatbot = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [messages, setMessages] = useState([
		{
			role: "model",
			text: "Xin chào! Mình là trợ lý ảo của cửa hàng SoleStore. Mình có thể giúp gì cho bạn?",
		},
	]);
	const [input, setInput] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const messagesEndRef = useRef(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSend = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		const userMessage = input.trim();
		setInput(""); // Xóa ô input

		// Thêm tin nhắn của user vào UI
		setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
		setIsLoading(true);

		try {
			// Định dạng lại lịch sử chat để gửi cho Gemini (bỏ tin nhắn lỗi/chào mừng mặc định nếu cần)
			const formattedHistory = messages.slice(1).map((msg) => ({
				role: msg.role === "model" ? "model" : "user",
				parts: [{ text: msg.text }],
			}));

			const res = await sendChatMessage(userMessage, formattedHistory);

			if (res.success) {
				setMessages((prev) => [
					...prev,
					{ role: "model", text: res.reply },
				]);
			} else {
				setMessages((prev) => [
					...prev,
					{
						role: "model",
						text: "Xin lỗi, mình đang gặp sự cố. Vui lòng thử lại sau nhé.",
					},
				]);
			}
		} catch (error) {
			console.error("Error sending message:", error);
			setMessages((prev) => [
				...prev,
				{ role: "model", text: "Lỗi kết nối máy chủ!" },
			]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="fixed bottom-6 right-6 z-50">
			{/* Nút bật/tắt chat */}
			{!isOpen && (
				<button
					onClick={() => setIsOpen(true)}
					className="bg-blue-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all">
					💬
				</button>
			)}

			{/* Khung chat */}
			{isOpen && (
				<div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-112.5">
					{/* Header */}
					<div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
						<h3 className="font-bold">Trợ lý ảo Gemini</h3>
						<button
							onClick={() => setIsOpen(false)}
							className="text-white hover:text-gray-200 font-bold">
							✕
						</button>
					</div>

					{/* Vùng hiển thị tin nhắn */}
					<div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
						{messages.map((msg, index) => (
							<div
								key={index}
								className={`max-w-[80%] p-3 rounded-lg text-sm ${
									msg.role === "user"
										? "bg-blue-500 text-white self-end rounded-br-none"
										: "bg-gray-200 text-gray-800 self-start rounded-bl-none"
								}`}>
								{msg.role === "user" ? (
									<div style={{ whiteSpace: "pre-wrap" }}>
										{msg.text}
									</div>
								) : (
									<ReactMarkdown>
										{msg.text}
									</ReactMarkdown>
								)}
							</div>
						))}
						{isLoading && (
							<div className="bg-gray-200 text-gray-800 self-start rounded-lg p-3 rounded-bl-none text-sm animate-pulse">
								Đang suy nghĩ...
							</div>
						)}
						<div ref={messagesEndRef} />
					</div>

					{/* Ô nhập liệu */}
					<form
						onSubmit={handleSend}
						className="border-t p-3 bg-white flex gap-2">
						<input
							type="text"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Nhập câu hỏi..."
							disabled={isLoading}
							className="flex-1 px-3 py-2 border rounded-full outline-none focus:border-blue-500 text-sm disabled:bg-gray-100"
						/>
						<button
							type="submit"
							disabled={isLoading || !input.trim()}
							className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium">
							Gửi
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Chatbot;
