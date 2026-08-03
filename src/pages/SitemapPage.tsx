
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from 'react-router-dom';

const SitemapPage = () => {
  const sitemapSections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
        { name: "Contact Us", url: "/contact" },
        { name: "Wishlist", url: "/wishlist" }
      ]
    },
    {
      title: "Products & Collections",
      links: [
        { name: "New Arrivals", url: "/#new-arrivals" },
        { name: "Banarasi Silk", url: "/#banarasi-silk" },
        { name: "Kanjivaram", url: "/#kanjivaram" },
        { name: "Patola", url: "/#patola" },
        { name: "Paithani", url: "/#paithani" },
        { name: "Bandhani", url: "/#bandhani" },
        { name: "Wedding Collection", url: "/#wedding" },
        { name: "Festival Collection", url: "/#festival" },
        { name: "Designer Collection", url: "/#designer" },
        { name: "Traditional Collection", url: "/#traditional" }
      ]
    },
    {
      title: "Customer Service",
      links: [
        { name: "Track Your Order", url: "/orders" },
        { name: "Shipping & Delivery", url: "/shipping" },
        { name: "Returns & Exchanges", url: "/returns" },
        { name: "FAQ", url: "/faq" }
      ]
    },
    {
      title: "Legal Information",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" }
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blouse Designs", url: "/#blouse-designs" },
        { name: "Trending Styles", url: "/#trending-styles" },
        { name: "Size Chart", url: "/#size-chart" },
        { name: "Care Instructions", url: "/#care-instructions" }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Sitemap</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {sitemapSections.map((section, index) => (
                <div key={index} className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  <ul className="space-y-2">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          to={link.url}
                          className="text-crimson-600 hover:text-crimson-800 hover:underline"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitemapPage;
