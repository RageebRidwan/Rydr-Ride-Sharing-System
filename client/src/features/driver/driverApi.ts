import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import { ApiResponse, PaginatedResponse, Ride, Earnings } from "@/types";
import { RootState } from "@/app/store";

export const driverApi = createApi({
  reducerPath: "driverApi",
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
  tagTypes: ["DriverRides", "Earnings", "PendingRides"],
  endpoints: (builder) => ({
    setAvailability: builder.mutation<ApiResponse, { isOnline: boolean }>({
      query: (data) => ({
        url: "/drivers/availability",
        method: "PATCH",
        body: data,
      }),
    }),
    getPendingRides: builder.query<
      PaginatedResponse<Ride>,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/drivers/rides/pending",
        params,
      }),
      providesTags: ["PendingRides"],
    }),
    acceptRide: builder.mutation<ApiResponse<{ ride: Ride }>, string>({
      query: (id) => ({
        url: `/drivers/rides/${id}/accept`,
        method: "PATCH",
      }),
      invalidatesTags: ["PendingRides", "DriverRides"],
    }),
    updateRideStatus: builder.mutation<
      ApiResponse<{ ride: Ride }>,
      { id: string; status: "picked_up" | "in_transit" | "completed" }
    >({
      query: ({ id, status }) => ({
        url: `/drivers/rides/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["DriverRides", "Earnings"],
    }),
    getDriverHistory: builder.query<
      PaginatedResponse<Ride>,
      {
        page?: number;
        limit?: number;
        status?: string;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => ({
        url: "/drivers/rides/history",
        params,
      }),
      providesTags: ["DriverRides"],
    }),
    getEarnings: builder.query<ApiResponse<Earnings>, void>({
      query: () => "/drivers/rides/earnings",
      providesTags: ["Earnings"],
    }),
    cancelRide: builder.mutation<ApiResponse<{ ride: Ride }>, { id: string }>({
      query: ({ id }) => ({
        url: `/drivers/rides/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["DriverRides", "PendingRides"],
    }),
  }),
});

export const {
  useSetAvailabilityMutation,
  useGetPendingRidesQuery,
  useAcceptRideMutation,
  useUpdateRideStatusMutation,
  useGetDriverHistoryQuery,
  useGetEarningsQuery,
  useCancelRideMutation,
} = driverApi;
