import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const CategoryPage = () => {
  const { category } = useParams();
  
  const { data: categoriesResponse, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
    },
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products', category],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
    },
  });

  const categories = categoriesResponse?.data || [];
  const products = productsResponse?.data || [];
  
  // Find the current category by slug
  const currentCategory = categories.find((cat: any) => 
    cat.name === category
  );

  // If the category param is missing or not matched, show ALL products:
  const showAllProducts =
    !category ||
    !currentCategory ||
    category === "Products" ||
    category === "products";

  const categoryProducts = showAllProducts
    ? products
    : products.filter((product: any) => product.category === category);

  console.log('Total products:', products.length);
  console.log('Category products:', categoryProducts.length);
  console.log('Current category from URL:', category);
  console.log('Found category in DB:', currentCategory);

  const getCategoryTitle = (cat: string) => {
    if (currentCategory) {
      return currentCategory.name
        .split('-')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    if (showAllProducts) return 'Products';
    switch (cat) {
      case 'new-arrivals': return 'New Arrivals';
      case 'banarasi-silk': return 'Banarasi Silk';
      case 'kanjivaram': return 'Kanjivaram';
      case 'patola': return 'Patola';
      case 'paithani': return 'Paithani';
      case 'bandhani': return 'Bandhani';
      default: return 'Products';
    }
  };

  const getCategoryDescription = (cat: string) => {
    if (currentCategory) return currentCategory.description;
    if (showAllProducts) return 'Browse our entire collection of products.';
    switch (cat) {
      case 'new-arrivals': return 'Discover our latest collection of handcrafted sarees';
      case 'banarasi-silk': return 'Luxurious Banarasi silk sarees with intricate brocade work';
      case 'kanjivaram': return 'Premium Kanjivaram silk sarees from South India';
      case 'patola': return 'Traditional Patola sarees with geometric patterns';
      case 'paithani': return 'Elegant Paithani sarees with rich borders and motifs';
      case 'bandhani': return 'Vibrant Bandhani sarees with tie-dye patterns';
      default: return 'Explore our collection';
    }
  };

  if (categoriesLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          {currentCategory?.image && (
            <div className="w-full h-64 mb-6 rounded-lg overflow-hidden">
              <img 
                src={`/api${currentCategory.image}`} 
                alt={currentCategory.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide the image container if the image fails to load
                  const target = e.target as HTMLImageElement;
                  const container = target.parentElement;
                  if (container) {
                    container.style.display = 'none';
                  }
                }}
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-crimson-700 mb-4">
            {getCategoryTitle(category || '')}
          </h1>
          <p className="text-gray-600 text-lg">
            {getCategoryDescription(category || '')}
          </p>
          
          {/* Debug information - remove this after testing */}
          <div className="bg-gray-100 p-4 rounded-lg mt-4 text-sm">
            <p><strong>Debug Info:</strong></p>
            <p>URL Category: {category}</p>
            <p>Total Products: {products.length}</p>
            <p>Filtered Products: {categoryProducts.length}</p>
            <p>Category Found in DB: {currentCategory ? 'Yes' : 'No'}</p>
            <p>Show All Products: {showAllProducts ? 'Yes' : 'No'}</p>
          </div>
          
          {/* Category Information Card */}
          {currentCategory && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Category Name</p>
                    <p className="font-medium">{getCategoryTitle(currentCategory.name)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="font-medium">{categoryProducts.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        currentCategory.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {currentCategory.active ? 'Active' : 'Inactive'}
                      </span>
                      {currentCategory.featured && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product: any) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                images={product.images}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardHeader>
              <CardTitle>No Products Found</CardTitle>
              <CardDescription>
                {showAllProducts
                  ? "We don't have any products yet. Please add some products to see them here."
                  : `We don't have any products in the "${getCategoryTitle(category || '')}" category yet. Please make sure products are created with the category name "${category}".`}
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
