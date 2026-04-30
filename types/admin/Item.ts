export interface Item {
  itemId: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  preparationTime: number;
  category: {
    categoryId: number;
    name: string;
  };
}
