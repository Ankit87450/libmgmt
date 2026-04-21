"use client";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageTitle } from "@/components/page-title";
import { ModuleNav } from "@/components/module-nav";
import { transactionsNav } from "@/lib/nav";
import { useRoleBase } from "@/lib/role";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { fineSchema, type FineValues } from "@/schemas/fine";
import { completeReturn } from "@/features/transactions/transactionsSlice";
import { updateItemStatus } from "@/features/catalog/catalogSlice";
import { setFinePending } from "@/features/members/membersSlice";

export function PayFinePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { role, base } = useRoleBase();
  const dispatch = useAppDispatch();
  const issues = useAppSelector((s) => s.transactions.issues);
  const items = useAppSelector((s) => s.catalog.items);

  const returnedPending = useMemo(
    () =>
      issues.filter((i) => i.actualReturnDate && i.status === "Active"),
    [issues],
  );
  const initialId = params.get("id") ?? "";

  const form = useForm<FineValues>({
    resolver: zodResolver(fineSchema),
    defaultValues: {
      issueId: initialId,
      finePaid: false,
      remarks: "",
      fineCalculated: 0,
    },
  });

  const watchId = form.watch("issueId");
  const issue = useMemo(
    () => issues.find((i) => i.id === watchId),
    [issues, watchId],
  );
  const item = useMemo(
    () => items.find((i) => i.serialNo === issue?.serialNo),
    [items, issue],
  );

  useEffect(() => {
    form.setValue("fineCalculated", issue?.fineCalculated ?? 0);
  }, [issue, form]);

  const onSubmit = (v: FineValues) => {
    if (!issue) return;
    dispatch(completeReturn({ id: issue.id, finePaid: v.finePaid }));
    dispatch(
      updateItemStatus({ serialNo: issue.serialNo, status: "Available" }),
    );
    if (v.fineCalculated > 0 && !v.finePaid) {
      dispatch(
        setFinePending({ id: issue.memberId, amount: v.fineCalculated }),
      );
    }
    router.push(`${base}/success?action=return`);
  };

  return (
    <>
      <PageTitle title="Pay Fine" backHref={`${base}/transactions`} />
      <ModuleNav items={transactionsNav(role)} />
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 md:grid-cols-2"
            >
              <FormField
                control={form.control}
                name="issueId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Pending Return</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick an issue awaiting fine settlement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {returnedPending.length === 0 ? (
                          <SelectItem value="__none" disabled>
                            None — complete a return first
                          </SelectItem>
                        ) : (
                          returnedPending.map((i) => {
                            const it = items.find(
                              (x) => x.serialNo === i.serialNo,
                            );
                            return (
                              <SelectItem key={i.id} value={i.id}>
                                {i.id} · {it?.name ?? i.serialNo} · fine ₹
                                {i.fineCalculated}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Book Name</FormLabel>
                <Input readOnly value={item?.name ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Author</FormLabel>
                <Input readOnly value={item?.author ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Serial No</FormLabel>
                <Input readOnly value={issue?.serialNo ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Member</FormLabel>
                <Input readOnly value={issue?.memberId ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Issue Date</FormLabel>
                <Input readOnly value={issue?.issueDate ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Due Return Date</FormLabel>
                <Input readOnly value={issue?.returnDueDate ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Actual Return Date</FormLabel>
                <Input readOnly value={issue?.actualReturnDate ?? ""} />
              </FormItem>
              <FormField
                control={form.control}
                name="fineCalculated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fine Calculated (₹)</FormLabel>
                    <FormControl>
                      <Input
                        readOnly
                        value={String(field.value ?? 0)}
                        onChange={() => undefined}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="finePaid"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3 md:col-span-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(v) => field.onChange(Boolean(v))}
                      />
                    </FormControl>
                    <FormLabel className="mb-0">Fine Paid</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remarks"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Remarks (optional)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2 flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`${base}/cancelled`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={!issue}>
                  Confirm
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
