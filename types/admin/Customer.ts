export interface Customer {
  user: {
    name: string;
    email: string;
    userId: number;
    isVerified: boolean;
  };
  customerId: number;
  address: string;
  phone: string;
  totalOrder: number;
}
