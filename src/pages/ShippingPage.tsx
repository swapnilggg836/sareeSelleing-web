
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ShippingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Shipping & Delivery</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Shipping Policy</h2>
            
            <div className="prose max-w-none">
              <p className="mb-4">
                At Dwarkadish, we strive to deliver your exquisite traditional sarees and other products with the utmost care and efficiency.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Domestic Shipping</h3>
              <p className="mb-2">
                We offer shipping services across India with the following options:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Standard Shipping (5-7 business days): ₹100 for orders below ₹5,000</li>
                <li>Express Shipping (2-3 business days): ₹250 for all orders</li>
                <li>FREE Standard Shipping on all orders above ₹5,000</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2 mt-6">International Shipping</h3>
              <p className="mb-2">
                We deliver our products to select countries worldwide:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Standard International Shipping (10-15 business days): ₹2,000</li>
                <li>Express International Shipping (7-10 business days): ₹3,500</li>
              </ul>
              <p>
                Please note that international shipments may be subject to additional customs duties and taxes which are the responsibility of the customer.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Order Processing Time</h3>
              <p>
                All orders are processed within 24-48 hours after payment confirmation. For custom orders, please allow 7-10 additional business days for processing.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Tracking Your Order</h3>
              <p>
                Once your order is shipped, you will receive a confirmation email with a tracking number. You can track your package using our <a href="/orders" className="text-crimson-600 hover:underline">Order Tracking</a> page.
              </p>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
            
            <div className="prose max-w-none">
              <h3 className="text-lg font-medium mb-2">Delivery Areas</h3>
              <p className="mb-4">
                We deliver to all major cities and towns across India. For remote areas, additional delivery time may be required.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Package Handling</h3>
              <p className="mb-4">
                Our products are packaged with great care to ensure they reach you in perfect condition. Each saree is wrapped in acid-free paper and placed in a protective box to prevent any damage during transit.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Signature on Delivery</h3>
              <p className="mb-4">
                For orders above ₹10,000, a signature will be required upon delivery to ensure the safe receipt of your valuable items.
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Special Instructions</h3>
              <p>
                If you have any special delivery instructions, please include them in the "Order Notes" section during checkout or contact our customer service team at <a href="mailto:shipping@dwarkadish.com" className="text-crimson-600 hover:underline">shipping@dwarkadish.com</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShippingPage;
