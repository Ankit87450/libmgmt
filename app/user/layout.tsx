import { AppShell } from "@/components/app-shell";
import { RequireRole } from "@/components/require-role";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="user">
      <AppShell>{children}</AppShell>
    </RequireRole>
  );
}
