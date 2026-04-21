"use client";
import { BookCheck, ArrowUpRight, Undo2, Coins } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { TileGrid } from "@/components/tile-grid";
import { ModuleNav } from "@/components/module-nav";
import { transactionsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";

export function TransactionsHub() {
  const { role, base } = useRoleBase();
  return (
    <>
      <PageTitle title="Transactions" backHref={`${base}/home`} />
      <ModuleNav items={transactionsNav(role)} />
      <TileGrid
        tiles={[
          {
            title: "Is book available?",
            href: `${base}/transactions/availability`,
            icon: BookCheck,
            description: "Search catalogue by name/author/category.",
          },
          {
            title: "Issue book?",
            href: `${base}/transactions/issue`,
            icon: ArrowUpRight,
            description: "Record a new issue to a member.",
          },
          {
            title: "Return book?",
            href: `${base}/transactions/return`,
            icon: Undo2,
            description: "Return an active issue.",
          },
          {
            title: "Pay Fine?",
            href: `${base}/transactions/pay-fine`,
            icon: Coins,
            description: "Settle fines and complete returns.",
          },
        ]}
      />
    </>
  );
}
