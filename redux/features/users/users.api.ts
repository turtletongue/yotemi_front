import baseApi from "@redux/features/base.api";
import PaginationResult from "@redux/pagination-result";
import { Id } from "@app/declarations";
import User from "./interfaces/user";
import CreateUserData from "./interfaces/create-user.data";
import UpdateUserData from "./interfaces/update-user.data";

const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listUsers: builder.query<PaginationResult<User>, number | void>({
      query: (page = 1) => `users?page=${page}&pageSize=10&hideSelf=true`,
      providesTags: (result) => {
        return result
          ? [
              ...result.items.map(({ id }) => ({ type: "Users", id } as const)),
              { type: "Users", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Users", id: "PARTIAL-LIST" }];
      },
    }),
    getUser: builder.query<User, Id>({
      query: (id) => `users/${id}`,
      providesTags: (_result, _error, id) => {
        return [{ type: "Users", id }];
      },
    }),
    getUserByUsername: builder.query<User, string>({
      query: (username) => `users/by-username/${username}`,
      providesTags: (result) => {
        return [{ type: "Users", id: result?.id }];
      },
    }),
    addUser: builder.mutation<void, CreateUserData>({
      query: (data) => ({
        url: "users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Users", id: "PARTIAL-LIST" }],
    }),
    updateUser: builder.mutation<void, UpdateUserData>({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => {
        return [{ type: "Users", id }];
      },
    }),
    deleteUser: builder.mutation<void, Id>({
      query: (id) => ({
        url: `users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => {
        return [
          { type: "Users", id },
          { type: "Users", id: "PARTIAL-LIST" },
        ];
      },
    }),
    followUser: builder.mutation<void, Id>({
      query: (id) => ({
        url: "followings",
        method: "POST",
        body: {
          followingId: id,
        },
      }),
    }),
    unfollowUser: builder.mutation<void, Id>({
      query: (id) => ({
        url: "followings",
        method: "DELETE",
        body: {
          followingId: id,
        },
      }),
    }),
  }),
});

export const {
  useListUsersQuery,
  useGetUserQuery,
  useGetUserByUsernameQuery,
  useAddUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
} = usersApi;

export default usersApi;
