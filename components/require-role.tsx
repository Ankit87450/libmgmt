"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/features/api";

export function RequireRole({
  role,
  children,
}: {
  role: "admin" | "user";
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading } = useMeQuery();
  const currentRole = data?.user?.role ?? null;

  useEffect(() => {
    if (isLoading) return;
    if (currentRole !== role) {
      router.replace("/login");
    }
  }, [isLoading, currentRole, role, router]);

  if (isLoading || currentRole !== role) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-muted-foreground">
        Checking session…
      </div>
    );
  }
  return <>{children}</>;
}
