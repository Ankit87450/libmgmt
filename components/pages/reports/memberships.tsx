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

export function MembershipsReport() {
  const { role, base } = useRoleBase();
  const members = useAppSelector((s) => s.members.members);
  return (
    <>
      <PageTitle
        title="List of Active Memberships"
        backHref={`${base}/reports`}
      />
      <ModuleNav items={reportsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membership Id</TableHead>
                <TableHead>Name of Member</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Contact Address</TableHead>
                <TableHead>Aadhar Card No</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Fine Pending (₹)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center text-muted-foreground">
                    No members on record.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-mono">{m.id}</TableCell>
                    <TableCell>
                      {m.firstName} {m.lastName}
                    </TableCell>
                    <TableCell>{m.contactNumber}</TableCell>
                    <TableCell>{m.contactAddress}</TableCell>
                    <TableCell>{m.aadhaar}</TableCell>
                    <TableCell>{m.startDate}</TableCell>
                    <TableCell>{m.endDate}</TableCell>
                    <TableCell>{m.status}</TableCell>
                    <TableCell className="text-right">{m.finePending}</TableCell>
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
