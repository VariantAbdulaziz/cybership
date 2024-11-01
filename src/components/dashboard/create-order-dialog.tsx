"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { OrderSchema } from "@/lib/validations/order-schema";
import { Customer, Product } from "@/types";
import { createOrderAction } from "@/actions/order-actions";
import { toast } from "../ui/use-toast";
import { useAction } from "next-safe-action/hooks";

type OrderFormData = z.infer<typeof OrderSchema>;

type CreateOrderDialogProps = {
  customers: Customer[];
  products: Product[];
};

export function CreateOrderDialog({
  customers,
  products,
}: CreateOrderDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { execute, isExecuting } = useAction(createOrderAction, {
    onSuccess: async () => {
      toast({
        title: "Order Created",
        description: "Your order was successfully created!",
      });
      form.reset();
      setOpen(false);
    },
    onError: async ({ error }) => {
      if (error.serverError) {
        toast({
          title: "Order Creation Failed!",
          variant: "destructive",
          description: error.serverError,
        });
      }
    },
  });

  const form = useForm<OrderFormData>({
    resolver: zodResolver(OrderSchema),
    defaultValues: {
      fulfillmentStatus: "PENDING",
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    execute(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Order</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fulfillmentStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fulfillment Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Customer</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? customers.find(
                                (customer) => customer.id === field.value
                              )
                              ? `${
                                  customers.find(
                                    (customer) => customer.id === field.value
                                  )?.firstName
                                } ${
                                  customers.find(
                                    (customer) => customer.id === field.value
                                  )?.lastName
                                }`
                              : "Select customer"
                            : "Select customer"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search customer..." />
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customers.map((customer) => (
                            <CommandItem
                              value={`${customer.firstName} ${customer.lastName} ${customer.email} ${customer.id}`}
                              key={customer.id}
                              onSelect={() => {
                                form.setValue("customerId", customer.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customer.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {customer.email}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Product</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? products.find(
                                (product) => product.id === field.value
                              )?.name
                            : "Select product"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search product..." />
                        <CommandEmpty>No product found.</CommandEmpty>
                        <CommandGroup>
                          {products.map((product) => (
                            <CommandItem
                              value={`${product.name} ${product.id}`}
                              key={product.id}
                              onSelect={() => {
                                form.setValue("productId", product.id);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  product.id === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {product.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
