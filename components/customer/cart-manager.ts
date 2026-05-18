
const CART_KEY = "foodhouse_cart";

export const getGlobalCart = () => {
  if (typeof window === "undefined") return {}; // server side hoile agei return
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("Cart corrupted, wiping clean.");
    localStorage.removeItem(CART_KEY);
    return {};
  }
};

export const getRestaurantCart = (restaurantId: string) => {
  const globalCart = getGlobalCart();
  return globalCart[restaurantId] || null;
};

export const saveRestaurantCart = (restaurantId: string, cartData: any) => {
  if (typeof window === "undefined") return;
  const globalCart = getGlobalCart();

  if (cartData.items && cartData.items.length > 0) {
    globalCart[restaurantId] = cartData;
  } else {
    delete globalCart[restaurantId]; 
  }

  if (Object.keys(globalCart).length === 0) {
    localStorage.removeItem(CART_KEY); 
  } else {
    localStorage.setItem(CART_KEY, JSON.stringify(globalCart));
  }
};

export const clearRestaurantCart = (restaurantId: string) => {
  if (typeof window === "undefined") return;
  const globalCart = getGlobalCart();
  
  delete globalCart[restaurantId];
  
  if (Object.keys(globalCart).length === 0) {
    localStorage.removeItem(CART_KEY);
  } else {
    localStorage.setItem(CART_KEY, JSON.stringify(globalCart));
  }
};