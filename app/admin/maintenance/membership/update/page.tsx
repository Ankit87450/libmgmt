"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { maintenanceNav } from "@/lib/nav";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  updateMembershipSchema,
  type UpdateMembershipValues,
} from "@/schemas/membership";
import { Label } from "@/components/ui/label";
import {
  useMembersQuery,
  useCancelMemberMutation,
  useExtendMemberMutation,
} from "@/features/api";

export default function UpdateMembershipPage() {
  const router = useRouter();
  const { data } = useMembersQuery();
  const members = data?.members ?? [];
  const [extendMember, { isLoading: extLoading }] = useExtendMemberMutation();
  const [cancelMember, { isLoading: canLoading }] = useCancelMemberMutation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const form = useForm<UpdateMembershipValues>({
    resolver: zodResolver(updateMembershipSchema),
    defaultValues: {
      membershipId: "",
      action: "extend",
      extension: "6m",
    },
  });

  const watchId = form.watch("membershipId");
  const record = useMemo(
    () => members.find((m) => m.id === watchId),
    [members, watchId],
  );

  const applyExtend = async (v: UpdateMembershipValues) => {
    const res = await extendMember({
      id: v.membershipId,
      extension: v.extension ?? "6m",
    });
    if ("error" in res) {
      form.setError("membershipId", { message: "Failed to extend" });
      return;
    }
    router.push("/admin/success?action=update-membership");
  };

  const applyCancel = async () => {
    const v = form.getValues();
    const res = await cancelMember({ id: v.membershipId });
    setConfirmOpen(false);
    if ("error" in res) {
      form.setError("membershipId", { message: "Failed to cancel" });
      return;
    }
    router.push("/admin/success?action=update-membership");
  };

  const onSubmit = (v: UpdateMembershipValues) => {
    if (!record) {
      form.setError("membershipId", {
        message: "No membership matches this ID.",
      });
      return;
    }
    if (v.action === "cancel") {
      setConfirmOpen(true);
      return;
    }
    void applyExtend(v);
  };

  return (
    <>
      <PageTitle title="Update Membership" backHref="/admin/maintenance" />
      <ModuleNav items={maintenanceNav()} />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="membershipId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. M001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Name</FormLabel>
                <Input
                  readOnly
                  value={
                    record ? `${record.firstName} ${record.lastName}` : ""
                  }
                />
              </FormItem>
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Input readOnly value={record?.startDate ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Input readOnly value={record?.endDate ?? ""} />
              </FormItem>
              <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Action</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="extend" id="act-extend" />
                          <Label htmlFor="act-extend">Extend</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="cancel" id="act-cancel" />
                          <Label htmlFor="act-cancel">Cancel</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("action") === "extend" ? (
                <FormField
                  control={form.control}
                  name="extension"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Extension Duration</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-wrap gap-4"
                        >
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="6m" id="ext-6m" />
                            <Label htmlFor="ext-6m">Six Months</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="1y" id="ext-1y" />
                            <Label htmlFor="ext-1y">One Year</Label>
                          </div>
                          <div className="flex items-center gap-2">
                            <RadioGroupItem value="2y" id="ext-2y" />
                            <Label htmlFor="ext-2y">Two Years</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : null}
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/cancelled")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={extLoading || canLoading}>
                  {extLoading || canLoading ? "Saving…" : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel membership?</DialogTitle>
            <DialogDescription>
              This marks{" "}
              <strong>
                {record ? `${record.firstName} ${record.lastName}` : "this member"}
              </strong>{" "}
              as Inactive. Active issues are not affected.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep active
            </Button>
            <Button
              variant="destructive"
              onClick={applyCancel}
              disabled={canLoading}
            >
              {canLoading ? "Cancelling…" : "Yes, cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
