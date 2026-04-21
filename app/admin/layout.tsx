import { AppShell } from "@/components/app-shell";
import { RequireRole } from "@/components/require-role";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole role="admin">
      <AppShell>{children}</AppShell>
    </RequireRole>
  );
}
