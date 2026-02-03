// src/redux/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,  // Thông tin user (name, email, role...)
  token: null, // Token JWT
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action khi đăng nhập thành công
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
    },
    // Action khi đăng xuất
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      // Redux Persist sẽ tự động xóa trong localStorage khi state thay đổi
    },
    // Action cập nhật thông tin user (nếu cần)
    updateUser: (state, action) => {
      state.user = action.payload;
    }
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;