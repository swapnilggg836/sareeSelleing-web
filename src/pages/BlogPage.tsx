
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const BlogPage = () => {
  const { data: blogResponse, isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/blog`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
    },
  });

  const blogPosts = blogResponse?.data || [];

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = '/placeholder.svg';
    console.log('Blog image failed to load, using placeholder');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-crimson-700 mb-8">Blog</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-crimson-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <Card>
                  <CardHeader>
                    <CardTitle>No Blog Posts Available</CardTitle>
                    <CardDescription>
                      Check back later for new articles.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
            ) : (
              blogPosts.map((post: any) => (
                <Card key={post._id} className="hover:shadow-lg transition-shadow">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    <img 
                      src={post.image ? `/api${post.image}` : '/placeholder.svg'} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription>{new Date(post.createdAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-primary/10 text-primary text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
