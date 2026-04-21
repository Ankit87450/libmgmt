"use client";
import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDays, format, startOfDay } from "date-fns";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/date-picker";
import { issueSchema, type IssueValues } from "@/schemas/issue";
import { issueBook } from "@/features/transactions/transactionsSlice";
import { updateItemStatus } from "@/features/catalog/catalogSlice";

const todayISO = () => format(startOfDay(new Date()), "yyyy-MM-dd");

export function IssuePage() {
  const router = useRouter();
  const params = useSearchParams();
  const { role, base } = useRoleBase();
  const items = useAppSelector((s) => s.catalog.items);
  const members = useAppSelector((s) => s.members.members);
  const dispatch = useAppDispatch();

  const available = useMemo(
    () => items.filter((i) => i.status === "Available"),
    [items],
  );
  const activeMembers = useMemo(
    () => members.filter((m) => m.status === "Active"),
    [members],
  );

  const preselected = params.get("serial") ?? "";
  const issueDefault = todayISO();

  const form = useForm<IssueValues>({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      serialNo: preselected,
      bookName: "",
      author: "",
      memberId: "",
      issueDate: issueDefault,
      returnDate: format(addDays(new Date(issueDefault), 15), "yyyy-MM-dd"),
      remarks: "",
    },
  });

  const watchSerial = form.watch("serialNo");
  const watchIssue = form.watch("issueDate");

  useEffect(() => {
    const it = items.find((i) => i.serialNo === watchSerial);
    if (it) {
      form.setValue("bookName", it.name);
      form.setValue("author", it.author);
    } else {
      form.setValue("bookName", "");
      form.setValue("author", "");
    }
  }, [watchSerial, items, form]);

  useEffect(() => {
    if (watchIssue) {
      form.setValue(
        "returnDate",
        format(addDays(new Date(watchIssue), 15), "yyyy-MM-dd"),
      );
    }
  }, [watchIssue, form]);

  const onSubmit = (v: IssueValues) => {
    dispatch(
      issueBook({
        itemId: v.serialNo,
        serialNo: v.serialNo,
        memberId: v.memberId,
        issueDate: v.issueDate,
        returnDueDate: v.returnDate,
        remarks: v.remarks,
      }),
    );
    dispatch(
      updateItemStatus({ serialNo: v.serialNo, status: "Unavailable" }),
    );
    router.push(`${base}/success?action=issue`);
  };

  return (
    <>
      <PageTitle title="Book Issue" backHref={`${base}/transactions`} />
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
                name="serialNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enter Book Name</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an available title" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {available.map((i) => (
                          <SelectItem key={i.serialNo} value={i.serialNo}>
                            {i.name} ({i.serialNo})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author Name (auto)</FormLabel>
                    <FormControl>
                      <Input readOnly {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="memberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Member</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick member" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {activeMembers.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.id} — {m.firstName} {m.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="hidden md:block" />
              <FormField
                control={form.control}
                name="issueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Issue Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        minDate={startOfDay(new Date())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date (max 15 days)</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        minDate={new Date(form.getValues("issueDate"))}
                        maxDate={addDays(
                          new Date(form.getValues("issueDate")),
                          15,
                        )}
                      />
                    </FormControl>
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
                <Button type="submit">Confirm</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
