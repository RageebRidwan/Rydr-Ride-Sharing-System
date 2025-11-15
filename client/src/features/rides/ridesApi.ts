import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/constants";
import {
  ApiResponse,
  PaginatedResponse,
  Ride,
  RideRequest,
  User,
} from "@/types";
import { RootState } from "@/app/store";

export const ridesApi = createApi({
  reducerPath: "ridesApi",
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
  tagTypes: ["Rides", "RideDetails"],
  endpoints: (builder) => ({
    requestRide: builder.mutation<ApiResponse<{ ride: Ride }>, RideRequest>({
      query: (data) => ({
        url: "/rides/request",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Rides"],
    }),
    getRideHistory: builder.query<
      PaginatedResponse<Ride>,
      {
        page?: number;
        limit?: number;
        status?: string;
        fareMin?: number;
        fareMax?: number;
        dateFrom?: string;
        dateTo?: string;
      }
    >({
      query: (params) => ({
        url: "/rides/history",
        params,
      }),
      providesTags: ["Rides"],
    }),
    getRideById: builder.query<ApiResponse<{ ride: Ride }>, string>({
      query: (id) => `/rides/${id}`,
      providesTags: (_result, _error, id) => [{ type: "RideDetails", id }],
    }),
    cancelRide: builder.mutation<
      ApiResponse<{ ride: Ride }>,
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/rides/${id}/cancel`,
        method: "PATCH",
        body: { reason },
      }),
      invalidatesTags: ["Rides"],
    }),
    rateDriver: builder.mutation<ApiResponse, { id: string; rating: number }>({
      query: ({ id, rating }) => ({
        url: `/rides/${id}/rate-driver`,
        method: "PATCH",
        body: { rating },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Rides",
        { type: "RideDetails", id },
      ],
    }),
    leaveFeedback: builder.mutation<
      ApiResponse<{ ride: Ride }>,
      { id: string; feedback: string }
    >({
      query: ({ id, feedback }) => ({
        url: `/rides/${id}/feedback`,
        method: "PATCH",
        body: { feedback },
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Rides",
        { type: "RideDetails", id },
      ],
    }),
    findNearbyDrivers: builder.mutation<
      ApiResponse<{ drivers: User[] }>,
      { loc: string; maxDistance?: number }
    >({
      query: (data) => ({
        url: "/rides/drivers/nearby",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRequestRideMutation,
  useGetRideHistoryQuery,
  useGetRideByIdQuery,
  useCancelRideMutation,
  useRateDriverMutation,
  useLeaveFeedbackMutation,
  useFindNearbyDriversMutation,
} = ridesApi;
