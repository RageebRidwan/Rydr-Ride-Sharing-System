import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import {
  ApiResponse,
  PaginatedResponse,
  User,
  Ride,
  UserStats,
  RideStats,
} from "@/types";
import { RootState } from "@/app/store";

export const adminApi = createApi({
  reducerPath: "adminApi",
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
  tagTypes: ["Users", "AdminRides", "Stats"],
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      PaginatedResponse<User>,
      {
        page?: number;
        limit?: number;
        role?: string;
        status?: string;
        approvalStatus?: string;
        search?: string;
      }
    >({
      query: (params) => ({
        url: "/admin/users",
        params,
      }),
      providesTags: ["Users"],
    }),
    approveDriver: builder.mutation<
      ApiResponse<{ driver: User }>,
      { id: string; approvalStatus: "pending" | "approved" | "rejected" }
    >({
      query: ({ id, approvalStatus }) => ({
        url: `/admin/drivers/approve/${id}`,
        method: "PATCH",
        body: { approvalStatus },
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    updateUserStatus: builder.mutation<
      ApiResponse<{ user: User }>,
      { id: string; status: "active" | "blocked" | "suspended" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/users/block/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Users", "Stats"],
    }),
    getAllRides: builder.query<
      PaginatedResponse<Ride>,
      {
        page?: number;
        limit?: number;
        status?: string;
        riderId?: string;
        driverId?: string;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => ({
        url: "/admin/rides",
        params,
      }),
      providesTags: ["AdminRides"],
    }),
    getUserStats: builder.query<ApiResponse<UserStats>, void>({
      query: () => "/admin/users/stats",
      providesTags: ["Stats"],
    }),
    getRideStats: builder.query<ApiResponse<RideStats>, void>({
      query: () => "/admin/rides/stats",
      providesTags: ["Stats"],
    }),
    getDriverRatings: builder.query<
      ApiResponse<{
        totalDrivers: number;
        avgRating: number;
        topDrivers: User[];
      }>,
      void
    >({
      query: () => "/admin/drivers/ratings",
      providesTags: ["Stats"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useApproveDriverMutation,
  useUpdateUserStatusMutation,
  useGetAllRidesQuery,
  useGetUserStatsQuery,
  useGetRideStatsQuery,
  useGetDriverRatingsQuery,
} = adminApi;
