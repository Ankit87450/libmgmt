"use client";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { reportsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";
import { useAppSelector } from "@/lib/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export function ActiveIssuesReport() {
  const { role, base } = useRoleBase();
  const issues = useAppSelector((s) =>
    s.transactions.issues.filter((i) => i.status === "Active"),
  );
  const items = useAppSelector((s) => s.catalog.items);
  return (
    <>
      <PageTitle title="Active Issues" backHref={`${base}/reports`} />
      <ModuleNav items={reportsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Issue Id</TableHead>
                <TableHead>Book/Movie</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Serial No</TableHead>
                <TableHead>Membership Id</TableHead>
                <TableHead>Date of Issue</TableHead>
                <TableHead>Date of Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No active issues.
                  </TableCell>
                </TableRow>
              ) : (
                issues.map((i) => {
                  const it = items.find((x) => x.serialNo === i.serialNo);
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono">{i.id}</TableCell>
                      <TableCell className="capitalize">
                        {it?.kind ?? ""}
                      </TableCell>
                      <TableCell>{it?.name ?? "—"}</TableCell>
                      <TableCell className="font-mono">{i.serialNo}</TableCell>
                      <TableCell>{i.memberId}</TableCell>
                      <TableCell>{i.issueDate}</TableCell>
                      <TableCell>{i.returnDueDate}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
