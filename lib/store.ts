import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import authReducer from "@/features/auth/authSlice";
import catalogReducer from "@/features/catalog/catalogSlice";
import membersReducer from "@/features/members/membersSlice";
import usersReducer from "@/features/users/usersSlice";
import txnReducer from "@/features/transactions/transactionsSlice";

const createNoopStorage = () => ({
  getItem: (_key: string) => Promise.resolve(null),
  setItem: (_key: string, value: unknown) => Promise.resolve(value),
  removeItem: (_key: string) => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? // eslint-disable-next-line @typescript-eslint/no-require-imports
      require("redux-persist/lib/storage").default
    : createNoopStorage();

const rootReducer = combineReducers({
  auth: authReducer,
  catalog: catalogReducer,
  members: membersReducer,
  users: usersReducer,
  transactions: txnReducer,
});

const persistConfig = {
  key: "libmgmt-root",
  storage,
  version: 1,
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
