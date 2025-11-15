import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import { authApi } from "@/features/auth/authApi";
import { userApi } from "@/features/user/userApi";
import { ridesApi } from "@/features/rides/ridesApi";
import { driverApi } from "@/features/driver/driverApi";
import { adminApi } from "@/features/admin/adminApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [ridesApi.reducerPath]: ridesApi.reducer,
    [driverApi.reducerPath]: driverApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      userApi.middleware,
      ridesApi.middleware,
      driverApi.middleware,
      adminApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
