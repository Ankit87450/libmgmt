import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { seedAppUsers } from "@/lib/seed";
import type { AppUser } from "@/lib/types";

type UsersState = { users: AppUser[] };
const initialState: UsersState = { users: seedAppUsers };

let nextUserSeq = seedAppUsers.length + 1;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addUser: {
      reducer(state, action: PayloadAction<AppUser>) {
        state.users.push(action.payload);
      },
      prepare(input: {
        name: string;
        active: boolean;
        isAdmin: boolean;
        username: string;
        password: string;
      }) {
        const id = `U${String(nextUserSeq++).padStart(3, "0")}`;
        const u: AppUser = { id, ...input };
        return { payload: u };
      },
    },
    updateUser(state, action: PayloadAction<AppUser>) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = action.payload;
    },
  },
});

export const { addUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
