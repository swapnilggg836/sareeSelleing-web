
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const features = [
  {
    id: 1,
    title: "Authentic Craftsmanship",
    description: "Each saree is handcrafted by skilled artisans using traditional techniques passed down through generations.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    stat: "200+ Artisans",
  },
  {
    id: 2,
    title: "Premium Quality",
    description: "We source only the finest silk and zari materials to ensure exceptional quality and longevity.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    stat: "100% Pure Silk",
  },
  {
    id: 3,
    title: "Secure Payment",
    description: "Shop confidently with Razorpay-secured transactions, UPI, cards, and Net Banking.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    stat: "PCI-DSS Certified",
  },
  {
    id: 4,
    title: "Pan-India Delivery",
    description: "Free shipping across India for orders above ₹3,000. International shipping available.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    stat: "Free Shipping ₹3k+",
  },
];

const trustBadges = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    label: "100% Handwoven",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    label: "Free Shipping",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    label: "Easy Returns",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "Secure Payment",
  },
];

const Features = () => {
  const [headRef, headVisible] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
  const [cardsRef, cardsVisible] = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true });
  const [badgesRef, badgesVisible] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">

        {/* Heading */}
        <div
          ref={headRef}
          className={cn("text-center mb-14 reveal-up", headVisible && "visible")}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase">Our Promise</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-crimson-800 mb-4">
            Why Choose Us
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">
            We bring you the finest Paithani silk sarees with craftsmanship you can feel and service you can trust.
          </p>
        </div>

        {/* Feature cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={cn(
                "feature-card reveal-up group bg-[#FFFDE7] p-7 rounded-2xl border border-gold-100 text-center",
                cardsVisible && "visible"
              )}
              style={{ transitionDelay: cardsVisible ? `${index * 80}ms` : '0ms' }}
            >
              {/* Icon circle */}
              <div className="mx-auto mb-5 h-16 w-16 rounded-2xl bg-white border border-gold-200 flex items-center justify-center text-crimson-600 shadow-[var(--shadow-crimson-sm)] group-hover:bg-crimson-600 group-hover:text-white group-hover:border-crimson-600 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-crimson-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                {feature.description}
              </p>
              <span className="inline-block px-3 py-1 rounded-full bg-crimson-50 text-crimson-700 text-xs font-bold tracking-wide">
                {feature.stat}
              </span>
            </div>
          ))}
        </div>

        {/* Trust badges strip */}
        <div
          ref={badgesRef}
          className="flex flex-wrap justify-center gap-6 md:gap-10 pt-8 border-t border-gray-100"
        >
          {trustBadges.map((badge, index) => (
            <div
              key={badge.label}
              className={cn(
                "trust-badge flex items-center gap-2.5",
                badgesVisible && "visible"
              )}
              style={{ transitionDelay: badgesVisible ? `${index * 100}ms` : '0ms' }}
            >
              <div className="h-10 w-10 rounded-full bg-gold-50 border border-gold-200 flex items-center justify-center text-gold-600">
                {badge.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700">{badge.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;
