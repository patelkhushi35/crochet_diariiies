import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await api.get('/wishlist');
      setItems(res.data.items || []);
    } catch (error) {
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        setItems(JSON.parse(localWishlist));
      }
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const saveToLocal = (wishlistItems) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  };

  const toggleWishlist = async (product) => {
    const exists = items.some(item => item._id === product._id);
    
    let newItems;
    if (exists) {
      newItems = items.filter(item => item._id !== product._id);
      toast.success('Removed from wishlist');
    } else {
      newItems = [...items, product];
      toast.success('Added to wishlist!');
    }

    setItems(newItems);
    saveToLocal(newItems);

    try {
      await api.post('/auth/wishlist/' + product._id);
    } catch (error) {
      // Continue with local wishlist
    }
  };

  const isInWishlist = (productId) => {
    return items.some(item => item._id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
    localStorage.removeItem('wishlist');
  };

  return (
    <WishlistContext.Provider value={{
      items,
      loading,
      toggleWishlist,
      isInWishlist,
      clearWishlist,
      refreshWishlist: fetchWishlist,
      count: items.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}