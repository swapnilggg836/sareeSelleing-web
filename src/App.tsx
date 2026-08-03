import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/hooks/use-wishlist";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import FaqPage from "./pages/FaqPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import ShippingPage from "./pages/ShippingPage";
import ReturnsPage from "./pages/ReturnsPage";
import SitemapPage from "./pages/SitemapPage";
import BlogPage from "./pages/BlogPage";
import CategoryPage from "./pages/CategoryPage";
import CollectionPage from "./pages/CollectionPage";
import CollectionsPage from "./pages/CollectionsPage";
import ProfileSettings from "./pages/ProfileSettings";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import NotFound from "./pages/NotFound";
import WishlistPage from "./pages/WishlistPage";
import SalePage from "./pages/SalePage";
import BannersPage from "./pages/BannersPage";
import ProductDetailPage from "./pages/ProductDetailPage";

// Admin imports
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminIssues from "./pages/admin/AdminIssues";
import AdminPostData from "./pages/admin/AdminPostData";
import AdminManageData from "./pages/admin/AdminManageData";

// Admin sub-pages
import ManageProducts from "./pages/admin/products/ManageProducts";
import ProductForm from "./pages/admin/products/ProductForm";
import ManageCollections from "./pages/admin/collections/ManageCollections";
import CollectionForm from "./pages/admin/collections/CollectionForm";
import ManageBanners from "./pages/admin/banners/ManageBanners";
import BannerForm from "./pages/admin/banners/BannerForm";
import ManageCategories from "./pages/admin/categories/ManageCategories";
import CategoryForm from "./pages/admin/categories/CategoryForm";
import ManageBlog from "./pages/admin/blog/ManageBlog";
import BlogForm from "./pages/admin/blog/BlogForm";
import ManageSale from "./pages/admin/sale/ManageSale";
import SaleForm from "./pages/admin/sale/SaleForm";
import ManageReviews from "./pages/admin/reviews/ManageReviews";
import ReviewForm from "./pages/admin/reviews/ReviewForm";

const queryClient = new QueryClient();

import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/returns" element={<ReturnsPage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/collections/:id" element={<CollectionsPage />} />
                <Route path="/collections" element={<CollectionsPage />} />
                <Route path="/collection/:collectionId" element={<CollectionPage />} />
                <Route path="/profile" element={<ProfileSettings />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/sale" element={<SalePage />} />
                <Route path="/banners" element={<BannersPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Admin Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="contacts" element={<AdminContacts />} />
                  <Route path="newsletter" element={<AdminNewsletter />} />
                  <Route path="notifications" element={<AdminNotifications />} />
                  <Route path="issues" element={<AdminIssues />} />
                  <Route path="post-data" element={<AdminPostData />} />
                  <Route path="manage-data" element={<AdminManageData />} />
                  
                  {/* Product Management */}
                  <Route path="products" element={<ManageProducts />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  
                  {/* Collection Management */}
                  <Route path="collections" element={<ManageCollections />} />
                  <Route path="collections/new" element={<CollectionForm />} />
                  <Route path="collections/:id/edit" element={<CollectionForm />} />
                  
                  {/* Banner Management */}
                  <Route path="banners" element={<ManageBanners />} />
                  <Route path="banners/new" element={<BannerForm />} />
                  <Route path="banners/:id/edit" element={<BannerForm />} />
                  
                  {/* Category Management */}
                  <Route path="categories" element={<ManageCategories />} />
                  <Route path="categories/new" element={<CategoryForm />} />
                  <Route path="categories/:id/edit" element={<CategoryForm />} />
                  
                  {/* Blog Management */}
                  <Route path="blog" element={<ManageBlog />} />
                  <Route path="blog/new" element={<BlogForm />} />
                  <Route path="blog/:id/edit" element={<BlogForm />} />
                  
                  {/* Sale Management */}
                  <Route path="sale" element={<ManageSale />} />
                  <Route path="sale/new" element={<SaleForm />} />
                  <Route path="sale/:id/edit" element={<SaleForm />} />
                  
                  {/* Review Management */}
                  <Route path="reviews" element={<ManageReviews />} />
                  <Route path="reviews/new" element={<ReviewForm />} />
                  <Route path="reviews/:id/edit" element={<ReviewForm />} />
                </Route>
                
                <Route path="/admin/login" element={<AdminLogin />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>

              {/* Floating WhatsApp Widget across entire store */}
              <WhatsAppFloatingButton />
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
