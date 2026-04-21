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

export function IssueRequestsReport() {
  const { role, base } = useRoleBase();
  const requests = useAppSelector((s) => s.transactions.requests);
  return (
    <>
      <PageTitle title="Issue Requests" backHref={`${base}/reports`} />
      <ModuleNav items={reportsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membership Id</TableHead>
                <TableHead>Name of Book/Movie</TableHead>
                <TableHead>Requested Date</TableHead>
                <TableHead>Request Fulfilled Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No requests on record.
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.memberId}</TableCell>
                    <TableCell>{r.itemName}</TableCell>
                    <TableCell>{r.requestedDate}</TableCell>
                    <TableCell>
                      {r.fulfilledDate ?? (
                        <span className="text-muted-foreground">pending</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
