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
    case "cancelled":
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
  limit,
  query,
  minOrderDate,
  maxOrderDate,
}: Props) {
  const orders = await getOrders();
  const customers = await getCustomers();
  const products = await getProducts();

  return (
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{format(order.createdAt, "PPP")}</TableCell>
              <TableCell>{`${order.customer.firstName} ${order.customer.lastName}`}</TableCell>
              <TableCell>{order.product.name}</TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ListPagination totalPages={10} tab={"orders"} />
    </div>
  );
}
