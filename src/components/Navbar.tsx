import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown, ChevronRight, ShoppingCart, Search, User, LogOut, Edit, Heart, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useLocation } from 'react-router-dom';
import SearchDialog from "@/components/SearchDialog";
import ContactDialog from "@/components/ContactDialog";
import ProfileEditDialog from "@/components/ProfileEditDialog";
import CartPopover from "@/components/CartPopover";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { cartApi } from "@/api/apiClient";
import { cn } from "@/lib/utils";

const categories = [
  { name: "New Arrivals", href: "/category/new-arrivals" },
  { name: "Banarasi Silk", href: "/category/banarasi-silk" },
  { name: "Kanjivaram", href: "/category/kanjivaram" },
  { name: "Patola", href: "/category/patola" },
  { name: "Paithani", href: "/category/paithani" },
  { name: "Bandhani", href: "/category/bandhani" }
];

const collections = [
  { name: "Wedding Collection", href: "/collection/wedding" },
  { name: "Festival Collection", href: "/collection/festival" },
  { name: "Designer Collection", href: "/collection/designer" },
  { name: "Traditional Collection", href: "/collection/traditional" }
];

const quickLinks = [
  { name: "Blog", href: "/blog" },
  { name: "Sale", href: "/sale" },
  { name: "About", href: "/about" },
];

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [mobileColOpen, setMobileColOpen] = useState(false);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);
  const [cartAnimating, setCartAnimating] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();

  const { data: cartData } = useQuery({
    queryKey: ['cartCount'],
    queryFn: () => cartApi.getCart().then(res => res.data),
    staleTime: 60000,
    enabled: isAuthenticated,
  });

  const cartCount = cartData?.items?.length || 0;

  // Sticky shrink on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart bounce animation when count increases
  useEffect(() => {
    if (cartCount > prevCartCount && prevCartCount !== 0) {
      setCartAnimating(true);
      const t = setTimeout(() => setCartAnimating(false), 500);
      return () => clearTimeout(t);
    }
    setPrevCartCount(cartCount);
  }, [cartCount]);

  const handleLogout = async () => {
    try {
      setMobileMenuOpen(false);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActive = (href: string) => location.pathname === href;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full bg-white transition-all duration-250",
          scrolled
            ? "py-0 shadow-[0_2px_20px_rgba(179,32,58,0.10)]"
            : "py-0 shadow-sm"
        )}
      >
        <div className="container mx-auto px-4">
          {/* Top bar */}
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-250",
              scrolled ? "py-2" : "py-4"
            )}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex flex-col leading-none">
                <span
                  className={cn(
                    "font-serif font-bold text-crimson-700 transition-all duration-250",
                    scrolled ? "text-xl" : "text-2xl"
                  )}
                >
                  Crimson Paithani
                </span>
                <span className="text-[10px] tracking-[0.18em] text-gold-600 font-medium uppercase">
                  Emporium
                </span>
              </div>
            </Link>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
              <SearchDialog />

              <Link
                to="/wishlist"
                className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-crimson-600 transition-colors px-2 py-1"
              >
                <Heart className="h-4.5 w-4.5" />
                <span className="hidden lg:inline">Wishlist</span>
              </Link>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative rounded-full">
                      <Avatar className={cn("transition-all duration-250", scrolled ? "h-7 w-7" : "h-8 w-8")}>
                        <AvatarImage src={user?.profileImage} alt={user?.name} />
                        <AvatarFallback className="bg-crimson-100 text-crimson-700 text-xs font-bold">
                          {user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem className="font-medium text-crimson-700">
                      {user?.name}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsProfileEditOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}

              <CartPopover>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn("relative", cartAnimating && "cart-bounce")}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-crimson-600 text-[10px] font-bold"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </CartPopover>
            </div>

            {/* Mobile actions */}
            <div className="flex items-center gap-1 md:hidden">
              <SearchDialog />
              <Link to="/wishlist">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <CartPopover>
                <Button variant="ghost" size="icon" className={cn("relative", cartAnimating && "cart-bounce")}>
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-crimson-600 text-[10px]">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </CartPopover>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:block border-t border-gray-100">
            <ul className="flex items-center justify-center gap-8 py-2.5">
              <li>
                <Link
                  to="/"
                  className={cn("text-sm font-medium transition-colors fancy-underline", isActive('/') ? 'text-crimson-700 active' : 'text-gray-700 hover:text-crimson-600')}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className={cn("text-sm font-medium transition-colors fancy-underline", isActive('/about') ? 'text-crimson-700 active' : 'text-gray-700 hover:text-crimson-600')}
                >
                  About
                </Link>
              </li>

              {/* Categories mega-dropdown */}
              <li className="relative group/cat">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-crimson-600 transition-colors py-2.5 fancy-underline">
                  Categories <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover/cat:rotate-180 duration-200" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/cat:opacity-100 group-hover/cat:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-4 w-56">
                    {categories.map((cat) => (
                      <Link
                        key={cat.href}
                        to={cat.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-crimson-50 hover:text-crimson-700 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gold-400 flex-shrink-0" />
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Collections mega-dropdown */}
              <li className="relative group/col">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-crimson-600 transition-colors py-2.5 fancy-underline">
                  Collections <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover/col:rotate-180 duration-200" />
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover/col:opacity-100 group-hover/col:visible transition-all duration-200 z-50">
                  <div className="bg-white rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-gray-100 p-4 w-60">
                    {collections.map((col) => (
                      <Link
                        key={col.href}
                        to={col.href}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-crimson-50 hover:text-crimson-700 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-crimson-400 flex-shrink-0" />
                        {col.name}
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <Link
                        to="/collections"
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-crimson-600 tracking-wide uppercase hover:text-crimson-800 transition-colors"
                      >
                        View All Collections <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </li>

              <li>
                <Link
                  to="/sale"
                  className={cn(
                    "text-sm font-medium transition-colors fancy-underline sale-pulse",
                    isActive('/sale') ? 'text-crimson-700 active' : 'text-crimson-600 hover:text-crimson-800 font-semibold'
                  )}
                >
                  Sale 🔥
                </Link>
              </li>

              <li>
                <button
                  className="text-sm font-medium text-gray-700 hover:text-crimson-600 transition-colors fancy-underline"
                  onClick={() => setIsContactDialogOpen(true)}
                >
                  Contact
                </button>
              </li>

              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn("text-sm font-medium transition-colors fancy-underline", isActive(link.href) ? 'text-crimson-700 active' : 'text-gray-700 hover:text-crimson-600')}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <ContactDialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen} />
        <ProfileEditDialog open={isProfileEditOpen} onOpenChange={setIsProfileEditOpen} />
      </header>

      {/* ── Mobile full-screen slide-in menu ── */}
      <div className={cn("mobile-menu-panel", mobileMenuOpen && "open")}>
        {/* Backdrop */}
        <div
          className="mobile-menu-backdrop"
          onClick={() => setMobileMenuOpen(false)}
        />

        {/* Drawer */}
        <div className="mobile-menu-drawer">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <div className="flex flex-col leading-none">
              <span className="font-serif font-bold text-crimson-700 text-xl">Crimson Paithani</span>
              <span className="text-[10px] tracking-[0.18em] text-gold-600 font-medium uppercase">Emporium</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-crimson-50 hover:text-crimson-600 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Nav links */}
          <nav className="px-4 py-4 space-y-1">
            {[{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }, { name: 'Sale 🔥', href: '/sale' }, { name: 'Blog', href: '/blog' }].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-crimson-50 text-crimson-700"
                    : "text-gray-700 hover:bg-gray-50 hover:text-crimson-600"
                )}
              >
                {link.name}
              </Link>
            ))}

            {/* Categories accordion */}
            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileCatOpen((v) => !v)}
              >
                Categories
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileCatOpen && "rotate-180")} />
              </button>
              {mobileCatOpen && (
                <div className="pl-4 mt-1 space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.href}
                      to={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-crimson-600 hover:bg-crimson-50 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Collections accordion */}
            <div>
              <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setMobileColOpen((v) => !v)}
              >
                Collections
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", mobileColOpen && "rotate-180")} />
              </button>
              {mobileColOpen && (
                <div className="pl-4 mt-1 space-y-0.5">
                  {collections.map((col) => (
                    <Link
                      key={col.href}
                      to={col.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-gray-600 hover:text-crimson-600 hover:bg-crimson-50 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-crimson-400" />
                      {col.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button
              className="flex items-center w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-crimson-600 transition-colors"
              onClick={() => { setMobileMenuOpen(false); setIsContactDialogOpen(true); }}
            >
              Contact
            </button>
          </nav>

          {/* Auth section */}
          <div className="border-t border-gray-100 px-4 py-4 mt-2">
            {isAuthenticated ? (
              <div className="space-y-2">
                <div className="flex items-center gap-3 px-4 py-3 bg-crimson-50 rounded-xl">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user?.profileImage} alt={user?.name} />
                    <AvatarFallback className="bg-crimson-200 text-crimson-800 font-bold text-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm text-crimson-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setMobileMenuOpen(false); setIsProfileEditOpen(true); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="h-4 w-4" /> Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm text-crimson-600 hover:bg-crimson-50"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-crimson-600 text-white rounded-xl text-sm font-semibold hover:bg-crimson-700 transition-colors"
              >
                <User className="h-4 w-4" /> Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
