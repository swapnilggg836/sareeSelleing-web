
import { useQuery } from '@tanstack/react-query';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import FeaturedCollections from "@/components/FeaturedCollections";
import ProductShowcase from "@/components/ProductShowcase";
import Features from "@/components/Features";
import CustomerReviews from "@/components/CustomerReviews"; // <-- swap this in!
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const Index = () => {
  // Fetch collections, banners, blog posts for the home page
  const { data: collectionsResponse } = useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/collections`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
    },
  });

  const { data: bannersResponse } = useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/banners`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
    },
  });

  const { data: blogResponse } = useQuery({
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

  const { data: salesResponse } = useQuery({
    queryKey: ['sales'],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/sales`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
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
