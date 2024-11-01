export type User = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
};

export type Product = {
  id: number;
  name: string;
  details: string;
  image: string | null;
};

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string | null;
  country: string | null;
};

export type Order = {
  Id: number;
  customerId: number;
  productId: number;
  fulfillmentStatus: "DELIVERED" | "PENDING" | "CANCELED";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  createdById: number;

  customer: Customer | null;
  product: Product | null;
};
