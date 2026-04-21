import { FileBarChart, ArrowLeftRight } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { TileGrid } from "@/components/tile-grid";

export default function UserHome() {
  return (
    <>
      <PageTitle
        title="User Home"
        subtitle="Select a module to continue."
      />
      <TileGrid
        tiles={[
          {
            title: "Reports",
            href: "/user/reports",
            description: "Master lists, active issues, overdue & requests.",
            icon: FileBarChart,
          },
          {
            title: "Transactions",
            href: "/user/transactions",
            description: "Check availability, issue, return & pay fine.",
            icon: ArrowLeftRight,
          },
        ]}
      />
    </>
  );
}
