import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  active: boolean;
  position: string;
}

interface BannerCarouselProps {
  banners: Banner[];
  className?: string;
}

const SLIDE_DURATION = 5000; // ms

const BannerCarousel = ({ banners, className = "" }: BannerCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [textKey, setTextKey] = useState(0); // forces re-mount of text to re-trigger animations
  const navigate = useNavigate();

  const activeBanners = banners.filter(banner => banner.active);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setTextKey(k => k + 1);
  }, []);

  const goToPrevious = useCallback(() => {
    goToSlide(currentIndex === 0 ? activeBanners.length - 1 : currentIndex - 1);
  }, [currentIndex, activeBanners.length, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentIndex === activeBanners.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, activeBanners.length, goToSlide]);

  useEffect(() => {
    if (!isAutoPlaying || activeBanners.length <= 1) return;
    const interval = setInterval(goToNext, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isAutoPlaying, activeBanners.length, goToNext]);

  if (activeBanners.length === 0) {
    // Fallback hero with ken-burns
    return (
      <div className={cn("relative h-[70vh] md:h-[85vh] overflow-hidden rounded-none", className)}>
        <div
          key="fallback"
          className="absolute inset-0 bg-cover bg-center hero-slide-bg"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1583391733856-f2996e47cbf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-950/80 via-crimson-950/40 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-2xl">
              <p className="hero-text-0 text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Heritage Collection
              </p>
              <h1 className="hero-text-1 text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                Elegance Woven In Every Thread
              </h1>
              <p className="hero-text-2 text-white/85 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
                Discover timeless Paithani sarees crafted with exquisite artistry and centuries of heritage
              </p>
              <div className="hero-text-3 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/collections')}
                  className="shimmer-btn hero-gradient text-white px-10 py-4 text-base font-semibold rounded-full border-0 hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(211,46,68,0.4)]"
                >
                  Shop Paithani Collection
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="bg-transparent border-2 border-white/70 text-white hover:bg-white/10 px-10 py-4 text-base rounded-full transition-all"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentBanner = activeBanners[currentIndex];

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Background with ken-burns — key forces animation restart on slide change */}
        <div
          key={`bg-${currentIndex}`}
          className="absolute inset-0 bg-cover bg-center hero-slide-bg"
          style={{
            backgroundImage: `url(${currentBanner.image
              ? (currentBanner.image.startsWith('http') ? currentBanner.image : `http://localhost:5000${currentBanner.image}`)
              : 'https://images.unsplash.com/photo-1583391733856-f2996e47cbf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'})`
          }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-crimson-950/80 via-crimson-950/40 to-transparent" />

        {/* Text content — key forces re-mount to replay animations on slide change */}
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div key={`text-${textKey}`} className="max-w-2xl">
              <p className="hero-text-0 text-gold-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4">
                Heritage Collection
              </p>
              <h1 className="hero-text-1 text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white mb-6 leading-tight">
                {currentBanner.title}
              </h1>
              {currentBanner.subtitle && (
                <p className="hero-text-2 text-white/85 text-lg md:text-xl mb-10 leading-relaxed max-w-xl">
                  {currentBanner.subtitle}
                </p>
              )}
              <div className="hero-text-3 flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() => navigate('/collections')}
                  className="shimmer-btn hero-gradient text-white px-10 py-4 text-base font-semibold rounded-full border-0 hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(211,46,68,0.4)]"
                >
                  Shop Paithani Collection
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/about')}
                  className="bg-transparent border-2 border-white/70 text-white hover:bg-white/10 px-10 py-4 text-base rounded-full transition-all"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Arrow navigation */}
      {activeBanners.length > 1 && (
        <>
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/25"
            onClick={goToPrevious}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white/25"
            onClick={goToNext}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dash indicators with progress */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className="relative h-1 rounded-full overflow-hidden transition-all duration-300"
              style={{ width: index === currentIndex ? 40 : 16 }}
            >
              {/* Background track */}
              <span className="absolute inset-0 bg-white/35 rounded-full" />
              {/* Fill */}
              {index === currentIndex && isAutoPlaying ? (
                <span
                  key={`fill-${currentIndex}`}
                  className="absolute inset-y-0 left-0 rounded-full bg-gold-400"
                  style={{
                    width: '100%',
                    animation: `dashFill ${SLIDE_DURATION}ms linear forwards`,
                  }}
                />
              ) : (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: index === currentIndex ? '#F59E0B' : 'transparent' }}
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerCarousel;
