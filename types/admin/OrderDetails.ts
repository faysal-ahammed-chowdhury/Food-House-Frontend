import { OrderStatus } from "@/enums/order-status";

export interface OrderDetails {
  orderId: number;
  orderAt: Date;
  subtotal: number;
  voucherCode: string;
  discountAmount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  restaurantName: string;
  restaurantAddress: string;
  riderName: string;
  customerName: string;
  customerAddress: string;
  status: OrderStatus;
  commissionAmount: number;
  commissionPercentage: number;
  orderItems: {
    orderItemId: number;
    itemId: number;
    itemName: string;
    itemPrice: number;
    quantity: number;
    total: number;
  }[];
}
