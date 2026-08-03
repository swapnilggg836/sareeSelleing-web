
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Returns & Exchanges</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Return Policy</h2>
            
            <div className="prose max-w-none">
              <p className="mb-4">
                We want you to be completely satisfied with your purchase from Dwarkadish. If for any reason you're not happy with your order, we offer returns and exchanges with the following guidelines:
              </p>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Return Eligibility</h3>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Returns are accepted within 7 days of delivery for all ready-to-ship items</li>
                <li>Items must be unused, unworn, unwashed, and with all original tags attached</li>
                <li>Custom-designed or personalized items cannot be returned unless defective</li>
                <li>Sale items marked as "Final Sale" are not eligible for return or exchange</li>
              </ul>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Exchange Process</h3>
              <p className="mb-2">
                To exchange an item:
              </p>
              <ol className="list-decimal pl-5 mb-4 space-y-2">
                <li>Contact our customer service team at <a href="mailto:returns@dwarkadish.com" className="text-crimson-600 hover:underline">returns@dwarkadish.com</a> with your order number and reason for exchange</li>
                <li>Our team will send you a return shipping label and instructions</li>
                <li>Pack your item in its original packaging if possible</li>
                <li>Ship the item back to us using the provided return label</li>
                <li>Once we receive your return, we'll process your exchange and ship the new item</li>
              </ol>
              
              <h3 className="text-lg font-medium mb-2 mt-6">Refund Information</h3>
              <p className="mb-2">
                For refunds:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-2">
                <li>Refunds will be processed within 7-10 business days after we receive your return</li>
                <li>Original payment method will be used for the refund</li>
                <li>Shipping charges are non-refundable unless the return is due to our error</li>
                <li>For items received damaged or defective, we offer full refunds including shipping charges</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Damage Claims</h2>
            
            <div className="prose max-w-none">
              <p className="mb-4">
                If your item arrives damaged:
              </p>
              <ol className="list-decimal pl-5 mb-4 space-y-2">
                <li>Take photos of the damaged item and packaging</li>
                <li>Contact us within 24 hours of delivery</li>
                <li>Email the photos along with your order number to <a href="mailto:claims@dwarkadish.com" className="text-crimson-600 hover:underline">claims@dwarkadish.com</a></li>
              </ol>
              
              <p className="mb-4">
                We take great pride in our products and want to ensure you receive them in perfect condition. If you have any questions about our Returns & Exchanges policy, please don't hesitate to contact our customer service team:
              </p>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Customer Service</h3>
                <p className="mb-1">Email: <a href="mailto:support@dwarkadish.com" className="text-crimson-600 hover:underline">support@dwarkadish.com</a></p>
                <p className="mb-1">Phone: +91 98765 43210</p>
                <p>Hours: Monday-Saturday, 10:00 AM - 6:00 PM IST</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReturnsPage;
