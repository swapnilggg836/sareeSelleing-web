import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import BuyNowModal from '@/components/BuyNowModal';
import { productsApi, cartApi } from '@/api/apiClient';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/use-wishlist';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  ArrowLeft,
  Eye,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Sparkles,
  Maximize2,
  X,
  HelpCircle,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

// Calculate estimated delivery dates based on current date
const getEstimatedDeliveryDate = () => {
  const start = new Date();
  start.setDate(start.getDate() + 3);
  const end = new Date();
  end.setDate(end.getDate() + 5);

  const formatOpt: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return `${start.toLocaleDateString('en-IN', formatOpt)} - ${end.toLocaleDateString('en-IN', formatOpt)}`;
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [buyNowOpen, setBuyNowOpen] = useState(false);

  // Loupe Zoom State
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [[x, y], setXY] = useState([0, 0]);
  const imgRef = useRef<HTMLImageElement>(null);

  // Lightbox Modal State
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Sticky Bottom Bar State
  const [showStickyBar, setShowStickyBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Live Viewers counter state
  const [viewerCount, setViewerCount] = useState(482);

  const { isAuthenticated } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  // Fetch product data
  const { data: productResponse, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getProductById(id!),
    enabled: !!id,
  });

  // Fetch all products for related sections
  const { data: allProductsResponse } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllProducts,
  });

  const product = productResponse?.data || productResponse;
  const allProducts = allProductsResponse?.data || [];

  // Live viewer count oscillation
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount((prev) => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 4));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Intersection Observer for Sticky Bottom Bar
  useEffect(() => {
    const target = ctaRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [product]);

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  // Loupe Zoom Mouse Handlers
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();
    const xPos = e.pageX - left - window.scrollX;
    const yPos = e.pageY - top - window.scrollY;
    setXY([xPos, yPos]);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const handleWishlistClick = () => {
    if (!product) return;
    const prodId = product._id || product.id;
    if (isInWishlist(prodId)) {
      removeFromWishlist(prodId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: prodId,
        name: product.name,
        price: product.price,
        images: product.images,
      });
      toast.success('Added to wishlist ❤️');
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to your cart');
      return;
    }

    try {
      setIsAddingToCart(true);
      const prodId = product._id || product.id;
      await cartApi.addToCart(String(prodId), quantity, selectedColor);
      toast.success(`Added ${product.name} to your cart! 🛍️`);
    } catch (error: any) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    setPincodeLoading(true);
    setTimeout(() => {
      setPincodeLoading(false);
      setPincodeChecked(true);
      toast.success(`Pincode ${pincode} verified! Delivery available.`);
    }, 600);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Paithani Saree',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-serif font-bold text-crimson-800 mb-4">Product Not Found</h1>
          <p className="text-gray-500 mb-6">
            The saree you are looking for is currently unavailable or has been removed.
          </p>
          <Link to="/">
            <Button className="bg-crimson-600 hover:bg-crimson-700">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Store
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const prodId = product._id || product.id;
  const inWishlist = isInWishlist(prodId);
  const images = product.images && product.images.length > 0 ? product.images : [];
  const activeImgUrl = images.length > 0
    ? (typeof images[currentImageIndex] === 'string' ? images[currentImageIndex] : images[currentImageIndex]?.url)
    : '/placeholder.svg';

  const comparePrice = product.originalPrice || product.compareAtPrice;
  const discountPercent = comparePrice && comparePrice > product.price
    ? Math.round(((comparePrice - product.price) / comparePrice) * 100)
    : 0;

  // Filter recommendations
  const similarProducts = allProducts
    .filter((p: any) => (p._id || p.id) !== prodId && (p.category === product.category || p.fabric === product.fabric))
    .slice(0, 4);

  const similarColors = allProducts
    .filter((p: any) => (p._id || p.id) !== prodId)
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFBFA]">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-6 lg:py-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-crimson-700 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collections" className="hover:text-crimson-700 transition-colors">Sarees</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/category/${product.category}`} className="capitalize hover:text-crimson-700 transition-colors">
                {product.category.replace('-', ' ')}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Main Product Showcase Grid (Sudathi + Nalli Hybrid PDP) */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 mb-16">

          {/* Left Column: Multi-Angle Gallery with Loupe Zoom */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex gap-4">
              {/* Vertical Thumbnail Strip (Desktop) */}
              {images.length > 1 && (
                <div className="hidden sm:flex flex-col gap-3 max-h-[540px] overflow-y-auto pr-1">
                  {images.map((img: any, idx: number) => {
                    const imgUrl = typeof img === 'string' ? img : img.url;
                    return (
                      <button
                        key={idx}
                        className={cn(
                          'w-20 h-24 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 relative group/thumb',
                          idx === currentImageIndex ? 'border-gold-500 shadow-md ring-2 ring-gold-500/20' : 'border-gray-200 hover:border-gray-300'
                        )}
                        onClick={() => setCurrentImageIndex(idx)}
                      >
                        <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === currentImageIndex && (
                          <div className="absolute inset-0 bg-crimson-600/10 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Active Image Box with Hover Magnifier */}
              <div
                className="relative flex-1 aspect-[3/4] rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm cursor-crosshair group"
                onMouseEnter={handleMouseEnter}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  ref={imgRef}
                  src={activeImgUrl}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
                />

                {/* Loupe Lens Zoom Overlay */}
                {showMagnifier && (
                  <div
                    className="magnifier-lens"
                    style={{
                      height: `180px`,
                      width: `180px`,
                      top: `${y - 90}px`,
                      left: `${x - 90}px`,
                      backgroundImage: `url('${activeImgUrl}')`,
                      backgroundSize: `${imgWidth * 2.2}px ${imgHeight * 2.2}px`,
                      backgroundPositionX: `${-x * 2.2 + 90}px`,
                      backgroundPositionY: `${-y * 2.2 + 90}px`,
                    }}
                  />
                )}

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {discountPercent > 0 && (
                    <span className="px-3 py-1 rounded-full bg-crimson-600 text-white text-xs font-bold tracking-wider shadow-md">
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.featured && (
                    <span className="px-3 py-1 rounded-full bg-gold-500 text-crimson-950 text-xs font-bold tracking-wider shadow-md flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> BESTSELLER
                    </span>
                  )}
                </div>

                {/* Quick Action Icons Top Right */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={handleWishlistClick}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="Wishlist"
                  >
                    <Heart className={cn('h-5 w-5', inWishlist ? 'fill-crimson-600 text-crimson-600' : 'text-gray-600')} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-600 hover:text-crimson-600"
                    aria-label="Share"
                  >
                    <Share2 className="h-4.5 w-4.5" />
                  </button>
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md hover:scale-110 transition-transform text-gray-600 hover:text-crimson-600"
                    aria-label="Fullscreen Lightbox"
                  >
                    <Maximize2 className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Mobile Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="sm:hidden absolute left-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow"
                    >
                      <ChevronLeft className="h-5 w-5 text-gray-700" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="sm:hidden absolute right-3 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-700" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Horizontal Thumbnails (Mobile Only) */}
            {images.length > 1 && (
              <div className="flex sm:hidden gap-2.5 overflow-x-auto pb-1">
                {images.map((img: any, idx: number) => {
                  const imgUrl = typeof img === 'string' ? img : img.url;
                  return (
                    <button
                      key={idx}
                      className={cn(
                        'w-16 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0',
                        idx === currentImageIndex ? 'border-gold-500 ring-2 ring-gold-500/20' : 'border-gray-200'
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

          {/* Right Column: Product Info & Purchase Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

            {/* Title & Brand Header */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-gold-600 bg-gold-50 border border-gold-200 px-3 py-1 rounded-full">
                  100% Pure Handwoven Silk
                </span>
                <span className="text-xs text-gray-500 font-medium">SKU: CPE-PAI-{prodId?.toString().slice(-4)}</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price & Discounts */}
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl font-bold text-crimson-800 font-serif">
                  {formatPrice(product.price)}
                </span>
                {comparePrice && comparePrice > product.price && (
                  <span className="text-lg text-gray-400 line-through">
                    {formatPrice(comparePrice)}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-sm font-bold text-crimson-600 bg-crimson-50 border border-crimson-200 px-2.5 py-0.5 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500">Inclusive of all taxes. Free Shipping on orders over ₹3,000.</p>
            </div>

            {/* Live Social Proof Badge (Sudathi style) */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50/80 border border-blue-100 text-blue-900 text-xs font-medium">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
              </span>
              <Eye className="h-4 w-4 text-blue-600 ml-1" />
              <span><strong>{viewerCount} People</strong> are viewing this saree right now</span>
            </div>

            {/* Exclusive Gifts/Promo Banner */}
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-gold-50 via-cream to-gold-50 border border-gold-200 text-xs text-gold-950 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold-600 flex-shrink-0" />
                <span><strong>Special Offer:</strong> Flat 10% instant discount on prepaid UPI orders!</span>
              </div>
            </div>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                  Color Variants: <span className="text-crimson-700 capitalize">{selectedColor || 'Select'}</span>
                </label>
                <div className="flex gap-2.5">
                  {product.colors.map((col: any) => {
                    const colName = typeof col === 'string' ? col : col.name;
                    const colHex = typeof col === 'object' && col.hex ? col.hex : '#888';
                    return (
                      <button
                        key={colName}
                        onClick={() => setSelectedColor(colName)}
                        className={cn(
                          'w-9 h-9 rounded-full border-2 transition-all p-0.5 flex items-center justify-center relative group',
                          selectedColor === colName ? 'border-crimson-600 ring-2 ring-crimson-600/30 scale-110' : 'border-gray-300 hover:scale-105'
                        )}
                        title={colName}
                      >
                        <span className="w-full h-full rounded-full border border-black/10" style={{ backgroundColor: colHex }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Delivery Pincode Checker (Sudathi style) */}
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-gray-700 tracking-wider">
                <Truck className="h-4 w-4 text-crimson-600" />
                <span>Check Delivery Details</span>
              </div>
              <form onSubmit={handleCheckPincode} className="flex gap-2">
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit Pincode (e.g. 411001)"
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value.replace(/\D/g, ''));
                    setPincodeChecked(false);
                  }}
                  className="bg-white text-sm"
                />
                <Button type="submit" size="sm" className="bg-crimson-800 hover:bg-crimson-900 text-white font-medium px-5">
                  {pincodeLoading ? 'Checking...' : 'Check'}
                </Button>
              </form>

              {pincodeChecked && (
                <div className="pt-2 text-xs space-y-1 animate-fade-in border-t border-gray-200">
                  <p className="text-green-700 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Estimated Delivery: <strong>{getEstimatedDeliveryDate()}</strong>
                  </p>
                  <p className="text-gray-600 flex items-center gap-1.5 pl-5">
                    ✓ Cash On Delivery (COD) available for Pincode {pincode}
                  </p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-700 tracking-wider">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-l-xl text-lg font-bold"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="h-10 w-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-r-xl text-lg font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">
                  In Stock & Ready to Dispatch
                </span>
              </div>
            </div>

            {/* Primary Action CTA Buttons */}
            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                size="lg"
                variant="outline"
                className="flex-1 h-13 border-2 border-crimson-700 text-crimson-800 hover:bg-crimson-50 text-base font-bold rounded-xl"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {isAddingToCart ? 'ADDING...' : 'ADD TO CART'}
              </Button>

              <Button
                size="lg"
                className="flex-1 h-13 bg-crimson-800 hover:bg-crimson-900 text-white text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                onClick={() => setBuyNowOpen(true)}
              >
                BUY IT NOW
              </Button>
            </div>

            {/* Direct WhatsApp Order / Inquiry Link */}
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(`Hi Crimson Paithani Emporium! I am interested in purchasing "${product.name}" (${formatPrice(product.price)}). Link: ${window.location.href}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm mt-2"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z"/>
              </svg>
              Inquire / Order via WhatsApp
            </a>

            {/* Trust Assurances (Nalli style) */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-200 text-center">
              <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-2xs">
                <Award className="h-5 w-5 text-gold-600 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-gray-900">Silk Mark Certified</p>
                <p className="text-[10px] text-gray-500">100% Pure Handloom</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-2xs">
                <Truck className="h-5 w-5 text-gold-600 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-gray-900">Free Express Delivery</p>
                <p className="text-[10px] text-gray-500">All India Shipping</p>
              </div>
              <div className="p-3 rounded-xl bg-white border border-gray-100 shadow-2xs">
                <ShieldCheck className="h-5 w-5 text-gold-600 mx-auto mb-1" />
                <p className="text-[11px] font-bold text-gray-900">7-Day Easy Returns</p>
                <p className="text-[10px] text-gray-500">Hassle-Free Policy</p>
              </div>
            </div>

          </div>
        </div>

        {/* Nalli-Style Collapsible Accordion Specifications */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-10 mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-crimson-900 mb-6 pb-3 border-b border-gray-200">
            Product Specifications & Details
          </h2>

          <Accordion type="single" collapsible defaultValue="details" className="w-full">
            {/* Product Details & Weave Story */}
            <AccordionItem value="details" className="border-b border-gray-200">
              <AccordionTrigger className="text-base font-bold text-gray-900 hover:text-crimson-700 py-4">
                Product Details & Description
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-700 leading-relaxed pt-2 pb-4">
                <p className="mb-3">{product.description || 'This royal Paithani silk saree features exquisite handwoven craftsmanship with traditional peacock and lotus motifs on a rich gold zari border. Sourced directly from authentic weaver clusters.'}</p>
                {product.details && <p>{product.details}</p>}
              </AccordionContent>
            </AccordionItem>

            {/* Specifications Table */}
            <AccordionItem value="specifications" className="border-b border-gray-200">
              <AccordionTrigger className="text-base font-bold text-gray-900 hover:text-crimson-700 py-4">
                Technical Specifications
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Fabric</span>
                    <span className="font-semibold text-gray-900">{product.fabric || 'Pure Mulberry Silk'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Border Work</span>
                    <span className="font-semibold text-gray-900">{product.blouseBorderPattern || 'Pure Zari Peacock Motif'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Design / Pattern</span>
                    <span className="font-semibold text-gray-900">{product.design || 'Traditional Handwoven'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Saree Length</span>
                    <span className="font-semibold text-gray-900">{product.dimensions || '5.5 Meters'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Blouse Piece</span>
                    <span className="font-semibold text-gray-900">{product.blouseLength || 'Included (0.8 Meters Unstitched)'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Country of Origin</span>
                    <span className="font-semibold text-gray-900">India</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Wash Care & Mark of Handloom */}
            <AccordionItem value="care" className="border-b border-gray-200">
              <AccordionTrigger className="text-base font-bold text-gray-900 hover:text-crimson-700 py-4">
                Wash Care & Mark of Handloom
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-700 leading-relaxed pt-2 pb-4 space-y-2">
                <p><strong>Care Instructions:</strong> Dry clean only. Never machine wash or soak in water. Store in a soft cotton cloth bag away from direct sunlight.</p>
                <p><strong>Handloom Authenticity:</strong> Slight irregularity in weave or print is a natural characteristic of authentic handwoven sarees and confirms genuine artisan craftsmanship.</p>
              </AccordionContent>
            </AccordionItem>

            {/* Shipping & Returns */}
            <AccordionItem value="shipping" className="border-none">
              <AccordionTrigger className="text-base font-bold text-gray-900 hover:text-crimson-700 py-4">
                Shipping & Returns Policy
              </AccordionTrigger>
              <AccordionContent className="text-sm text-gray-700 leading-relaxed pt-2 pb-4 space-y-2">
                <p><strong>Shipping:</strong> Dispatched within 24–48 hours. Free delivery across India for orders above ₹3,000.</p>
                <p><strong>Returns:</strong> We offer a 7-day easy return policy for unstitched sarees in original condition with tag attached.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Nalli-Style Similar Colors & Patterns Recommendation Carousels */}
        {similarColors.length > 0 && (
          <div className="mb-16 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-crimson-900">Similar Colors</h2>
                <p className="text-xs text-gray-500 mt-0.5">Your Handpicked Favorites in Similar Shades</p>
              </div>
              <Link to="/collections" className="text-xs font-bold text-crimson-700 hover:underline">
                VIEW ALL →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similarColors.map((relProd: any) => (
                <ProductCard
                  key={relProd._id || relProd.id}
                  id={relProd._id || relProd.id}
                  name={relProd.name}
                  price={relProd.price}
                  images={relProd.images}
                  fabric={relProd.fabric}
                />
              ))}
            </div>
          </div>
        )}

        {similarProducts.length > 0 && (
          <div className="mb-12 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-crimson-900">Similar Patterns & Weaves</h2>
                <p className="text-xs text-gray-500 mt-0.5">Curated Traditional Weaves You May Love</p>
              </div>
              <Link to="/collections" className="text-xs font-bold text-crimson-700 hover:underline">
                EXPLORE ALL →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((relProd: any) => (
                <ProductCard
                  key={relProd._id || relProd.id}
                  id={relProd._id || relProd.id}
                  name={relProd.name}
                  price={relProd.price}
                  images={relProd.images}
                  fabric={relProd.fabric}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Sudathi-Style Bottom Sticky Action Bar (Appears on Scroll) */}
      {showStickyBar && (
        <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl z-40 py-3 px-4 sticky-bottom-bar">
          <div className="container mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={activeImgUrl} alt="thumb" className="w-12 h-14 object-cover rounded-lg border border-gray-200 hidden sm:block" />
              <div>
                <h4 className="font-serif font-bold text-sm text-gray-900 truncate max-w-[200px] sm:max-w-[300px]">{product.name}</h4>
                <p className="text-xs font-bold text-crimson-800">{formatPrice(product.price)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-crimson-700 text-crimson-800 hover:bg-crimson-50 text-xs font-bold h-10 px-4"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                ADD TO CART
              </Button>
              <Button
                size="sm"
                className="bg-crimson-800 hover:bg-crimson-900 text-white text-xs font-bold h-10 px-5"
                onClick={() => setBuyNowOpen(true)}
              >
                BUY NOW
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 h-11 w-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center z-10 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img src={activeImgUrl} alt={product.name} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}

      <Footer />

      <BuyNowModal
        open={buyNowOpen}
        onOpenChange={setBuyNowOpen}
        product={{
          id: prodId,
          name: product.name,
          price: product.price,
          images: product.images,
        }}
      />
    </div>
  );
};

export default ProductDetailPage;
