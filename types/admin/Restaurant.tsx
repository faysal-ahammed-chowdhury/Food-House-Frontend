export interface Restaurant {
  user?: {
    name?: string;
    email?: string;
    userId?: number;
  };
  restaurantId?: number;
  currentCommissionPercent?: number;
  currentDeliveryFee?: number;
  totalEarning?: number;
  address?: string;
  isOpen?: boolean;
}
