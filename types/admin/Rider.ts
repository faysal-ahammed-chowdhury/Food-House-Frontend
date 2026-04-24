export interface Rider {
  user: {
    name: string;
    email: string;
    userId: number;
  };
  riderId: number;
  riderNid: string;
  phone: string;
  isOnline: boolean;
  bkashAccount: string;
  bankAccount: string;
  totalEarning: number;
  totalDelivery: number;
}
