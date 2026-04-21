"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, LogOut, Home, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogoutMutation, useMeQuery } from "@/features/api";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data } = useMeQuery();
  const user = data?.user;
  const homeHref = user?.role === "admin" ? "/admin/home" : "/user/home";
  const [logout, { isLoading: loggingOut }] = useLogoutMutation();

  const handleLogout = async () => {
    await logout().unwrap().catch(() => undefined);
    router.push("/login/logout");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <Link
              href={homeHref}
              className="text-lg font-semibold tracking-tight"
            >
              Library Management System
            </Link>
          </div>
          <nav className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="/chart">
                <Network className="mr-1 h-4 w-4" /> Chart
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href={homeHref}>
                <Home className="mr-1 h-4 w-4" /> Home
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="mr-1 h-4 w-4" /> Log Out
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {user ? (
          <p className="mb-3 text-xs text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-slate-700">{user.username}</span>{" "}
            ({user.role})
          </p>
        ) : null}
        {children}
      </main>
      <footer className="border-t bg-white py-3 text-center text-xs text-muted-foreground">
        Demo · Next.js · Redux Toolkit (RTK Query) · React Hook Form · shadcn/ui
      </footer>
    </div>
  );
}
