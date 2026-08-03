
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Terms of Service</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="prose max-w-none">
              <p className="mb-4">
                Last Updated: May 17, 2025
              </p>

              <p className="mb-4">
                Welcome to Dwarkadish. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.
              </p>

              <h2 className="text-xl font-semibold my-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using our website, you agree to these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our website.
              </p>

              <h2 className="text-xl font-semibold my-4">2. Account Registration</h2>
              <p className="mb-4">
                To access certain features of our website, you may need to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating your account and to update your information to keep it accurate and current.
              </p>

              <h2 className="text-xl font-semibold my-4">3. Products and Services</h2>
              <p className="mb-4">
                We make every effort to display our products accurately, but we cannot guarantee that all details are completely accurate. Colors may vary depending on your display settings. We reserve the right to limit the quantities of any products available for purchase.
              </p>

              <h2 className="text-xl font-semibold my-4">4. Pricing and Payment</h2>
              <p className="mb-4">
                All prices are in Indian Rupees (INR) unless otherwise specified. We reserve the right to change prices at any time without notice. Payment must be received in full before orders are shipped. We accept various payment methods as indicated during the checkout process.
              </p>

              <h2 className="text-xl font-semibold my-4">5. Shipping and Delivery</h2>
              <p className="mb-4">
                Shipping and delivery times are estimates only and cannot be guaranteed. We are not responsible for delays caused by customs, shipping carriers, or other factors beyond our control. Please refer to our Shipping & Delivery Policy for more information.
              </p>

              <h2 className="text-xl font-semibold my-4">6. Returns and Refunds</h2>
              <p className="mb-4">
                Please refer to our Returns & Exchanges Policy for information on returns, exchanges, and refunds. Certain items may not be eligible for return or exchange as indicated on the product page.
              </p>

              <h2 className="text-xl font-semibold my-4">7. Intellectual Property</h2>
              <p className="mb-4">
                All content on our website, including text, graphics, logos, images, and software, is the property of Dwarkadish or its content suppliers and is protected by Indian and international copyright laws. The compilation of all content on this site is the exclusive property of Dwarkadish.
              </p>

              <h2 className="text-xl font-semibold my-4">8. User Content</h2>
              <p className="mb-4">
                By submitting reviews, comments, or other content to our website, you grant us a non-exclusive, royalty-free, perpetual, irrevocable right to use, reproduce, modify, adapt, publish, translate, distribute, and display such content worldwide.
              </p>

              <h2 className="text-xl font-semibold my-4">9. Limitation of Liability</h2>
              <p className="mb-4">
                Dwarkadish shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use our website or products.
              </p>

              <h2 className="text-xl font-semibold my-4">10. Governing Law</h2>
              <p className="mb-4">
                These Terms of Service shall be governed by and construed in accordance with the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.
              </p>

              <h2 className="text-xl font-semibold my-4">11. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting on our website. Your continued use of our website after any changes constitutes your acceptance of the new Terms of Service.
              </p>

              <h2 className="text-xl font-semibold my-4">12. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="my-2">Email: <a href="mailto:legal@dwarkadish.com" className="text-crimson-600 hover:underline">legal@dwarkadish.com</a></p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsPage;
