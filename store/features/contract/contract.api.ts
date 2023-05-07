import { createApi } from "@reduxjs/toolkit/query/react";

import { getContractQuery } from "@store/queries";
import InterviewContract, { InterviewContractInfo } from "@contract";

const contractApi = createApi({
  baseQuery:
    getContractQuery<InstanceType<typeof InterviewContract>>(InterviewContract),
  reducerPath: "contract",
  tagTypes: ["Contract"],
  keepUnusedDataFor: 15,
  endpoints: (builder) => ({
    getContractInfo: builder.query<InterviewContractInfo, string>({
      query: (address) => ({
        address,
        method: "getInterview",
      }),
      providesTags: (_result, _error, address) => {
        return [{ type: "Contract", id: address }];
      },
    }),
    purchaseContract: builder.mutation<
      void,
      { address: string; value: number }
    >({
      query: ({ address, value }) => ({
        address,
        method: "sendInterviewPurchase",
        parameters: [value],
      }),
      invalidatesTags: (_result, _error, { address }) => {
        return [{ type: "Contract", id: address }];
      },
    }),
    cancelContract: builder.mutation<void, string>({
      query: (address) => ({
        address,
        method: "sendInterviewCancellation",
      }),
      invalidatesTags: (_result, _error, address) => {
        return [{ type: "Contract", id: address }];
      },
    }),
    finishContract: builder.mutation<void, string>({
      query: (address) => ({
        address,
        method: "sendInterviewFinish",
      }),
      invalidatesTags: (_result, _error, address) => {
        return [{ type: "Contract", id: address }];
      },
    }),
  }),
});

export const {
  useGetContractInfoQuery,
  usePurchaseContractMutation,
  useCancelContractMutation,
  useFinishContractMutation,
} = contractApi;

export default contractApi;
