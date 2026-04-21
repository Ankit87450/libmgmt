"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatePicker } from "@/components/date-picker";
import { Label } from "@/components/ui/label";
import { updateBookSchema, type UpdateBookValues } from "@/schemas/book";
import { ITEM_STATUSES } from "@/lib/types";
import { useItemsQuery, usePatchItemMutation } from "@/features/api";

export default function UpdateBookPage() {
  const router = useRouter();
  const { data } = useItemsQuery();
  const items = data?.items ?? [];
  const [patchItem, { isLoading }] = usePatchItemMutation();

  const form = useForm<UpdateBookValues>({
    resolver: zodResolver(updateBookSchema),
    defaultValues: {
      kind: "book",
      serialNo: "",
      status: "Available",
      statusChangeDate: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const watchKind = form.watch("kind");
  const watchSerial = form.watch("serialNo");

  const matching = useMemo(
    () => items.filter((i) => i.kind === watchKind),
    [items, watchKind],
  );
  const record = items.find((i) => i.serialNo === watchSerial);

  useEffect(() => {
    if (record) form.setValue("status", record.status);
  }, [record, form]);

  const onSubmit = async (v: UpdateBookValues) => {
    if (!record) {
      form.setError("serialNo", { message: "Unknown serial number." });
      return;
    }
    const res = await patchItem({
      serialNo: v.serialNo,
      patch: { status: v.status },
    });
    if ("error" in res) {
      form.setError("serialNo", { message: "Failed to update" });
      return;
    }
    router.push("/admin/success?action=update-book");
  };

  return (
    <>
      <PageTitle title="Update Book/Movie" backHref="/admin/maintenance" />
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
                name="kind"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          form.setValue("serialNo", "");
                        }}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="book" id="ukind-book" />
                          <Label htmlFor="ukind-book">Book</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="movie" id="ukind-movie" />
                          <Label htmlFor="ukind-movie">Movie</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serialNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial No</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pick serial" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {matching.map((i) => (
                          <SelectItem key={i.serialNo} value={i.serialNo}>
                            {i.serialNo} — {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Name (auto)</FormLabel>
                <Input readOnly value={record?.name ?? ""} />
              </FormItem>
              <FormItem>
                <FormLabel>Procurement Date (non-editable)</FormLabel>
                <Input readOnly value={record?.procurementDate ?? ""} />
              </FormItem>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ITEM_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
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
                name="statusChangeDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status Change Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/cancelled")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving…" : "Confirm"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
