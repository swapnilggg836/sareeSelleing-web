
import { useNavigate } from 'react-router-dom';
import BannerCarousel from './BannerCarousel';

interface HeroProps {
  banners?: any[];
}

const Hero = ({ banners = [] }: HeroProps) => {
  const navigate = useNavigate();

  const handleShopCollection = () => {
    navigate('/collections');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  // If we have banners, use the carousel, otherwise show default hero
  if (banners && banners.length > 0) {
    return (
      <section className="relative">
        <BannerCarousel banners={banners} />
      </section>
    );
  }

  // Fallback hero section
  return (
    <section className="relative bg-cover bg-center h-[60vh] md:h-[70vh] flex items-center" 
             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583391733856-f2996e47cbf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')" }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Elegance Woven In Every Thread
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-8">
            Discover the timeless beauty of traditional Pithani sarees crafted with exquisite artistry and heritage
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={handleShopCollection}
              className="bg-crimson-600 hover:bg-crimson-700 text-white px-8 py-6 rounded-md transition-colors duration-300"
            >
              Shop Collection
            </button>
            <button 
              onClick={handleLearnMore}
              className="bg-transparent border-white text-white hover:bg-white/20 px-8 py-6 rounded-md border transition-colors duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
