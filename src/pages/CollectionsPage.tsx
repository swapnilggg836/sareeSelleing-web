import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { collectionsApi, productsApi } from '@/api/apiClient';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Grid, List } from 'lucide-react';

const CollectionsPage = () => {
  const { id } = useParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: collectionsResponse, isLoading: collectionsLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: collectionsApi.getAllCollections,
  });

  const { data: collectionResponse, isLoading: collectionLoading } = useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getCollectionById(id!),
    enabled: !!id,
  });

  const { data: productsResponse, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getAllProducts,
  });

  const collections = collectionsResponse?.data || [];
  const collection = collectionResponse?.data;
  const allProducts = productsResponse?.data || [];

  // Updated: If viewing a single collection, show its products using the included populated array.
  const products =
    id && collection && Array.isArray(collection.products)
      ? collection.products // Populated products from backend
      : allProducts;

  if (collectionsLoading || (id && collectionLoading) || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (id && !collection) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Collection Not Found</h1>
            <Link to="/collections">
              <Button>View All Collections</Button>
            </Link>
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
        {id && collection ? (
          // Single collection view
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Link to="/collections">
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">{collection.name}</h1>
                <p className="text-muted-foreground mt-2">{collection.description}</p>
              </div>
            </div>

            {collection.image && (
              <div className="w-full h-64 md:h-96 rounded-lg overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Products in this Collection</h2>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {(!products || products.length === 0) ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No products found in this collection.</p>
              </div>
            ) : (
              <div className={`grid ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'grid-cols-1 gap-4'
              }`}>
                {products.map((product: any) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.price}
                    images={product.images}
                    className={viewMode === 'list' ? 'flex flex-row' : ''}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          // All collections view
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-4">Our Collections</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover our curated collections of beautiful sarees, each telling a unique story
                and crafted with attention to detail.
              </p>
            </div>

            {collections.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-muted-foreground">No collections available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {collections.map((collection: any) => (
                  <Link
                    key={collection._id}
                    to={`/collections/${collection._id}`}
                    className="group block"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                      {collection.image && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={collection.image}
                            alt={collection.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                          {collection.name}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {collection.description}
                        </p>
                        {collection.featured && (
                          <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage;
