
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import ProductShowcase from "@/components/ProductShowcase";
import Features from "@/components/Features";
import CustomerReviews from "@/components/CustomerReviews"; // <-- swap this in!
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  // Fetch collections, banners, blog posts for the home page
  const { data: collectionsResponse } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/collections');
      return response.json();
    },
  });

  const { data: bannersResponse } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/banners');
      return response.json();
    },
  });

  const { data: blogResponse } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/blog');
      return response.json();
    },
  });

  const { data: salesResponse } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/sales');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero banners={bannersResponse?.data || []} />
        <FeaturedCollections collections={collectionsResponse?.data || []} />
        <ProductShowcase sales={salesResponse?.data || []} />
        <Features />
        <CustomerReviews />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
