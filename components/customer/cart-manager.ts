const getCartKey = (userId?: number | string) => {
  return userId ? `foodhouse_cart_${userId}` : "foodhouse_cart_guest";
};

export const getGlobalCart = (userId?: number | string) => {
  if (typeof window === "undefined") return {}; 
  try {
    const saved = localStorage.getItem(getCartKey(userId));
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Cart corrupted, wiping clean.");
    localStorage.removeItem(getCartKey(userId));
    return {};
  }
};

export const getRestaurantCart = (restaurantId: string, userId?: number | string) => {
  const globalCart = getGlobalCart(userId);
  return globalCart[restaurantId] || null;
};

export const saveRestaurantCart = (restaurantId: string, cartData: any, userId?: number | string) => {
  if (typeof window === "undefined") return;
  const globalCart = getGlobalCart(userId);

  if (cartData.items && cartData.items.length > 0) {
    globalCart[restaurantId] = cartData;
  } else {
    delete globalCart[restaurantId]; 
  }

  if (Object.keys(globalCart).length === 0) {
    localStorage.removeItem(getCartKey(userId)); 
  } else {
    localStorage.setItem(getCartKey(userId), JSON.stringify(globalCart));
  }
};

export const clearRestaurantCart = (restaurantId: string, userId?: number | string) => {
  if (typeof window === "undefined") return;
  const globalCart = getGlobalCart(userId);
  
  delete globalCart[restaurantId];
  
  if (Object.keys(globalCart).length === 0) {
    localStorage.removeItem(getCartKey(userId));
  } else {
    localStorage.setItem(getCartKey(userId), JSON.stringify(globalCart));
  }
};