import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart } from 'lucide-react';
import ProductDetail from "@/components/ProductDetail";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/use-wishlist";
import { toast } from "sonner";
import { productsApi, cartApi } from "@/api/apiClient";

interface ProductShowcaseProps {
  sales?: any[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

const ProductShowcase = ({ sales = [] }: ProductShowcaseProps) => {
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, string>>({});
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [products, setProducts] = useState<Record<string, any[]>>({
    all: [],
    wedding: [],
    festival: [],
    designer: []
  });
  const [filteredProducts, setFilteredProducts] = useState<Record<string, any[]>>({
    all: [],
    wedding: [],
    festival: [],
    designer: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const { isAuthenticated } = useAuth();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Sample products fallback
  const sampleProducts = {
    "all": [
      {
        id: 1,
        _id: "1",
        name: "Royal Banarasi Silk Saree",
        price: 12999,
        image: "https://images.unsplash.com/photo-1610222259863-8bc4e3da9139?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Exquisite Banarasi silk saree with intricate gold zari work and rich traditional motifs. Perfect for wedding ceremonies and special occasions.",
        details: "Crafted from pure silk with traditional weaving techniques. Features elaborate paisley and floral patterns with gold zari work throughout the body and pallu.",
        careInstructions: "Dry clean only. Store in a cool, dry place. Avoid direct sunlight to prevent color fading.",
        images: [
          { url: "https://images.unsplash.com/photo-1610222259863-8bc4e3da9139?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Royal Banarasi Silk Saree Front View" },
        ],
        colors: [
          { name: "crimson", hex: "#D32E44" },
          { name: "gold", hex: "#F59E0B" },
          { name: "emerald", hex: "#059669" }
        ]
      },
      {
        id: 2,
        _id: "2",
        name: "Pure Kanjivaram Silk Saree",
        price: 15999,
        image: "https://images.unsplash.com/photo-1603995126906-16a549b0d8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        description: "Timeless Kanjivaram silk saree from Tamil Nadu with a rich temple border and contrasting pallu.",
        images: [
          { url: "https://images.unsplash.com/photo-1603995126906-16a549b0d8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", alt: "Pure Kanjivaram Silk Saree Front View" },
        ],
        colors: [
          { name: "purple", hex: "#7E22CE" },
          { name: "teal", hex: "#0D9488" },
          { name: "navy", hex: "#1E3A8A" }
        ]
      },
      {
        id: 3,
        _id: "3",
        name: "Traditional Patola Silk Saree",
        price: 17999,
        image: "https://images.unsplash.com/photo-1573566428335-4e3abe259c95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "maroon", hex: "#9F1239" },
          { name: "forest", hex: "#166534" },
          { name: "mustard", hex: "#CA8A04" }
        ]
      },
      {
        id: 4,
        _id: "4",
        name: "Handwoven Paithani Silk Saree",
        price: 19999,
        image: "https://images.unsplash.com/photo-1602764363500-e8e8e0a38e3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "magenta", hex: "#C026D3" },
          { name: "royal blue", hex: "#1D4ED8" },
          { name: "orange", hex: "#EA580C" }
        ]
      },
    ],
    "wedding": [
      {
        id: 5,
        _id: "5",
        name: "Bridal Silk Saree",
        price: 24999,
        image: "https://images.unsplash.com/photo-1610189715216-8aa88377feb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "red", hex: "#B91C1C" },
          { name: "maroon", hex: "#9F1239" },
          { name: "burgundy", hex: "#831843" }
        ]
      },
      {
        id: 6,
        _id: "6",
        name: "Wedding Kanjivaram Saree",
        price: 22999,
        image: "https://images.unsplash.com/photo-1609748340878-91065c1f02ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "gold", hex: "#F59E0B" },
          { name: "crimson", hex: "#D32E44" },
          { name: "purple", hex: "#7E22CE" }
        ]
      },
    ],
    "festival": [
      {
        id: 7,
        _id: "7",
        name: "Festive Bandhani Saree",
        price: 11999,
        image: "https://images.unsplash.com/photo-1581403341630-a6e0b9d2d257?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "yellow", hex: "#EAB308" },
          { name: "pink", hex: "#EC4899" },
          { name: "orange", hex: "#EA580C" }
        ]
      },
      {
        id: 8,
        _id: "8",
        name: "Diwali Special Silk Saree",
        price: 13999,
        image: "https://images.unsplash.com/photo-1625741131137-0cb1673312d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "orange", hex: "#EA580C" },
          { name: "yellow", hex: "#EAB308" },
          { name: "red", hex: "#B91C1C" }
        ]
      },
    ],
    "designer": [
      {
        id: 9,
        _id: "9",
        name: "Designer Silk Saree",
        price: 29999,
        image: "https://images.unsplash.com/photo-1623003641765-264006a79392?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "teal", hex: "#0D9488" },
          { name: "navy", hex: "#1E3A8A" },
          { name: "forest", hex: "#166534" }
        ]
      },
      {
        id: 10,
        _id: "10",
        name: "Luxury Designer Collection",
        price: 34999,
        image: "https://images.unsplash.com/photo-1573811377786-03619aaf31ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        colors: [
          { name: "burgundy", hex: "#831843" },
          { name: "navy", hex: "#1E3A8A" },
          { name: "emerald", hex: "#059669" }
        ]
      },
    ]
  };
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        console.log('Attempting to fetch products from API...');
        
        // Try to fetch from API first
        const allProductsResponse = await productsApi.getAllProducts();
        const allProducts = allProductsResponse.data || [];
        
        // Fetch category specific products
        const weddingProducts = await productsApi.getProductsByCategory('wedding');
        const festivalProducts = await productsApi.getProductsByCategory('festival');
        const designerProducts = await productsApi.getProductsByCategory('designer');
        
        if (allProducts.length === 0) {
          setProducts(sampleProducts);
          setFilteredProducts(sampleProducts);
        } else {
          const fetchedProducts = {
            all: allProducts,
            wedding: (weddingProducts.data && weddingProducts.data.length > 0) ? weddingProducts.data : allProducts,
            festival: (festivalProducts.data && festivalProducts.data.length > 0) ? festivalProducts.data : allProducts,
            designer: (designerProducts.data && designerProducts.data.length > 0) ? designerProducts.data : allProducts
          };
          setProducts(fetchedProducts);
          setFilteredProducts(fetchedProducts);
        }
        
        // Initialize color selection for each product
        const colorMap: Record<string, string> = {};
        allProducts.forEach((product: any) => {
          if (product.colors && product.colors.length > 0) {
            colorMap[product._id] = product.colors[0].hex;
          }
        });
        
        setSelectedColorMap(colorMap);
        setError(null);
        console.log('Products fetched successfully from API');
      } catch (err) {
        console.error('Failed to fetch products from API:', err);
        console.log('Using fallback sample products');
        setError('Backend server not available. Showing sample products.');
        
        // Fallback to using static data if API fails
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
        
        // Initialize color selection for sample products
        const colorMap: Record<string, string> = {};
        Object.values(sampleProducts).flat().forEach((product: any) => {
          if (product.colors && product.colors.length > 0) {
            colorMap[product._id] = product.colors[0].hex;
          }
        });
        setSelectedColorMap(colorMap);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    const applyFiltersAndSort = () => {
      const filtered: Record<string, any[]> = {};
      
      Object.entries(products).forEach(([category, items]) => {
        let filteredItems = [...items];
        
        // Apply price filter
        if (priceRange !== 'all') {
          filteredItems = filteredItems.filter(product => {
            switch (priceRange) {
              case 'under-15000':
                return product.price < 15000;
              case '15000-25000':
                return product.price >= 15000 && product.price <= 25000;
              case 'over-25000':
                return product.price > 25000;
              default:
                return true;
            }
          });
        }
        
        // Apply sort
        filteredItems.sort((a, b) => {
          switch (sortBy) {
            case 'price-low':
              return a.price - b.price;
            case 'price-high':
              return b.price - a.price;
            case 'name':
              return a.name.localeCompare(b.name);
            default:
              return 0;
          }
        });
        
        filtered[category] = filteredItems;
      });
      
      setFilteredProducts(filtered);
    };
    
    applyFiltersAndSort();
  }, [products, sortBy, priceRange]);
  
  const handleColorSelect = (productId: string, colorHex: string) => {
    setSelectedColorMap({
      ...selectedColorMap,
      [productId]: colorHex
    });
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login first to add items to your wishlist");
      return;
    }

    const productId = product._id || product.id.toString();
    const wishlistProduct = {
      id: productId,
      name: product.name,
      price: product.price,
      images: product.images ? product.images.map((img: any) => img.url) : product.image ? [product.image] : []
    };

    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(wishlistProduct);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent, product: any) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error("Please login first to add items to your cart");
      return;
    }
    
    try {
      console.log('Attempting to add to cart:', product.name);
      const targetId = String(product._id || product.id);
      
      const selectedColorName = product.colors?.find(
        (c: any) => c.hex === selectedColorMap[targetId]
      )?.name || '';
      
      // Try API first, fallback to local storage simulation
      try {
        await cartApi.addToCart(targetId, 1, selectedColorName);
        toast.success(`Added ${product.name} to cart 🛍️`);
      } catch (apiError) {
        console.warn('API add to cart failed, simulating locally:', apiError);
        
        // Simulate successful cart addition for demo purposes
        const cartItems = JSON.parse(localStorage.getItem('demo_cart') || '[]');
        const existingItemIndex = cartItems.findIndex((item: any) => 
          item.productId === targetId && item.color === selectedColorName
        );
        
        if (existingItemIndex > -1) {
          cartItems[existingItemIndex].quantity += 1;
        } else {
          cartItems.push({
            productId: targetId,
            name: product.name,
            price: product.price,
            color: selectedColorName,
            quantity: 1,
            image: product.image || product.images?.[0]?.url
          });
        }
        
        localStorage.setItem('demo_cart', JSON.stringify(cartItems));
        toast.success(`Added ${product.name} to cart`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Helper for image URLs (ensures backend image path is absolute)
  const getProductImageUrl = (product: any) => {
    let url = (product.images && product.images.length > 0) ? product.images[0].url : (product.image || '');
    if (!url) return '/placeholder.svg';
    if (url.startsWith('/uploads/')) {
      return `/api${url}`;
    }
    return url;
  };

  // Handle image loading error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
    console.log('Product showcase image failed to load, using placeholder');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our exquisite collection of Pithani sarees available in multiple colors
            {sales.length > 0 && <span className="block mt-2 text-crimson-600 font-semibold">Special offers available!</span>}
          </p>
        </div>
        
        {error && (
          <div className="text-center mb-8 text-amber-600 bg-amber-50 p-4 rounded-lg">
            {error}
          </div>
        )}

        {/* Filter and Sort Controls */}
        <div className="flex flex-wrap gap-4 justify-center mb-8">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="under-15000">Under ₹15,000</SelectItem>
              <SelectItem value="15000-25000">₹15,000 - ₹25,000</SelectItem>
              <SelectItem value="over-25000">Over ₹25,000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="wedding">Wedding</TabsTrigger>
              <TabsTrigger value="festival">Festival</TabsTrigger>
              <TabsTrigger value="designer">Designer</TabsTrigger>
            </TabsList>
          </div>
          
          {Object.entries(filteredProducts).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <Card key={i} className="product-card overflow-hidden border-transparent animate-pulse">
                      <div className="aspect-square bg-gray-200"></div>
                      <CardContent className="pt-4">
                        <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-5 bg-gray-200 rounded mb-4 w-1/2"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((product) => {
                    const productId = product._id || product.id;
                    const productImage = getProductImageUrl(product);

                    // Check if this product is on sale
                    const onSale = sales.find(sale => sale.productId === productId);
                    const salePrice = onSale ? product.price * (1 - onSale.discountPercentage / 100) : null;
                    
                    const isProductInWishlist = isInWishlist(productId.toString());
                      
                    return (
                      <Card 
                        key={productId} 
                        className="product-card overflow-hidden border-transparent hover:border-gray-200 cursor-pointer relative"
                        onClick={() => handleProductClick(product)}
                      >
                        {onSale && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold z-10">
                            {onSale.discountPercentage}% OFF
                          </div>
                        )}
                        
                        {/* Wishlist Heart Button */}
                        <button
                          onClick={(e) => handleWishlistToggle(e, product)}
                          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm z-10 transition-colors"
                          aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        >
                          <Heart 
                            size={18} 
                            className={isProductInWishlist ? "fill-red-500 text-red-500" : "text-gray-500 hover:text-red-500"} 
                          />
                        </button>
                        
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={productImage}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            onError={handleImageError}
                          />
                        </div>
                        
                        <CardContent className="pt-4">
                          <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                          <div className="mb-3">
                            {salePrice ? (
                              <div className="flex items-center gap-2">
                                <span className="text-crimson-700 font-medium">{formatPrice(salePrice)}</span>
                                <span className="text-gray-500 line-through text-sm">{formatPrice(product.price)}</span>
                              </div>
                            ) : (
                              <p className="text-crimson-700 font-medium">{formatPrice(product.price)}</p>
                            )}
                          </div>
                          
                          {product.colors && product.colors.length > 0 && (
                            <div className="flex items-center mb-4 gap-2">
                              <span className="text-sm text-gray-500">Colors:</span>
                              <div className="flex gap-2">
                                {product.colors.map((color: any) => (
                                  <button
                                    key={color.name}
                                    className={`w-6 h-6 rounded-full border-2 ${
                                      selectedColorMap[productId] === color.hex ? 'border-crimson-500 ring-1 ring-crimson-500' : 'border-gray-200'
                                    }`}
                                    style={{ backgroundColor: color.hex }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleColorSelect(productId, color.hex);
                                    }}
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <Button 
                            className="w-full bg-crimson-600 hover:bg-crimson-700"
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            {isAuthenticated ? "Add to Cart" : "Login to Add"}
                          </Button>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
        
        <div className="text-center mt-12">
          <Button variant="outline" className="text-crimson-600 border-crimson-600 hover:bg-crimson-50 px-8">
            View All Products
          </Button>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetail 
            open={isProductDetailOpen} 
            onOpenChange={setIsProductDetailOpen} 
            product={selectedProduct}
          />
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;
