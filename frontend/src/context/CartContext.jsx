import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    try {
      const res = await api.get('/cart');
      setItems(res.data.items || []);
    } catch (error) {
      // Cart might be stored locally
      const localCart = localStorage.getItem('cart');
      if (localCart) {
        setItems(JSON.parse(localCart));
      }
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const saveToLocal = (cartItems) => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  const addToCart = async (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const existingIndex = items.findIndex(
      item => item.product === product._id && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize
    );

    let newItems;
    if (existingIndex > -1) {
      newItems = items.map((item, index) =>
        index === existingIndex
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newItems = [...items, {
        product: product._id,
        name: product.name,
        image: product.images[0]?.url,
        price: product.price,
        quantity,
        selectedColor,
        selectedSize,
        slug: product.slug,
      }];
    }

    setItems(newItems);
    saveToLocal(newItems);
    
    try {
      await api.post('/cart/add', { productId: product._id, quantity, selectedColor, selectedSize });
    } catch (error) {
      // Continue with local cart
    }
    
    toast.success(`${product.name} added to cart!`);
  };

  const updateQuantity = async (productId, quantity, selectedColor, selectedSize) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor, selectedSize);
      return;
    }

    const newItems = items.map(item =>
      item.product === productId && 
      item.selectedColor === selectedColor && 
      item.selectedSize === selectedSize
        ? { ...item, quantity }
        : item
    );

    setItems(newItems);
    saveToLocal(newItems);

    try {
      await api.put('/cart/update', { productId, quantity, selectedColor, selectedSize });
    } catch (error) {
      // Continue with local cart
    }
  };

  const removeFromCart = async (productId, selectedColor, selectedSize) => {
    const newItems = items.filter(
      item => !(item.product === productId && 
                item.selectedColor === selectedColor && 
                item.selectedSize === selectedSize)
    );

    setItems(newItems);
    saveToLocal(newItems);

    try {
      await api.delete('/cart/remove', { 
        data: { productId, selectedColor, selectedSize } 
      });
    } catch (error) {
      // Continue with local cart
    }
    
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
    api.delete('/cart/clear').catch(() => {});
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;

  return (
    <CartContext.Provider value={{
      items,
      loading,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      subtotal,
      itemCount,
      shipping,
      tax,
      total,
      refreshCart: fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}