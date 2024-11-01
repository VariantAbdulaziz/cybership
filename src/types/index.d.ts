export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
};

export type Product = {
  id: string;
  name: string;
  details: string;
  image: string | null;
};
