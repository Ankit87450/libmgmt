"use client";
import { BookText, Film, Users, Clock, AlertTriangle, Inbox } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { TileGrid } from "@/components/tile-grid";
import { ModuleNav } from "@/components/module-nav";
import { reportsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";

export function ReportsHub() {
  const ctx = useRoleBase();
  if (ctx.loading || !ctx.role) return null;
  const { role, base } = ctx;
  return (
    <>
      <PageTitle title="Reports" backHref={`${base}/home`} />
      <ModuleNav items={reportsNav(role)} />
      <TileGrid
        tiles={[
          { title: "Master List of Books", href: `${base}/reports/books`, icon: BookText },
          { title: "Master List of Movies", href: `${base}/reports/movies`, icon: Film },
          { title: "Master List of Memberships", href: `${base}/reports/memberships`, icon: Users },
          { title: "Active Issues", href: `${base}/reports/active-issues`, icon: Clock },
          { title: "Overdue Returns", href: `${base}/reports/overdue`, icon: AlertTriangle },
          { title: "Issue Requests", href: `${base}/reports/issue-requests`, icon: Inbox },
        ]}
      />
    </>
  );
}
