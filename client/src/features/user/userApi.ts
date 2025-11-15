import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import { ApiResponse, User } from "@/types";
import { RootState } from "@/app/store";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getProfile: builder.query<ApiResponse<{ user: User }>, void>({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<ApiResponse<{ user: User }>, Partial<User>>(
      {
        query: (data) => ({
          url: "/users/profile",
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["User"],
      }
    ),
    changePassword: builder.mutation<
      ApiResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/users/change-password",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = userApi;
