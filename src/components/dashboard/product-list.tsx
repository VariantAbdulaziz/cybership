import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateProductDialog } from "./create-product-dialog";
import { Product } from "@/types";
import { createServerClient } from "@/server/routers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

type Props = {
  page?: number;
  limit?: number;
  query?: string;
};

export async function ProductList({ page = 1, limit = 10, query }: Props) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  const { token } = session;
  const api = await createServerClient({ token });
  let products: Product[] = [];
  try {
    const result = await api.getProducts.query({
      page,
      limit,
      name: query,
    });
    products = result.products ?? [];
  } catch (error) {
    console.error("Error retrieving products:", error);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <CreateProductDialog />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.details}</p>
            </CardContent>
            <CardFooter>
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
