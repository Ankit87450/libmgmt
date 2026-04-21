"use client";
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
import { addBookSchema, type AddBookValues } from "@/schemas/book";
import { CATEGORIES } from "@/lib/types";
import { useAddItemMutation } from "@/features/api";

export default function AddBookPage() {
  const router = useRouter();
  const [addItem, { isLoading }] = useAddItemMutation();

  const form = useForm<AddBookValues>({
    resolver: zodResolver(addBookSchema),
    defaultValues: {
      kind: "book",
      name: "",
      author: "",
      category: "Fiction",
      procurementDate: format(new Date(), "yyyy-MM-dd"),
      quantity: 1,
      cost: 0,
    },
  });

  const onSubmit = async (v: AddBookValues) => {
    const res = await addItem({ ...v, quantity: v.quantity });
    if ("error" in res) {
      form.setError("name", { message: "Failed to save" });
      return;
    }
    router.push("/admin/success?action=add-book");
  };

  return (
    <>
      <PageTitle title="Add Book/Movie" backHref="/admin/maintenance" />
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
                        onValueChange={field.onChange}
                        className="flex gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="book" id="kind-book" />
                          <Label htmlFor="kind-book">Book</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="movie" id="kind-movie" />
                          <Label htmlFor="kind-movie">Movie</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("kind") === "book" ? "Author" : "Director"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
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
                name="procurementDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Procurement</FormLabel>
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
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity / Copies</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
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
