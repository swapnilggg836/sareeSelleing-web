import React, { useState, useRef } from "react";
import { Heart, RotateCw, Eye, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import BuyNowModal from "./BuyNowModal";

/**
 * ProductCard — Flip Edition
 * -----------------------------------------------------------------
 * Front  : product image (slow zoom on hover), wishlist heart,
 *          NEW / SALE ribbon, price, Quick View + Buy Now overlay.
 * Back   : Deep crimson bg, fabric/occasion/price, colour swatches,
 *          Add to Cart (gold) + View Details (outline).
 *
 * Desktop: flips on card hover OR explicit Quick View click.
 * Mobile : flips ONLY on Quick View tap — image tap still navigates
 *          to product page (avoids the classic mobile flip-card trap).
 *
 * All existing props API preserved: id, name, price, images, onAddToCart.
 * -----------------------------------------------------------------
 */

interface ProductImage {
  url: string;
}

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  fabric?: string;
  occasion?: string;
  colors?: string[];
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
  className?: string;
  [key: string]: any;
}

const ProductCard = ({
  id,
  name,
  price,
  compareAtPrice,
  images,
  fabric,
  occasion,
  colors = [],
  isNew,
  onAddToCart,
  className,
  ...rest
}: ProductCardProps) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [buyNowOpen, setBuyNowOpen] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [heartAnimating, setHeartAnimating] = useState(false);
  const isTouchDevice = useRef(
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
  );

  const onSale = compareAtPrice != null && compareAtPrice > price;

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setHeartAnimating(true);
    setTimeout(() => setHeartAnimating(false), 400);
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist({ id, name, price, images });
      toast.success("Added to wishlist ❤️");
    }
  };

  const handleFlipClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFlipped((f) => !f);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(id);
    toast.success("Added to cart 🛍️");
  };

  // On touch devices, disable hover-flip and only allow explicit flip via button
  const flipClass = isTouchDevice.current ? "" : "md:group";

  return (
    <div
      className={cn(
        "relative card-flip",
        flipClass,
        flipped && "is-flipped",
        className
      )}
      style={{ height: "420px" }}
      {...rest}
    >
      <div className="card-flip-inner rounded-xl h-full">

        {/* ════════════════ FRONT FACE ════════════════ */}
        <div className="card-face rounded-xl bg-white shadow-[0_4px_20px_rgba(179,32,58,0.08)] overflow-hidden flex flex-col">

          {/* Image zone */}
          <div className="relative overflow-hidden" style={{ height: "280px", flexShrink: 0 }}>
            <Link
              to={`/product/${id}`}
              onClick={(e) => { if (flipped) e.preventDefault(); }}
              className="block w-full h-full"
              tabIndex={flipped ? -1 : 0}
            >
              {images?.length > 0 ? (
                <img
                  src={images[0].url}
                  alt={name}
                  loading="lazy"
                  className={cn(
                    "w-full h-full object-cover transition-transform ease-out",
                    isTouchDevice.current ? "duration-500" : "md:group-hover:scale-110"
                  )}
                  style={{ transitionDuration: isTouchDevice.current ? undefined : '900ms' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-crimson-50 text-crimson-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </Link>

            {/* Hover gradient wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Ribbons */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
              {isNew && (
                <span className="ribbon-in px-2.5 py-1 rounded-full bg-gold-500 text-white text-[10px] font-bold tracking-wider shadow-sm">
                  NEW
                </span>
              )}
              {onSale && (
                <span className="ribbon-in sale-pulse px-2.5 py-1 rounded-full bg-crimson-600 text-white text-[10px] font-bold tracking-wider shadow-sm">
                  SALE
                </span>
              )}
            </div>

            {/* Wishlist heart */}
            <button
              onClick={handleWishlistClick}
              aria-label="Toggle wishlist"
              className="absolute top-3 right-3 z-10 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-transform duration-200 hover:scale-110"
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  heartAnimating && "heart-pop",
                  isInWishlist(id) ? "fill-crimson-600 text-crimson-600" : "text-gray-500"
                )}
              />
            </button>

            {/* Quick actions overlay — slide up on hover */}
            <div className="absolute inset-x-3 bottom-3 flex gap-2 z-10 translate-y-14 opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-300 ease-out">
              <button
                onClick={handleFlipClick}
                className="flex-1 h-9 rounded-full bg-white/95 text-crimson-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow hover:bg-white transition-colors"
                aria-label="Quick view"
              >
                <RotateCw className="h-3.5 w-3.5" /> Quick View
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setBuyNowOpen(true);
                }}
                className="h-9 w-9 rounded-full bg-crimson-600 text-white flex items-center justify-center shadow hover:bg-crimson-700 transition-colors"
                aria-label="Buy now"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile-only: Quick View button always visible */}
            <div className="absolute inset-x-3 bottom-3 flex gap-2 z-10 md:hidden">
              <button
                onClick={handleFlipClick}
                className="flex-1 h-9 rounded-full bg-white/95 text-crimson-700 text-xs font-semibold flex items-center justify-center gap-1.5 shadow"
              >
                <RotateCw className="h-3.5 w-3.5" /> Quick View
              </button>
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setBuyNowOpen(true); }}
                className="h-9 w-9 rounded-full bg-crimson-600 text-white flex items-center justify-center shadow"
                aria-label="Buy now"
              >
                <ShoppingBag className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card footer info */}
          <div className="px-4 py-3 flex-1 flex flex-col justify-between">
            <div>
              <Link to={`/product/${id}`}>
                <h3 className="font-serif font-semibold text-[15px] text-gray-800 hover:text-crimson-700 transition-colors line-clamp-1 leading-snug">
                  {name}
                </h3>
              </Link>
              {fabric && <p className="text-xs text-gray-400 mt-0.5 font-medium">{fabric}</p>}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold text-gray-900 text-base">
                ₹{price.toLocaleString()}
              </span>
              {onSale && compareAtPrice != null && (
                <>
                  <span className="text-xs text-gray-400 line-through">
                    ₹{compareAtPrice.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-crimson-600">
                    {Math.round((1 - price / compareAtPrice) * 100)}% off
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════ BACK FACE ════════════════ */}
        <div className="card-face card-face-back rounded-xl bg-crimson-950 text-white shadow-[0_4px_24px_rgba(68,13,23,0.35)] overflow-hidden flex flex-col p-5">
          
          {/* Flip-back button */}
          <button
            onClick={handleFlipClick}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-10"
            aria-label="Flip back to front"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>

          {/* Gold accent line */}
          <div className="h-0.5 w-10 bg-gold-500 rounded mb-3" />

          <h3 className="font-serif text-lg font-semibold mb-3 pr-10 leading-snug">{name}</h3>

          <div className="space-y-2 text-sm flex-1">
            {fabric && (
              <div className="flex gap-2">
                <span className="text-gold-400 font-semibold w-20 flex-shrink-0">Fabric</span>
                <span className="text-crimson-100/90">{fabric}</span>
              </div>
            )}
            {occasion && (
              <div className="flex gap-2">
                <span className="text-gold-400 font-semibold w-20 flex-shrink-0">Occasion</span>
                <span className="text-crimson-100/90">{occasion}</span>
              </div>
            )}
            <div className="flex gap-2">
              <span className="text-gold-400 font-semibold w-20 flex-shrink-0">Price</span>
              <span className="text-white font-bold">₹{price.toLocaleString()}</span>
            </div>
            {onSale && compareAtPrice != null && (
              <div className="flex gap-2">
                <span className="text-gold-400 font-semibold w-20 flex-shrink-0">You save</span>
                <span className="text-green-400 font-semibold">
                  ₹{(compareAtPrice - price).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Colour swatches */}
          {colors.length > 0 && (
            <div className="flex items-center gap-2 my-3">
              <span className="text-xs text-gold-400 font-semibold">Colours:</span>
              <div className="flex gap-1.5">
                {colors.map((c) => (
                  <span
                    key={c}
                    className="w-5 h-5 rounded-full border-2 border-white/30 shadow-sm"
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex gap-2 mt-auto pt-3 border-t border-white/10">
            <Button
              size="sm"
              className="flex-1 bg-gold-500 hover:bg-gold-600 text-crimson-950 font-bold text-xs"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Link to={`/product/${id}`} className="flex-1">
              <Button
                size="sm"
                variant="outline"
                className="w-full border-white/30 text-white hover:bg-white/10 text-xs"
              >
                <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <BuyNowModal
        open={buyNowOpen}
        onOpenChange={setBuyNowOpen}
        product={{ id, name, price, images }}
      />
    </div>
  );
};

export default ProductCard;
