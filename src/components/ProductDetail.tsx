import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, ShoppingBag, X } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";
import { cartApi } from "@/api/apiClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductImage {
  url: string;
  alt?: string;
}

interface ProductColor {
  name: string;
  hex: string;
}

interface ProductDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: {
    id: string | number;
    name: string;
    price: number;
    compareAtPrice?: number;
    description?: string;
    details?: string;
    careInstructions?: string;
    images: ProductImage[];
    colors?: ProductColor[];
    sizes?: string[];
  };
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductDetail = ({ open, onOpenChange, product }: ProductDetailProps) => {
  const colors = product.colors && product.colors.length > 0
    ? product.colors
    : [{ name: 'Default', hex: '#D32E44' }];

  const [selectedColor, setSelectedColor] = useState<string>(colors[0]?.hex || '');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { isAuthenticated } = useAuth();

  const handlePrevImage = () => {
    if (!product.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to your cart");
      return;
    }

    try {
      setIsAddingToCart(true);
      const selectedColorName = colors.find((c) => c.hex === selectedColor)?.name || '';

      await cartApi.addToCart(String(product.id), quantity, selectedColorName);
      toast.success(`Added ${product.name} to your cart! 🛍️`);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add item to cart. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const activeImgUrl = product.images && product.images.length > 0
    ? (typeof product.images[currentImageIndex] === 'string'
        ? (product.images[currentImageIndex] as unknown as string)
        : product.images[currentImageIndex]?.url)
    : '/placeholder.svg';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-2xl">
        <div className="grid md:grid-cols-2 gap-0">
          
          {/* Left Side: Product Image Display */}
          <div className="relative bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="aspect-[3/4] w-full relative overflow-hidden rounded-xl bg-white shadow-inner border border-gray-100">
              <img
                src={activeImgUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white text-gray-700 transition-colors"
                    onClick={handlePrevImage}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow hover:bg-white text-gray-700 transition-colors"
                    onClick={handleNextImage}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto w-full justify-center">
                {product.images.map((image, idx) => {
                  const imgUrl = typeof image === 'string' ? image : image.url;
                  return (
                    <button
                      key={idx}
                      className={cn(
                        "w-12 h-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                        idx === currentImageIndex ? "border-crimson-600 ring-2 ring-crimson-600/20" : "border-gray-200 opacity-70 hover:opacity-100"
                      )}
                      onClick={() => setCurrentImageIndex(idx)}
                    >
                      <img src={imgUrl} alt="thumb" className="w-full h-full object-cover" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Side: Product Details & Controls (Matching image_0.png) */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h2>
              <p className="text-2xl font-bold text-crimson-700 font-serif mb-6">
                {formatPrice(product.price)}
              </p>

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="mb-5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">
                    Colors
                  </label>
                  <div className="flex gap-2.5">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        className={cn(
                          "w-7 h-7 rounded-full border-2 transition-all p-0.5 relative",
                          selectedColor === color.hex ? "border-crimson-600 ring-2 ring-crimson-600/30 scale-110" : "border-gray-200 hover:scale-105"
                        )}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.hex)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Counter (- 1 +) */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider block mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-xl w-36 bg-white">
                  <button
                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-xl text-lg font-bold"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-xl text-lg font-bold"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <Button
                className="w-full h-12 bg-crimson-600 hover:bg-crimson-700 text-white font-bold rounded-xl shadow-md mb-6 transition-all"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {isAddingToCart ? 'Adding...' : isAuthenticated ? 'Add to Cart' : 'Login to Add to Cart'}
              </Button>
            </div>

            {/* Tabbed Info (Description, Details, Care) - matches image_0.png */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="description" className="text-xs font-semibold rounded-lg">Description</TabsTrigger>
                <TabsTrigger value="details" className="text-xs font-semibold rounded-lg">Details</TabsTrigger>
                <TabsTrigger value="care" className="text-xs font-semibold rounded-lg">Care</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-3 text-xs text-gray-600 leading-relaxed">
                <p>{product.description || 'Authentic pure silk Paithani saree with handwoven peacock border and rich pallu.'}</p>
              </TabsContent>

              <TabsContent value="details" className="mt-3 text-xs text-gray-600 leading-relaxed">
                <p>{product.details || 'Includes 5.5 meter saree with 0.8 meter unstitched blouse piece. Silk Mark Certified.'}</p>
              </TabsContent>

              <TabsContent value="care" className="mt-3 text-xs text-gray-600 leading-relaxed">
                <p>{product.careInstructions || 'Dry clean only. Store wrapped in pure cotton cloth in a cool place.'}</p>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetail;
