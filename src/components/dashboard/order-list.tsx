import * as React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateOrderDialog } from "./create-order-dialog";
import { OrderFilter } from "./order-filter";
import { ListPagination } from "../list-pagination";
import { createServerClient } from "@/server/routers";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Product, Customer, Order } from "@/types";
import { Loader2 } from "lucide-react";
import { OrderActionMenu } from "./order-action-menu";

async function getOrders() {
  return [
    {
      id: "1",
      createdAt: new Date("2023-06-01"),
      customer: { firstName: "John", lastName: "Doe" },
      product: { name: "Widget A" },
      status: "delivered",
    },
    {
      id: "2",
      createdAt: new Date("2023-06-02"),
      customer: { firstName: "Jane", lastName: "Smith" },
      product: { name: "Gadget B" },
      status: "pending",
    },
    {
      id: "3",
      createdAt: new Date("2023-06-03"),
      customer: { firstName: "Bob", lastName: "Johnson" },
      product: { name: "Tool C" },
      status: "cancelled",
    },
  ];
}

async function getCustomers() {
  return [
    { id: "1", firstName: "John", lastName: "Doe" },
    { id: "2", firstName: "Jane", lastName: "Smith" },
    { id: "3", firstName: "Bob", lastName: "Johnson" },
  ];
}

async function getProducts() {
  return [
    { id: "1", name: "Widget A" },
    { id: "2", name: "Gadget B" },
    { id: "3", name: "Tool C" },
  ];
}

function StatusBadge({ status }: { status: string }) {
  let color: "green" | "yellow" | "red";
  switch (status.toLowerCase()) {
    case "delivered":
      color = "green";
      break;
    case "pending":
      color = "yellow";
      break;
    case "canceled":
      color = "red";
      break;
    default:
      color = "yellow";
  }

  return <Badge variant={color}>{status}</Badge>;
}

type Props = {
  page?: number;
  limit?: number;
  query?: string;
  minOrderDate?: string;
  maxOrderDate?: string;
};

export default async function OrderList({
  page,
  limit = 5,
  minOrderDate,
  maxOrderDate,
}: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const { token } = session;
  const api = await createServerClient({ token });

  let products: Product[] = [];
  let orders: Order[] = [];
  let customers: Customer[] = [];
  let totalPages = 0;

  try {
    const [productsResult, ordersResult, customersResult] = await Promise.all([
      api.getProducts.query({}),
      api.getOrders.query({ page, limit, minOrderDate, maxOrderDate }),
      api.getCustomers.query({}),
    ]);

    products = productsResult?.products ?? [];
    orders = ordersResult?.orders ?? [];
    customers = customersResult?.customers ?? [];
    totalPages = ordersResult?.pageCount ?? 0;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }

  return (
    <React.Suspense
      fallback={
        <div className="w-full h-full">
          <Loader2 className="mr-2 h-12 w-12 animate-spin" />
        </div>
      }
    >
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order List</h1>
          <div className="flex gap-2">
            <OrderFilter />
            <CreateOrderDialog customers={customers} products={products} />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Ordered At</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>
                <span className="sr-only">Status</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.Id}>
                <TableCell>{order.Id}</TableCell>
                <TableCell>{format(order.createdAt, "PPP")}</TableCell>
                <TableCell>{`${order.customer?.firstName} ${order.customer?.lastName}`}</TableCell>
                <TableCell>{order.product?.name}</TableCell>
                <TableCell>
                  <StatusBadge status={order.fulfillmentStatus} />
                </TableCell>
                <TableCell>
                  <OrderActionMenu order={order} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <ListPagination totalPages={totalPages} tab={"orders"} />
        )}
      </div>
    </React.Suspense>
  );
}
