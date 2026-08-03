
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { newsletterApi } from "@/api/apiClient";
import { toast } from "sonner";
import { useState } from "react";
import { Facebook, Instagram, Twitter, Loader2, Check, ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

const footerLinks = {
  customerService: [
    { name: "Track Your Order", href: "/orders" },
    { name: "Shipping & Delivery", href: "/shipping" },
    { name: "Returns & Exchanges", href: "/returns" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
  ],
  quickLinks: [
    { name: "New Arrivals", href: "/category/new-arrivals" },
    { name: "Sale", href: "/sale" },
    { name: "Blog", href: "/blog" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ],
  collections: [
    { name: "Wedding Collection", href: "/collection/wedding" },
    { name: "Festival Collection", href: "/collection/festival" },
    { name: "Designer Collection", href: "/collection/designer" },
    { name: "Traditional Collection", href: "/collection/traditional" },
    { name: "All Collections", href: "/collections" },
  ],
};

const trustBadges = [
  { label: "100% Handwoven", icon: "✦" },
  { label: "Free Shipping", icon: "📦" },
  { label: "Secure Payment", icon: "🔒" },
  { label: "Easy Returns", icon: "↩" },
];

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [badgesRef, badgesVisible] = useInView<HTMLDivElement>({ threshold: 0.2, triggerOnce: true });

  const floatLabel = isFocused || email.length > 0;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await newsletterApi.subscribe(email);
      toast.success("Subscribed! 🎉");
      setEmail("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-crimson-950 text-white" style={{ borderTop: '2px solid rgba(245,158,11,0.4)' }}>
      {/* Trust badges strip */}
      <div
        ref={badgesRef}
        className="border-b border-white/10 py-5"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-14">
            {trustBadges.map((badge, index) => (
              <div
                key={badge.label}
                className={cn(
                  "trust-badge flex items-center gap-2.5",
                  badgesVisible && "visible"
                )}
                style={{ transitionDelay: badgesVisible ? `${index * 100}ms` : '0ms' }}
              >
                <span className="text-xl">{badge.icon}</span>
                <span className="text-sm font-semibold text-crimson-100">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand section */}
          <div className="lg:col-span-1">
            <div className="mb-5">
              <h3 className="font-serif text-2xl font-bold text-white mb-1">Crimson Paithani</h3>
              <span className="text-[10px] tracking-[0.2em] text-gold-400 uppercase font-semibold">Emporium</span>
            </div>
            <p className="text-crimson-300 text-sm leading-relaxed mb-6">
              Experience the timeless elegance of traditional Paithani silk sarees. Handcrafted with love, designed for the modern woman who values heritage.
            </p>

            {/* Social icons */}
            <div className="flex gap-3">
              {[
                { href: "https://wa.me/919876543210", label: "WhatsApp", icon: (
                  <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515z"/>
                  </svg>
                )},
                { href: "https://facebook.com", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
                { href: "https://instagram.com", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
                { href: "https://twitter.com", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-crimson-300 hover:bg-gold-500/20 hover:text-gold-400 hover:scale-110 transition-all duration-200"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-serif font-semibold text-base text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold-500 after:mt-2">
              Customer Service
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.customerService.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-crimson-300 hover:text-gold-400 text-sm transition-colors duration-200 hover:pl-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-base text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold-500 after:mt-2">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-crimson-300 hover:text-gold-400 text-sm transition-colors duration-200 hover:pl-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-serif font-semibold text-base text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold-500 after:mt-2">
              Collections
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.collections.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-crimson-300 hover:text-gold-400 text-sm transition-colors duration-200 hover:pl-1"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter + Contact */}
          <div>
            <h4 className="font-serif font-semibold text-base text-white mb-5 after:content-[''] after:block after:w-8 after:h-0.5 after:bg-gold-500 after:mt-2">
              Stay Updated
            </h4>
            <p className="text-crimson-300 text-sm mb-4 leading-relaxed">
              Subscribe for exclusive Paithani offers and new arrivals.
            </p>

            {/* Floating label newsletter form */}
            <form onSubmit={handleSubscribe} className="space-y-2 mb-7">
              <div className="relative">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder=" "
                  required
                  className="w-full px-4 pt-6 pb-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-transparent focus:outline-none focus:border-gold-400 transition-colors duration-200 text-sm"
                />
                <label
                  htmlFor="footer-email"
                  className={cn(
                    "absolute left-4 pointer-events-none text-crimson-300 transition-all duration-200",
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
                disabled={loading || success}
                className={cn(
                  "w-full flex items-center justify-center gap-2 font-semibold rounded-xl transition-all",
                  success
                    ? "bg-green-500 text-white"
                    : "bg-gold-500 hover:bg-gold-600 text-crimson-950"
                )}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : success ? (
                  <><Check className="h-4 w-4" /> Subscribed!</>
                ) : (
                  <>Subscribe <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </form>

            {/* Contact info */}
            <div className="space-y-2 text-sm text-crimson-300">
              <p className="flex items-start gap-2">
                <span className="text-gold-400 mt-0.5">📍</span>
                123 Fashion Street, Mumbai, Maharashtra 400001
              </p>
              <p>
                <a href="tel:+919876543210" className="hover:text-gold-400 transition-colors">
                  📞 +91 98765 43210
                </a>
              </p>
              <p>
                <a href="mailto:hello@crimsonpaithani.com" className="hover:text-gold-400 transition-colors">
                  ✉ hello@crimsonpaithani.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-7 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-crimson-400 text-sm">
            © 2024 Crimson Paithani Emporium. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { name: "Privacy Policy", href: "/privacy" },
              { name: "Terms of Service", href: "/terms" },
              { name: "Return Policy", href: "/returns" },
            ].map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-crimson-400 hover:text-gold-400 text-sm transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
