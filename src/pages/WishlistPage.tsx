
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/hooks/use-wishlist';
import { cartApi } from '@/api/apiClient';
import { toast } from 'sonner';
import ProductCard from '@/components/ProductCard';

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  const addToCart = async (productId: string) => {
    try {
      await cartApi.addToCart(productId, 1);
      toast.success('Product added to cart');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 fancy-underline">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Add items you love to your wishlist. Review them anytime and easily move them to the cart.
            </p>
            <Button asChild>
              <a href="/">Continue Shopping</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <ProductCard 
                key={item.id}
                id={item.id}
                name={item.name}
                price={item.price}
                images={item.images.map((url) => ({ url, alt: item.name }))}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
