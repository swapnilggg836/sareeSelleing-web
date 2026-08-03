
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BannerCarousel from '@/components/BannerCarousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BannersPage = () => {
  const { data: bannersResponse, isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/banners');
      return response.json();
    },
  });

  const banners = bannersResponse?.data || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Banner Carousel */}
        {banners.length > 0 && (
          <div className="mb-12">
            <BannerCarousel banners={banners} />
          </div>
        )}

        {/* Banners Grid Section */}
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-crimson-700 mb-8 text-center">Our Promotional Banners</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {banners.length === 0 ? (
                <Card className="text-center py-16">
                  <CardHeader>
                    <CardTitle>No Banners Available</CardTitle>
                    <CardDescription>
                      Check back later for promotional banners.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((banner: any) => (
                    <Card key={banner._id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                      <div className="aspect-[16/9] w-full overflow-hidden">
                        <img 
                          src={banner.image ? `http://localhost:5000${banner.image}` : '/placeholder.svg'} 
                          alt={banner.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <CardTitle className="text-xl font-bold text-crimson-700 group-hover:text-crimson-800 transition-colors">
                              {banner.title}
                            </CardTitle>
                            {banner.subtitle && (
                              <CardDescription className="mt-2 text-gray-600">
                                {banner.subtitle}
                              </CardDescription>
                            )}
                          </div>
                          {/* Three dots indicator */}
                          <div className="flex space-x-1 ml-4">
                            <div className="w-2 h-2 bg-crimson-500 rounded-full"></div>
                            <div className="w-2 h-2 bg-crimson-400 rounded-full"></div>
                            <div className="w-2 h-2 bg-crimson-300 rounded-full"></div>
                          </div>
                        </div>
                        
                        {/* Banner Position Badge */}
                        <div className="mt-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            banner.position === 'hero' 
                              ? 'bg-blue-100 text-blue-800' 
                              : banner.position === 'secondary'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {banner.position.charAt(0).toUpperCase() + banner.position.slice(1)} Banner
                          </span>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BannersPage;
