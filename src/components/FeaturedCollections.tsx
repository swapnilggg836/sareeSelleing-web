
import { Link } from "react-router-dom";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

interface Collection {
  _id: string;
  name: string;
  description: string;
  image?: string;
  featured: boolean;
}

interface FeaturedCollectionsProps {
  collections: Collection[];
}

const predefinedCategories = [
  {
    name: 'new-arrivals',
    displayName: 'New Arrivals',
    description: 'Discover our latest handcrafted Paithani sarees',
    itemCount: '50+ styles',
    gradient: 'from-crimson-950/75 via-crimson-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1583391733856-f2996e47cbf6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'banarasi-silk',
    displayName: 'Banarasi Silk',
    description: 'Luxurious silk sarees with intricate zari brocade',
    itemCount: '35+ designs',
    gradient: 'from-crimson-950/75 via-crimson-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'kanjivaram',
    displayName: 'Kanjivaram',
    description: 'Premium silk sarees from the looms of South India',
    itemCount: '28+ designs',
    gradient: 'from-crimson-950/75 via-crimson-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1583391734048-a86d58b8c3c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'patola',
    displayName: 'Patola',
    description: 'Traditional double-ikat silk with geometric splendour',
    itemCount: '20+ patterns',
    gradient: 'from-crimson-950/75 via-crimson-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1611042553365-9b101441c135?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'paithani',
    displayName: 'Paithani',
    description: 'Signature peacock motifs woven in pure silk & zari',
    itemCount: '45+ weaves',
    gradient: 'from-crimson-950/75 via-crimson-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'bandhani',
    displayName: 'Bandhani',
    description: 'Vibrant tie-dye sarees with Rajasthani heritage',
    itemCount: '30+ colours',
    gradient: 'from-crimson-950/75 via-crimson-900/40 to-transparent',
    image: 'https://images.unsplash.com/photo-1617143207675-e7e6371f5f5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
];

interface CategoryTileProps {
  category: typeof predefinedCategories[0];
  index: number;
  isVisible: boolean;
}

const CategoryTile = ({ category, index, isVisible }: CategoryTileProps) => {
  const staggerDelay = (index % 3) * 80; // 3-column stagger

  return (
    <Link
      to={`/category/${category.name}`}
      className={cn(
        "reveal-up category-tile block aspect-[3/4]",
        `reveal-stagger-${index % 6}`,
        isVisible && "visible"
      )}
      style={{ transitionDelay: isVisible ? `${staggerDelay}ms` : '0ms' }}
    >
      {/* Image */}
      <img
        src={category.image}
        alt={category.displayName}
        loading="lazy"
        className="cat-img absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient overlay */}
      <div className={cn("absolute inset-0 bg-gradient-to-t", category.gradient)} />

      {/* Gold border on hover */}
      <div className="cat-gold-border" />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 cat-caption">
        <div className="flex items-end justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-white leading-tight mb-1">
              {category.displayName}
            </h3>
            <p className="text-white/75 text-xs leading-snug max-w-[160px]">
              {category.description}
            </p>
          </div>
          <span className="flex-shrink-0 px-2.5 py-1 rounded-full bg-gold-500/20 border border-gold-400/50 text-gold-300 text-[10px] font-semibold tracking-wide ml-2">
            {category.itemCount}
          </span>
        </div>
      </div>
    </Link>
  );
};

const FeaturedCollections = ({ collections }: FeaturedCollectionsProps) => {
  const [gridRef, gridVisible] = useInView<HTMLDivElement>({ threshold: 0.08, triggerOnce: true });
  const [headRef, headVisible] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });
  const [collRef, collVisible] = useInView<HTMLDivElement>({ threshold: 0.08, triggerOnce: true });

  return (
    <section className="py-24" style={{ background: '#FFFDE7' }}>
      <div className="container mx-auto px-4">

        {/* Section heading */}
        <div
          ref={headRef}
          className={cn("text-center mb-14 reveal-up", headVisible && "visible")}
        >
          {/* Decorative gold line */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gold-400" />
            <span className="text-gold-600 text-xs font-semibold tracking-[0.25em] uppercase">
              Our Heritage
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gold-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-crimson-800 mb-4">
            Shop by Category
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto text-base leading-relaxed">
            Each category represents centuries of Indian craftsmanship — explore our curated collections of handwoven silk sarees.
          </p>
        </div>

        {/* 3-column grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6"
        >
          {predefinedCategories.map((category, index) => (
            <CategoryTile
              key={category.name}
              category={category}
              index={index}
              isVisible={gridVisible}
            />
          ))}
        </div>

        {/* Featured collections from DB */}
        {Array.isArray(collections) && collections.filter(c => c && c.featured).length > 0 && (
          <div ref={collRef} className="mt-20">
            <div className={cn("text-center mb-10 reveal-up", collVisible && "visible")}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="h-px w-10 bg-gradient-to-r from-transparent to-crimson-400" />
                <span className="text-crimson-600 text-xs font-semibold tracking-[0.25em] uppercase">
                  Curated For You
                </span>
                <div className="h-px w-10 bg-gradient-to-l from-transparent to-crimson-400" />
              </div>
              <h3 className="text-3xl font-serif font-bold text-crimson-800">
                Featured Collections
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {collections
                .filter(c => c && c.featured)
                .map((collection, index) => (
                  <Link
                    key={collection._id}
                    to={`/collections/${collection._id}`}
                    className={cn(
                      "group reveal-up block bg-white rounded-xl overflow-hidden shadow-[var(--shadow-crimson-sm)] hover:shadow-[var(--shadow-crimson-md)] transition-shadow duration-300",
                      collVisible && "visible"
                    )}
                    style={{ transitionDelay: collVisible ? `${(index % 3) * 80}ms` : '0ms' }}
                  >
                    {collection.image && (
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={collection.image}
                          alt={collection.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-semibold text-crimson-700 mb-1.5">
                        {collection.name}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {collection.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-crimson-600 group-hover:text-crimson-800 transition-colors">
                        View Collection
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCollections;
