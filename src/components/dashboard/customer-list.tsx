import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateCustomerDialog } from "./create-customer-dialog";
import { createServerClient } from "@/server/routers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { Customer } from "@/types";

type Props = {
  page?: number;
  limit?: number;
  query?: string;
};

export default async function CustomerList({
  page = 1,
  limit = 10,
  query,
}: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { token } = session;
  const api = await createServerClient({ token });
  let customers: Customer[] = [];
  try {
    const result = await api.getCustomers.query({
      page,
      limit,
      query,
    });
    customers = result?.customers ?? [];
  } catch (error) {
    console.error("Error retrieving products:", error);
  }
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customer List</h1>
        <CreateCustomerDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>City</TableHead>
            <TableHead>Country</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell>{customer.id}</TableCell>
              <TableCell>{customer.firstName}</TableCell>
              <TableCell>{customer.lastName}</TableCell>
              <TableCell>{customer.email}</TableCell>
              <TableCell>{customer.city}</TableCell>
              <TableCell>{customer.country}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
