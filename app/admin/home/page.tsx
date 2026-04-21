import { Wrench, FileBarChart, ArrowLeftRight } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { TileGrid } from "@/components/tile-grid";

export default function AdminHome() {
  return (
    <>
      <PageTitle
        title="Admin Home"
        subtitle="Select a module to continue."
      />
      <TileGrid
        tiles={[
          {
            title: "Maintenance",
            href: "/admin/maintenance",
            description:
              "Manage memberships, books/movies, and application users.",
            icon: Wrench,
          },
          {
            title: "Reports",
            href: "/admin/reports",
            description: "Master lists, active issues, overdue & requests.",
            icon: FileBarChart,
          },
          {
            title: "Transactions",
            href: "/admin/transactions",
            description: "Check availability, issue, return & pay fine.",
            icon: ArrowLeftRight,
          },
        ]}
      />
    </>
  );
}
