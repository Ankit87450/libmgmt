"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import type { Role } from "@/features/auth/authSlice";

export function RequireRole({
  role,
  children,
}: {
  role: Role;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const auth = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (auth.role !== role) {
      router.replace("/login");
    }
  }, [auth.role, role, router]);

  if (auth.role !== role) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Redirecting to login…
      </div>
    );
  }
  return <>{children}</>;
}
