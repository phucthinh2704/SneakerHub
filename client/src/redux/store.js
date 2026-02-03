import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Mặc định là localStorage
import authReducer from "./authSlice";

// 1. Cấu hình persist
const persistConfig = {
	key: "sneakerhub ", // Key lưu trong localStorage
	storage,
	whitelist: ["auth"], // Chỉ muốn lưu slice 'auth' (nếu sau này có 'product' thì ko cần lưu)
	// blacklist: ['something'] // Nếu muốn loại trừ
};

const rootReducer = combineReducers({
	auth: authReducer,
	// cart: cartReducer, // Sau này bạn có thể lưu giỏ hàng vào đây cực tiện
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 2. Tạo store
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false, // Tắt check này để tránh lỗi với redux-persist
		}),
});

export const persistor = persistStore(store);
