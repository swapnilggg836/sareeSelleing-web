
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cartApi } from '@/api/apiClient';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import BuyNowModal from './BuyNowModal';

interface CartItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    images: string[];
  };
  quantity: number;
  color: string;
  price: number;
}

interface CartPopoverProps {
  children: React.ReactNode;
}

const CartPopover: React.FC<CartPopoverProps> = ({ children }) => {
  const { data: cartData, isLoading, error, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartApi.getCart().then(res => res.data),
    staleTime: 60000, // 1 minute
  });

  const handleRemoveItem = async (itemId: string) => {
    try {
      await cartApi.removeCartItem(itemId);
      refetch();
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleCheckout = () => {
    // Implement checkout functionality here
    console.log('Proceeding to checkout with items:', cartData?.items);
    // Redirect to a checkout page or show a modal
  };

  // State for individual "Buy Now" modal per cart item
  const [buyNowInfo, setBuyNowInfo] = useState<{
    open: boolean;
    item: CartItem | null;
  }>({
    open: false,
    item: null,
  });

  const handleBuyNowClick = (item: CartItem) => {
    setBuyNowInfo({
      open: true,
      item,
    });
  };

  const closeBuyNowModal = () => {
    setBuyNowInfo({
      open: false,
      item: null,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-lg">Your Cart</h4>
          <span className="bg-crimson-100 text-crimson-700 text-xs px-2 py-1 rounded-full">
            {isLoading ? '...' : cartData?.items?.length || 0} items
          </span>
        </div>
        
        <div className="max-h-[50vh] overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="text-center py-4">Loading cart...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Error loading cart. Please try again.
            </div>
          ) : cartData?.items?.length === 0 ? (
            <div className="text-center py-8 px-4">
              <ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            cartData?.items?.map((item: CartItem) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gray-100 rounded">
                    {item.product.images && item.product.images.length > 0 ? (
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-gray-200 rounded">
                        <ShoppingBag className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      {item.color && (
                        <span className="mr-2 flex items-center">
                          <span 
                            className="w-3 h-3 rounded-full mr-1 inline-block" 
                            style={{ backgroundColor: item.color }} 
                          />
                          {item.color}
                        </span>
                      )}
                      <span>Qty: {item.quantity}</span>
                    </div>
                    <p className="text-crimson-600 font-medium text-sm mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs w-20 mt-1"
                    onClick={() => handleBuyNowClick(item)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartData?.items?.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between text-sm font-medium">
              <span>Total</span>
              <span>₹{cartData?.totalPrice || 0}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
            >
              Buy Now
            </Button>
          </div>
        )}

        {/* BuyNowModal appears for the selected cart item */}
        {buyNowInfo.item && (
          <BuyNowModal
            open={buyNowInfo.open}
            onOpenChange={open => {
              if (!open) closeBuyNowModal();
            }}
            product={{
              id: buyNowInfo.item.product._id,
              name: buyNowInfo.item.product.name,
              price: buyNowInfo.item.price,
              images: buyNowInfo.item.product.images?.length
                ? buyNowInfo.item.product.images.map((img, idx) =>
                    typeof img === "string"
                      ? { url: img }
                      : img
                  )
                : [],
              color: buyNowInfo.item.color,
            }}
          />
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CartPopover;

