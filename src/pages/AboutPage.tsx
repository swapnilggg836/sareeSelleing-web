
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-crimson-50 to-amber-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
              <div className="md:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 fancy-underline">About Dwarkadish</h1>
                <p className="text-lg md:text-xl text-gray-700 mb-6">
                  Weaving tradition into modern elegance, Dwarkadish brings you the finest collection of authentic Indian sarees.
                </p>
                <p className="text-gray-600 mb-8">
                  Our journey began with a passion for preserving the rich textile heritage of India while making it accessible to 
                  discerning customers worldwide. Each saree in our collection reflects centuries of artisanal expertise, cultural significance,
                  and timeless beauty.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src="https://images.unsplash.com/photo-1610292195689-34e9c871a31d?q=80&w=1470&auto=format&fit=crop"
                      alt="Dwarkadish Store" 
                      className="object-cover h-full w-full"
                    />
                  </AspectRatio>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold mb-6 fancy-underline inline-block">Our Story</h2>
              <p className="text-lg text-gray-700">
                The journey of Dwarkadish began in the heart of India's textile regions, where our founder was captivated by the 
                intricate craftsmanship of traditional saree weavers.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="mb-4">
                  Founded in 2010, Dwarkadish started as a small boutique in Delhi with a mission to showcase the extraordinary 
                  craftsmanship of Indian weavers to the world. Our founder, inspired by generations of family expertise in textiles, 
                  personally visited remote villages to source authentic handcrafted pieces.
                </p>
                <p className="mb-4">
                  Over the years, we've built lasting relationships with artisan communities across India, ensuring fair trade practices 
                  and sustainable production methods. Each saree in our collection tells a unique story of heritage, skill, and artistic excellence.
                </p>
                <p>
                  Today, Dwarkadish stands as a bridge between tradition and contemporary fashion, bringing the most exquisite 
                  handwoven sarees to discerning customers who appreciate both authenticity and elegance.
                </p>
              </div>
              
              <div className="rounded-lg overflow-hidden">
                <iframe 
                  width="100%" 
                  height="315" 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Dwarkadish Story" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Values */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 fancy-underline inline-block">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-crimson-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-crimson-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Authenticity</h3>
                <p className="text-gray-600">
                  We are committed to preserving authentic craftsmanship. Each piece in our collection is genuine, handcrafted, and 
                  represents the true artistry of India's weaving traditions.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-crimson-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-crimson-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-gray-600">
                  We support weaver communities through fair trade practices and sustainable partnerships. By choosing Dwarkadish, 
                  you're supporting the livelihoods of skilled artisans across India.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-crimson-100 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-crimson-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">Quality</h3>
                <p className="text-gray-600">
                  We never compromise on quality. Our rigorous selection process ensures that only the finest sarees make it to 
                  our collection, giving you heirloom-worthy pieces that last for generations.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Information */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 fancy-underline inline-block">Visit Us</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-crimson-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Our Store</h3>
                  <p className="text-gray-600">
                    123 Fashion Street, Delhi<br />
                    New Delhi, 110001
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-6 w-6 text-crimson-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Email Us</h3>
                  <p className="text-gray-600">
                    contact@dwarkadish.com<br />
                    support@dwarkadish.com
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-crimson-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Phone className="h-6 w-6 text-crimson-600" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">Call Us</h3>
                  <p className="text-gray-600">
                    +91 98765 43210<br />
                    Mon-Sat, 10am-7pm
                  </p>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden shadow-lg">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224346.6325707927!2d77.06889969985066!3d28.527858044548692!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd5b347eb62d%3A0x52c2b7494e204dce!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sus!4v1694641038482!5m2!1sen!2sus" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }} 
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
