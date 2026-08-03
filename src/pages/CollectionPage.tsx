
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi, collectionsApi } from '@/api/apiClient';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const CollectionPage = () => {
  const { collectionId, collection: collectionParam } = useParams();
  const collection = collectionId || collectionParam;
  
  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products-by-collection', collection],
    queryFn: async () => {
      const response = await productsApi.getAllProducts();
      // Filter products by collection/category
      const filteredProducts = response.data.filter((product: any) =>
        product.category?.toLowerCase().replace(' ', '-') === collection
      );
      return { data: filteredProducts };
    },
    enabled: !!collection,
  });

  const { data: collectionData, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection-details', collection],
    queryFn: () => collectionsApi.getAllCollections(),
  });

  const products = productsResponse?.data || [];
  const collections = collectionData?.data || [];
  const currentCollection = collections.find((col: any) => 
    col.name.toLowerCase().replace(' ', '-') === collection
  );

  const getCollectionTitle = (col: string) => {
    switch (col) {
      case 'wedding': return 'Wedding Collection';
      case 'festival': return 'Festival Collection';
      case 'designer': return 'Designer Collection';
      case 'traditional': return 'Traditional Collection';
      default: return 'Collection';
    }
  };

  const getCollectionDescription = (col: string) => {
    if (currentCollection) {
      return currentCollection.description;
    }
    
    switch (col) {
      case 'wedding': return 'Exquisite sarees for your special wedding moments';
      case 'festival': return 'Vibrant sarees perfect for festive celebrations';
      case 'designer': return 'Contemporary designer sarees with modern appeal';
      case 'traditional': return 'Classic traditional sarees with timeless elegance';
      default: return 'Explore our beautiful collection';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          {currentCollection?.image && (
            <div className="w-full h-64 mb-6 rounded-lg overflow-hidden">
              <img 
                src={currentCollection.image} 
                alt={currentCollection.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl font-bold text-crimson-700 mb-4">
            {currentCollection?.name || getCollectionTitle(collection || '')}
          </h1>
          <p className="text-gray-600 text-lg">
            {getCollectionDescription(collection || '')}
          </p>
        </div>

        {productsLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product: any) => (
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
                We don't have any products in this collection yet. Please check back later.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
