import axiosClient from "../config/axios";

export const sendChatMessage = async (message, chatHistory) => {
	return await axiosClient.post("/chat", { message, chatHistory });
};
