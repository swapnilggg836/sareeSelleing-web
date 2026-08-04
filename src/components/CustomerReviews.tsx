
import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

// Static fallback reviews when API returns empty
const fallbackReviews = [
  {
    _id: "1",
    title: "Exquisite Paithani Saree",
    customerName: "Priya Sharma",
    customerLocation: "Pune",
    rating: 5,
    comment: "Absolutely stunning quality! The peacock motifs are breathtaking and the silk is incredibly soft. Received so many compliments at the wedding.",
    featured: true,
  },
  {
    _id: "2",
    title: "Perfect for the Wedding",
    customerName: "Meera Kulkarni",
    customerLocation: "Mumbai",
    rating: 5,
    comment: "The Kanjivaram saree I ordered was even more beautiful in person. The zari work is impeccable. Delivery was prompt and packaging was royal!",
    featured: true,
  },
  {
    _id: "3",
    title: "Heirloom Quality Fabric",
    customerName: "Anita Desai",
    customerLocation: "Nashik",
    rating: 5,
    comment: "I've been collecting Paithani sarees for 20 years and this is one of the finest I own. The border work is museum-quality.",
    featured: false,
  },
  {
    _id: "4",
    title: "Authentic & Gorgeous",
    customerName: "Sunita Rao",
    customerLocation: "Hyderabad",
    rating: 5,
    comment: "Finally found a trustworthy place for authentic Paithani sarees online. The colour doesn't fade and the weave is incredibly tight.",
    featured: false,
  },
  {
    _id: "5",
    title: "Stunning Festival Piece",
    customerName: "Kavya Joshi",
    customerLocation: "Nagpur",
    rating: 5,
    comment: "Wore this for Diwali and everyone stopped to ask where I got it. The gold zari catches light beautifully. Will definitely order again!",
    featured: false,
  },
  {
    _id: "6",
    title: "Worth Every Penny",
    customerName: "Rekha Patil",
    customerLocation: "Kolhapur",
    rating: 5,
    comment: "The Bandhani saree I ordered is simply breathtaking. The colours are so vibrant and true to the photos. Excellent customer service too.",
    featured: false,
  },
];

const ReviewCard = ({ review }: { review: any }) => (
  <div className="flex-shrink-0 w-80 md:w-96 bg-crimson-950 rounded-2xl p-7 mx-3 relative overflow-hidden select-none">
    {/* Decorative quote */}
    <Quote className="absolute top-4 right-5 h-10 w-10 text-crimson-800/60" />

    {/* Stars */}
    <div className="flex gap-1 mb-4">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-4 w-4",
            review.rating >= star ? "fill-gold-400 text-gold-400" : "text-crimson-800"
          )}
        />
      ))}
    </div>

    <h4 className="font-serif font-semibold text-white text-base mb-2 leading-snug">
      {review.title}
    </h4>
    <p className="text-crimson-200/80 text-sm leading-relaxed mb-5 italic">
      "{review.comment}"
    </p>

    {/* Customer info */}
    <div className="flex items-center gap-3 border-t border-crimson-800 pt-4">
      <div className="h-9 w-9 rounded-full bg-crimson-800 flex items-center justify-center">
        <span className="text-gold-400 font-bold font-serif text-sm">
          {review.customerName?.charAt(0) || "C"}
        </span>
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{review.customerName}</p>
        {review.customerLocation && (
          <p className="text-crimson-400 text-xs">{review.customerLocation}</p>
        )}
      </div>
      {review.featured && (
        <span className="ml-auto px-2 py-0.5 rounded-full bg-gold-500/20 border border-gold-400/40 text-gold-400 text-[10px] font-bold tracking-wide">
          ★ Featured
        </span>
      )}
    </div>
  </div>
);

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const CustomerReviews = () => {
  const { data: reviewsResponse, isLoading } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/reviews`);
        if (!response.ok) return { data: [] };
        return await response.json();
      } catch (e) {
        return { data: [] };
      }
    },
  });

  const [headRef, headVisible] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  const reviews = reviewsResponse?.data?.length > 0
    ? reviewsResponse.data
    : fallbackReviews;

  const sorted = [
    ...reviews.filter((r: any) => r.featured),
    ...reviews.filter((r: any) => !r.featured),
  ].slice(0, 8);

  // Duplicate for seamless loop
  const doubled = [...sorted, ...sorted];

  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div
          ref={headRef}
          className={cn("text-center mb-14 reveal-up", headVisible && "visible")}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-crimson-300" />
            <span className="text-crimson-600 text-xs font-semibold tracking-[0.25em] uppercase">
              Happy Customers
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-crimson-300" />
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-crimson-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            Join thousands of happy customers who've found their perfect saree with us.
          </p>
          {/* Gold underline */}
          <div className="h-0.5 w-16 bg-gradient-to-r from-gold-400 to-gold-600 rounded mx-auto mt-5" />
        </div>
      </div>

      {/* Auto-scrolling carousel — full-bleed */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 rounded-full border-2 border-crimson-600 border-t-transparent animate-spin" />
        </div>
      ) : (
        <div
          className="flex testimonial-track"
          style={{ width: "max-content" }}
          aria-label="Customer reviews carousel"
        >
          {doubled.map((review: any, i: number) => (
            <ReviewCard key={`${review._id}-${i}`} review={review} />
          ))}
        </div>
      )}
    </section>
  );
};

export default CustomerReviews;
