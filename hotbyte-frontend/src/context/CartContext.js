import React, {
  createContext, useContext,
  useState, useEffect
} from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.role === 'USER') {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const data = await cartService.getCart();
      setCart(data);
      setCartCount(data?.totalItems || 0);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const refreshCart = () => {
    fetchCart();
  };

  return (
    <CartContext.Provider value={{
      cart, cartCount, refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);