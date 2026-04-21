import type { Role } from "@/features/auth/authSlice";
import type { ModuleNavItem } from "@/components/module-nav";

export function transactionsNav(role: Role): ModuleNavItem[] {
  const base = role === "admin" ? "/admin" : "/user";
  return [
    { href: `${base}/home`, label: "Home" },
    { href: `${base}/transactions`, label: "Transactions" },
    { href: `${base}/transactions/availability`, label: "Is book available?" },
    { href: `${base}/transactions/issue`, label: "Issue book?" },
    { href: `${base}/transactions/return`, label: "Return book?" },
    { href: `${base}/transactions/pay-fine`, label: "Pay Fine?" },
  ];
}

export function reportsNav(role: Role): ModuleNavItem[] {
  const base = role === "admin" ? "/admin" : "/user";
  return [
    { href: `${base}/home`, label: "Home" },
    { href: `${base}/reports`, label: "Reports" },
    { href: `${base}/reports/books`, label: "Master List of Books" },
    { href: `${base}/reports/movies`, label: "Master List of Movies" },
    { href: `${base}/reports/memberships`, label: "Master List of Memberships" },
    { href: `${base}/reports/active-issues`, label: "Active Issues" },
    { href: `${base}/reports/overdue`, label: "Overdue Returns" },
    { href: `${base}/reports/issue-requests`, label: "Issue Requests" },
  ];
}

export function maintenanceNav(): ModuleNavItem[] {
  return [
    { href: "/admin/home", label: "Home" },
    { href: "/admin/maintenance", label: "Maintenance" },
    { href: "/admin/maintenance/membership/add", label: "Membership · Add" },
    {
      href: "/admin/maintenance/membership/update",
      label: "Membership · Update",
    },
    { href: "/admin/maintenance/books/add", label: "Book/Movie · Add" },
    { href: "/admin/maintenance/books/update", label: "Book/Movie · Update" },
    { href: "/admin/maintenance/users/add", label: "User Mgmt · Add" },
    { href: "/admin/maintenance/users/update", label: "User Mgmt · Update" },
  ];
}
