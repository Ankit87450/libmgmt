"use client";
import { Users, BookOpen, UserCog } from "lucide-react";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { TileGrid } from "@/components/tile-grid";
import { maintenanceNav } from "@/lib/nav";

export default function MaintenanceHub() {
  return (
    <>
      <PageTitle title="Maintenance" backHref="/admin/home" />
      <ModuleNav items={maintenanceNav()} />
      <TileGrid
        tiles={[
          {
            title: "Membership · Add",
            href: "/admin/maintenance/membership/add",
            icon: Users,
          },
          {
            title: "Membership · Update",
            href: "/admin/maintenance/membership/update",
            icon: Users,
          },
          {
            title: "Book/Movie · Add",
            href: "/admin/maintenance/books/add",
            icon: BookOpen,
          },
          {
            title: "Book/Movie · Update",
            href: "/admin/maintenance/books/update",
            icon: BookOpen,
          },
          {
            title: "User Management · Add",
            href: "/admin/maintenance/users/add",
            icon: UserCog,
          },
          {
            title: "User Management · Update",
            href: "/admin/maintenance/users/update",
            icon: UserCog,
          },
        ]}
      />
    </>
  );
}
