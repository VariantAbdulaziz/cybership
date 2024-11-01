import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductList } from "@/components/dashboard/product-list";
import CustomerList from "@/components/dashboard/customer-list";
import OrderList from "@/components/dashboard/order-list";

interface Props {
  searchParams?: {
    query?: string;
    page?: string;
    tab?: string;
    minOrderDate?: string;
    maxOrderDate?: string;
  };
}

export default function Dashboard({ searchParams }: Props) {
  const query = searchParams?.query || "";
  const page = searchParams?.page ? Number(searchParams.page) : 1;
  const tab = searchParams?.tab || "orders";
  const minOrderDate = searchParams?.minOrderDate || undefined;
  const maxOrderDate = searchParams?.maxOrderDate || undefined;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <Tabs defaultValue={tab} className="w-full">
        <TabsList>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Manage your product inventory here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers">
          <Card>
            <CardHeader>
              <CardTitle>Customers</CardTitle>
              <CardDescription>
                Manage your customers inventory here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomerList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>
                Manage your orders inventory here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList
                query={query}
                page={page}
                minOrderDate={minOrderDate}
                maxOrderDate={maxOrderDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
