"use client";
import { useMeQuery } from "@/features/api";

export type RoleCtx =
  | { loading: true; role: null; base: null; username: null }
  | { loading: false; role: "admin" | "user"; base: string; username: string }
  | { loading: false; role: null; base: null; username: null };

export function useRoleBase(): RoleCtx {
  const { data, isLoading } = useMeQuery();
  if (isLoading) return { loading: true, role: null, base: null, username: null };
  const u = data?.user;
  if (!u) return { loading: false, role: null, base: null, username: null };
  return {
    loading: false,
    role: u.role,
    username: u.username,
    base: u.role === "admin" ? "/admin" : "/user",
  };
}
