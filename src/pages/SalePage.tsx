
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag, Filter, SortAsc } from "lucide-react";

// Scroll-to-products utility
function scrollToProducts() {
  const el = document.getElementById("sale-products-grid");
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const SalePage = () => {
  const [showAllSale, setShowAllSale] = useState(false);

  const { data: salesResponse, isLoading: salesLoading } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/sales');
      return response.json();
    },
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/products');
      return response.json();
    },
  });

  const sales = salesResponse?.data || [];
  const products = productsResponse?.data || [];
  
  // Get active and featured sales
  const activeSales = sales.filter((sale: any) => sale.active);
  const featuredSales = activeSales.filter((sale: any) => sale.featured);

  // ---- SALE PRODUCTS LOGIC ----
  // If sale object has productId or products: [] field, filter accordingly
  // Let's support both: sale.productId or sale.products (array)
  let saleProductIds: Set<string> = new Set();
  for (const sale of activeSales) {
    // Support both possible formats (your backend might use either!)
    if (Array.isArray(sale.products) && sale.products.length > 0) {
      sale.products.forEach((p: any) => {
        if (typeof p === "string") saleProductIds.add(p);
        else if (typeof p === "object" && p._id) saleProductIds.add(p._id);
      });
    }
    if (sale.productId) saleProductIds.add(sale.productId);
  }

  let saleProducts = [];
  if (saleProductIds.size > 0) {
    saleProducts = products.filter((product: any) => saleProductIds.has(product._id));
  } else {
    // If no linkage found, fallback to old logic (first 6 products), but warn in summary!
    saleProducts = products.slice(0, 6);
  }

  // Render
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-50 to-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Tag className="h-8 w-8 text-red-600" />
              <Badge variant="destructive" className="text-lg px-4 py-2">
                MEGA SALE
              </Badge>
            </div>
            
            {featuredSales.length > 0 ? (
              <div className="mb-8">
                {featuredSales.map((sale: any) => (
                  <div key={sale._id} className="mb-6">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                      {sale.title}
                    </h1>
                    <div className="text-3xl font-bold text-red-600 mb-4">
                      {sale.discountType === 'percentage' ? `${sale.discountValue}% Off` : `₹${sale.discountValue} Off`}
                    </div>
                    <p className="text-lg md:text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
                      {sale.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  Special Offers
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                  Discover incredible deals on our finest collection of traditional sarees.
                </p>
              </div>
            )}
            
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="text-red-600 border-red-600">
                Free Shipping
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Easy Returns
              </Badge>
              <Badge variant="outline" className="text-red-600 border-red-600">
                Authentic Products
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Active Sales Information */}
      {activeSales.length > 0 && (
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Current Sales</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeSales.map((sale: any) => (
                <Card key={sale._id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {sale.title}
                      {sale.featured && <Badge>Featured</Badge>}
                    </CardTitle>
                    <CardDescription>{sale.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600 mb-2">
                      {sale.discountType === 'percentage' ? `${sale.discountValue}%` : `₹${sale.discountValue}`} OFF
                    </div>
                    <p className="text-sm text-gray-600">
                      Valid until: {new Date(sale.endDate).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter and Sort Section */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Sale Items</h2>
              <p className="text-gray-600">
                {salesLoading || productsLoading ? 'Loading...' : `${saleProducts.length} products on sale`}
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                Sort by
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12" id="sale-products-grid">
        <div className="container mx-auto px-4">
          {salesLoading || productsLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
          ) : saleProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {saleProducts.map((product: any) => (
                <div key={product._id} className="relative">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="destructive" className="text-xs font-bold">
                      SALE
                    </Badge>
                  </div>
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    images={product.images}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-16">
              <CardHeader>
                <CardTitle>No Sale Items Available</CardTitle>
                <CardDescription>
                  Check back later for amazing deals on our products.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Don't Miss Out!
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            These amazing offers won't last forever. Shop now and save big on your favorite traditional sarees.
          </p>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => {
              setShowAllSale(true);
              setTimeout(scrollToProducts, 150); // Ensure grid is visible on click
            }}
          >
            Shop All Sale Items
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SalePage;
