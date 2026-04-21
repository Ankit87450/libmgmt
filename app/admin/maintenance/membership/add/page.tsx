"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMonths, format } from "date-fns";
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
import { DatePicker } from "@/components/date-picker";
import {
  addMembershipSchema,
  type AddMembershipValues,
} from "@/schemas/membership";
import { Label } from "@/components/ui/label";
import { useAddMemberMutation } from "@/features/api";

const monthsFor = (d: "6m" | "1y" | "2y") => (d === "6m" ? 6 : d === "1y" ? 12 : 24);

export default function AddMembershipPage() {
  const router = useRouter();
  const [addMember, { isLoading }] = useAddMemberMutation();

  const form = useForm<AddMembershipValues>({
    resolver: zodResolver(addMembershipSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      contactNumber: "",
      contactAddress: "",
      aadhaar: "",
      startDate: format(new Date(), "yyyy-MM-dd"),
      duration: "6m",
    },
  });

  const watchStart = form.watch("startDate");
  const watchDur = form.watch("duration");
  const endDate = watchStart
    ? format(
        addMonths(new Date(watchStart), monthsFor(watchDur)),
        "yyyy-MM-dd",
      )
    : "";

  const onSubmit = async (v: AddMembershipValues) => {
    const res = await addMember(v);
    if ("error" in res) {
      form.setError("firstName", { message: "Failed to save" });
      return;
    }
    router.push("/admin/success?action=add-membership");
  };

  return (
    <>
      <PageTitle title="Add Membership" backHref="/admin/maintenance" />
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
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Address</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aadhaar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Aadhar Card No</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
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
              <FormItem>
                <FormLabel>End Date (auto)</FormLabel>
                <Input readOnly value={endDate} />
              </FormItem>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Membership Duration</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex flex-wrap gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="6m" id="dur-6m" />
                          <Label htmlFor="dur-6m">Six Months</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="1y" id="dur-1y" />
                          <Label htmlFor="dur-1y">One Year</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="2y" id="dur-2y" />
                          <Label htmlFor="dur-2y">Two Years</Label>
                        </div>
                      </RadioGroup>
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
