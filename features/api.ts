import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AppUser,
  Issue,
  IssueRequest,
  Item,
  Member,
  MembershipDuration,
  ItemStatus,
  ItemKind,
  Category,
} from "@/lib/types";

export type MeUser = {
  id: string;
  name: string;
  username: string;
  role: "admin" | "user";
};

export type Settings = { finePerDay: number };

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    credentials: "include",
  }),
  tagTypes: [
    "Me",
    "Items",
    "Members",
    "Users",
    "Issues",
    "Requests",
    "Settings",
  ],
  endpoints: (build) => ({
    // Auth
    me: build.query<{ user: MeUser | null }, void>({
      query: () => "/auth/me",
      providesTags: ["Me"],
    }),
    login: build.mutation<
      { user: MeUser },
      { username: string; password: string; role: "admin" | "user" }
    >({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Me"],
    }),
    logout: build.mutation<{ ok: true }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: [
        "Me",
        "Items",
        "Members",
        "Users",
        "Issues",
        "Requests",
        "Settings",
      ],
    }),

    // Items
    items: build.query<{ items: Item[] }, void>({
      query: () => "/items",
      providesTags: ["Items"],
    }),
    addItem: build.mutation<
      { items: Item[] },
      {
        kind: ItemKind;
        name: string;
        author: string;
        category: Category;
        procurementDate: string;
        quantity: number;
        cost?: number;
      }
    >({
      query: (body) => ({ url: "/items", method: "POST", body }),
      invalidatesTags: ["Items"],
    }),
    patchItem: build.mutation<
      { item: Item },
      { serialNo: string; patch: Partial<Item> & { status?: ItemStatus } }
    >({
      query: ({ serialNo, patch }) => ({
        url: `/items/${encodeURIComponent(serialNo)}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Items"],
    }),

    // Members
    members: build.query<{ members: Member[] }, void>({
      query: () => "/members",
      providesTags: ["Members"],
    }),
    addMember: build.mutation<
      { member: Member },
      {
        firstName: string;
        lastName: string;
        contactNumber: string;
        contactAddress: string;
        aadhaar: string;
        startDate: string;
        duration: MembershipDuration;
      }
    >({
      query: (body) => ({ url: "/members", method: "POST", body }),
      invalidatesTags: ["Members"],
    }),
    extendMember: build.mutation<
      { member: Member },
      { id: string; extension: MembershipDuration }
    >({
      query: ({ id, extension }) => ({
        url: `/members/${id}/extend`,
        method: "POST",
        body: { extension },
      }),
      invalidatesTags: ["Members"],
    }),
    cancelMember: build.mutation<{ member: Member }, { id: string }>({
      query: ({ id }) => ({
        url: `/members/${id}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Members"],
    }),

    // Users
    users: build.query<{ users: AppUser[] }, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),
    addUser: build.mutation<
      { user: AppUser },
      { name: string; active: boolean; isAdmin: boolean }
    >({
      query: (body) => ({ url: "/users", method: "POST", body }),
      invalidatesTags: ["Users"],
    }),
    patchUser: build.mutation<
      { user: AppUser },
      {
        id: string;
        patch: Partial<{
          name: string;
          active: boolean;
          isAdmin: boolean;
          password: string;
        }>;
      }
    >({
      query: ({ id, patch }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        body: patch,
      }),
      invalidatesTags: ["Users"],
    }),

    // Transactions
    issues: build.query<{ issues: Issue[] }, void>({
      query: () => "/transactions/issues",
      providesTags: ["Issues"],
    }),
    issueBook: build.mutation<
      { issue: Issue },
      {
        serialNo: string;
        memberId: string;
        issueDate: string;
        returnDueDate: string;
        remarks?: string;
      }
    >({
      query: (body) => ({
        url: "/transactions/issues",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Issues", "Items"],
    }),
    markReturn: build.mutation<
      { issue: Issue },
      { id: string; actualReturnDate: string; remarks?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/transactions/issues/${id}/return`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Issues"],
    }),
    completeReturn: build.mutation<
      { issue: Issue },
      { id: string; finePaid: boolean }
    >({
      query: ({ id, finePaid }) => ({
        url: `/transactions/issues/${id}/complete`,
        method: "POST",
        body: { finePaid },
      }),
      invalidatesTags: ["Issues", "Items", "Members"],
    }),
    requests: build.query<{ requests: IssueRequest[] }, void>({
      query: () => "/transactions/requests",
      providesTags: ["Requests"],
    }),

    // Settings
    settings: build.query<{ settings: Settings }, void>({
      query: () => "/settings",
      providesTags: ["Settings"],
    }),
    patchSettings: build.mutation<{ settings: Settings }, Partial<Settings>>({
      query: (body) => ({ url: "/settings", method: "PATCH", body }),
      invalidatesTags: ["Settings"],
    }),
  }),
});

export const {
  useMeQuery,
  useLoginMutation,
  useLogoutMutation,
  useItemsQuery,
  useAddItemMutation,
  usePatchItemMutation,
  useMembersQuery,
  useAddMemberMutation,
  useExtendMemberMutation,
  useCancelMemberMutation,
  useUsersQuery,
  useAddUserMutation,
  usePatchUserMutation,
  useIssuesQuery,
  useIssueBookMutation,
  useMarkReturnMutation,
  useCompleteReturnMutation,
  useRequestsQuery,
  useSettingsQuery,
  usePatchSettingsMutation,
} = api;
