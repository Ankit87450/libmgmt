import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "admin" | "user";

export type AuthState = {
  username: string | null;
  role: Role | null;
};

const initialState: AuthState = { username: null, role: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action: PayloadAction<{ username: string; role: Role }>) {
      state.username = action.payload.username;
      state.role = action.payload.role;
    },
    logout(state) {
      state.username = null;
      state.role = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
