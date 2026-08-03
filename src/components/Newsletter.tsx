
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { newsletterApi } from "@/api/apiClient";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const [sectionRef, sectionVisible] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Please enter your email", variant: "destructive" });
      return;
    }
    try {
      setIsSubmitting(true);
      await newsletterApi.subscribe(email);
      setIsSuccess(true);
      toast({
        title: "You're in! 🎉",
        description: "Exclusive Paithani deals and new arrivals delivered to your inbox.",
      });
      setEmail("");
      setTimeout(() => setIsSuccess(false), 4000);
    } catch (error: any) {
      if (error.message?.includes("already subscribed")) {
        toast({
          title: "Already subscribed",
          description: "This email is already on our VIP list!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Couldn't subscribe",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const floatLabel = isFocused || email.length > 0;

  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #440D17 0%, #7A1F33 50%, #440D17 100%)' }}
    >
      {/* Decorative Paithani-motif SVG pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="paithani-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="12" fill="none" stroke="#F59E0B" strokeWidth="1" />
              <circle cx="30" cy="30" r="6" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
              <line x1="30" y1="18" x2="30" y2="0" stroke="#F59E0B" strokeWidth="0.5" />
              <line x1="30" y1="42" x2="30" y2="60" stroke="#F59E0B" strokeWidth="0.5" />
              <line x1="18" y1="30" x2="0" y2="30" stroke="#F59E0B" strokeWidth="0.5" />
              <line x1="42" y1="30" x2="60" y2="30" stroke="#F59E0B" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#paithani-pattern)" />
        </svg>
      </div>

      {/* Gold top border */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      <div
        ref={sectionRef}
        className={cn(
          "container mx-auto px-4 relative z-10 reveal-up",
          sectionVisible && "visible"
        )}
      >
        <div className="max-w-2xl mx-auto text-center">
          {/* Mail icon */}
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-gold-400 mb-7">
            <Mail className="h-7 w-7" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10 bg-gold-500/60" />
            <span className="text-gold-400 text-xs font-semibold tracking-[0.25em] uppercase">
              VIP List
            </span>
            <div className="h-px w-10 bg-gold-500/60" />
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
            Get Exclusive Access
          </h2>
          <p className="text-crimson-200/80 text-base leading-relaxed mb-10">
            Subscribe for early access to new Paithani arrivals, members-only discounts, and styling guides — straight to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            {/* Floating label input */}
            <div className="relative flex-1">
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder=" "
                required
                className="w-full px-4 pt-6 pb-2 rounded-xl bg-white/10 border border-white/25 text-white placeholder-transparent focus:outline-none focus:border-gold-400 transition-colors duration-200 text-sm"
              />
              <label
                htmlFor="newsletter-email"
                className={cn(
                  "absolute left-4 pointer-events-none text-white/60 transition-all duration-200",
                  floatLabel
                    ? "top-1.5 text-[10px] text-gold-400 font-semibold tracking-wide"
                    : "top-1/2 -translate-y-1/2 text-sm"
                )}
              >
                Your email address
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className={cn(
                "shimmer-btn px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 flex-shrink-0 border-0",
                isSuccess
                  ? "bg-green-500 text-white"
                  : "bg-gold-500 hover:bg-gold-600 text-crimson-950"
              )}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isSuccess ? (
                <><Check className="h-4 w-4" /> Subscribed!</>
              ) : (
                <>Subscribe <ArrowRight className="h-4 w-4" /></>
              )}
            </Button>
          </form>

          <p className="text-crimson-300/60 text-xs mt-4">
            No spam. Unsubscribe any time. We respect your privacy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
