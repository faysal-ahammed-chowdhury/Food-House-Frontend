import { OrderStatus } from "@/enums/order-status";

export interface Order {
  orderId: number;
  orderAt: Date;
  subtotal: number;
  voucherCode: string;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  restaurantName: string;
  riderName: string;
  customerName: string;
  status: OrderStatus;
  commissionAmount: number;
  commissionPercentage: number;
}
