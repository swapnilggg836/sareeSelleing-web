
import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { wishlistApi } from '@/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  images: string[];
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await wishlistApi.getWishlist();
      const items = response.data.items.map((item: any) => ({
        id: item.product._id,
        name: item.product.name,
        price: item.product.price,
        images: item.product.images.map((img: any) => img.url)
      }));
      setWishlistItems(items);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (product: WishlistItem) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      await wishlistApi.addToWishlist(product.id);
      setWishlistItems(prev => [...prev, product]);
      toast.success('Added to wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to wishlist');
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated) return;

    try {
      await wishlistApi.removeFromWishlist(productId);
      setWishlistItems(prev => prev.filter(item => item.id !== productId));
      toast.success('Removed from wishlist');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from wishlist');
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.id === productId);
  };

  const clearWishlist = async () => {
    if (!isAuthenticated) return;

    try {
      await wishlistApi.clearWishlist();
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error: any) {
      toast.error(error.message || 'Failed to clear wishlist');
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
