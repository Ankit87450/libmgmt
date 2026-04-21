"use client";
import { useAppSelector } from "@/lib/hooks";
import type { Role } from "@/features/auth/authSlice";

export function useRoleBase(): { role: Role; base: string } {
  const auth = useAppSelector((s) => s.auth);
  const role: Role = auth.role ?? "user";
  return { role, base: role === "admin" ? "/admin" : "/user" };
}
