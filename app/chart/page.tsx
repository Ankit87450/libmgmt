import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const tree = [
  {
    h: "Login",
    items: ["Admin login (adm/adm)", "User login (user/user)"],
  },
  {
    h: "Admin Home Page",
    items: ["Maintenance", "Reports", "Transactions"],
  },
  {
    h: "User Home Page",
    items: ["Reports", "Transactions"],
  },
  {
    h: "Transactions",
    items: [
      "Is book available?",
      "Issue book?",
      "Return book? → Pay Fine?",
      "Pay Fine?",
    ],
  },
  {
    h: "Reports",
    items: [
      "Master List of Books",
      "Master List of Movies",
      "Master List of Memberships",
      "Active Issues",
      "Overdue Returns",
      "Issue Requests",
    ],
  },
  {
    h: "Maintenance (Admin only)",
    items: [
      "Membership · Add / Update",
      "Books/Movies · Add / Update",
      "User Management · Add / Update",
    ],
  },
  {
    h: "End states",
    items: [
      "Transaction completed successfully",
      "Transaction cancelled",
      "Successfully logged out",
    ],
  },
];

export default function ChartPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Application Chart</h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/login">
            <ChevronLeft className="mr-1 h-4 w-4" /> Back
          </Link>
        </Button>
      </div>
      <p className="mb-6 text-sm text-muted-foreground">
        Overview of screens & flows in the Library Management System.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {tree.map((section) => (
          <Card key={section.h}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{section.h}</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-3">
              <ul className="list-inside list-disc text-sm">
                {section.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
