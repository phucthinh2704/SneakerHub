const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Brand = require("../models/Brand");

// Khởi tạo SDK với API Key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
	try {
		const { message, chatHistory } = req.body;

		if (!message) {
			return res
				.status(400)
				.json({ success: false, message: "Vui lòng nhập tin nhắn" });
		}

		// 1. TRUY XUẤT ĐA DẠNG DỮ LIỆU TỪ DATABASE (Chạy song song để tối ưu tốc độ)
		const [products, categories, brands] = await Promise.all([
			Product.find({ isPublished: true }).select(
				"name price discountPrice variants.color variants.price",
			),
			Category.find({}).select("name"),
			Brand.find({ isActive: true }).select("name"),
		]);

		// 2. FORMAT DỮ LIỆU ĐỂ ĐƯA CHO AI ĐỌC
		const categoryList = categories.map((c) => c.name).join(", ");
		const brandList = brands.map((b) => b.name).join(", ");

		const productListText = products
			.map((p) => {
				// Trường hợp 1: Sản phẩm có phân loại màu sắc (Variants)
				if (p.variants && p.variants.length > 0) {
					const variantDetails = p.variants
						.map((v) => {
							// Ưu tiên lấy giá riêng của variant.
							// Nếu variant không điền giá, thì fallback về giá KM hoặc giá gốc ở ngoài.
							const priceToShow =
								v.price || p.discountPrice || p.price;
							return `Màu ${v.color} (${priceToShow}đ)`;
						})
						.join(", ");

					return `- ${p.name}:\n    + Các phiên bản: ${variantDetails}`;
				}

				// Trường hợp 2: Sản phẩm không có phân loại màu (Đề phòng data cũ)
				else {
					const priceToShow = p.discountPrice || p.price;
					return `- ${p.name}: ${priceToShow}đ`;
				}
			})
			.join("\n");

		// 3. TẠO SYSTEM INSTRUCTION (Nhồi nhét "não" cho Chatbot)
		const systemInstruction = `
        Bạn là "ShoeBot", trợ lý ảo tư vấn bán hàng chuyên nghiệp, nhiệt tình và lịch sự của hệ thống cửa hàng giày dép của chúng tôi.
        
        TÀI NGUYÊN CỦA CỬA HÀNG:
        - Các thương hiệu đang bán: ${brandList}
        - Các danh mục sản phẩm: ${categoryList}
        - Danh sách một số sản phẩm nổi bật đang có:
        ${productListText}
        
        CHÍNH SÁCH CỬA HÀNG (QUAN TRỌNG):
        - Phương thức thanh toán: Hỗ trợ thanh toán khi nhận hàng (COD), chuyển khoản ngân hàng (Banking) và Paypal.
        - Giao hàng: Giao hàng toàn quốc. Thời gian giao từ 2-4 ngày làm việc.
        - Đổi trả: Hỗ trợ đổi size trong vòng 7 ngày nếu giày chưa qua sử dụng và còn nguyên tem mác.
        - Đánh giá: Khách hàng chỉ có thể đánh giá sản phẩm sau khi đã nhận hàng thành công (Trạng thái đơn hàng là Delivered).

        NHIỆM VỤ VÀ QUY TẮC CỦA BẠN:
        1. Trả lời ngắn gọn, súc tích, định dạng dễ nhìn (dùng bullet point hoặc in đậm nếu cần).
        2. Nếu khách hỏi sản phẩm có trong danh sách, hãy báo giá chính xác. Nếu khách hỏi sản phẩm không có trong danh sách trên, hãy xin lỗi và gợi ý họ tìm kiếm trên thanh công cụ của website vì kho hàng cập nhật liên tục.
        3. Nếu khách hỏi về size, hãy báo khách hàng chọn trực tiếp ở trang chi tiết sản phẩm vì kho size luôn thay đổi.
        4. KHÔNG ĐƯỢC bịa đặt sản phẩm, giá cả hay chính sách không có ở trên.
        5. Nếu khách hỏi các vấn đề không liên quan đến giày dép, thời trang, mua sắm hoặc cửa hàng (ví dụ: code, toán học, chính trị), hãy từ chối khéo léo và đưa cuộc hội thoại về lại chủ đề bán hàng.
        `;

		// 4. GỌI GEMINI API
		const model = genAI.getGenerativeModel({
			model: "gemini-2.5-flash",
			systemInstruction: systemInstruction,
			generationConfig: {
				temperature: 0.2, // Giảm nhiệt độ để AI trả lời bám sát sự thật (không sáng tạo bừa)
			},
		});

		const chat = model.startChat({
			history: chatHistory || [],
		});

		const result = await chat.sendMessage(message);
		const response = await result.response;
		const text = response.text();

		res.json({ success: true, reply: text });
	} catch (error) {
		console.error("Gemini Error:", error);
		res.status(500).json({
			success: false,
			message: "Lỗi hệ thống Chatbot",
		});
	}
};

module.exports = { handleChat };
