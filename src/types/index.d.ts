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
  address?: {
    city: string;
    country: string;
  };
};
