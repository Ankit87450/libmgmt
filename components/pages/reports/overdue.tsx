"use client";
import { differenceInCalendarDays } from "date-fns";
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
import { FINE_PER_DAY } from "@/lib/fine";

export function OverdueReport() {
  const { role, base } = useRoleBase();
  const today = new Date();
  const issues = useAppSelector((s) => s.transactions.issues);
  const items = useAppSelector((s) => s.catalog.items);
  const overdue = issues
    .filter((i) => i.status === "Active")
    .filter(
      (i) => differenceInCalendarDays(today, new Date(i.returnDueDate)) > 0,
    );
  return (
    <>
      <PageTitle title="Overdue Returns" backHref={`${base}/reports`} />
      <ModuleNav items={reportsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial No</TableHead>
                <TableHead>Book/Movie</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Membership Id</TableHead>
                <TableHead>Date of Issue</TableHead>
                <TableHead>Date of Return</TableHead>
                <TableHead className="text-right">Days Overdue</TableHead>
                <TableHead className="text-right">Projected Fine (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {overdue.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground">
                    Nothing overdue — great job!
                  </TableCell>
                </TableRow>
              ) : (
                overdue.map((i) => {
                  const it = items.find((x) => x.serialNo === i.serialNo);
                  const days = differenceInCalendarDays(
                    today,
                    new Date(i.returnDueDate),
                  );
                  return (
                    <TableRow key={i.id}>
                      <TableCell className="font-mono">{i.serialNo}</TableCell>
                      <TableCell className="capitalize">{it?.kind ?? ""}</TableCell>
                      <TableCell>{it?.name ?? "—"}</TableCell>
                      <TableCell>{i.memberId}</TableCell>
                      <TableCell>{i.issueDate}</TableCell>
                      <TableCell>{i.returnDueDate}</TableCell>
                      <TableCell className="text-right">{days}</TableCell>
                      <TableCell className="text-right">
                        {days * FINE_PER_DAY}
                      </TableCell>
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
