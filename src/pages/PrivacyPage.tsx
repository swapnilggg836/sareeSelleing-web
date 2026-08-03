
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Privacy Policy</h1>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="prose max-w-none">
              <p className="mb-4">
                Last Updated: May 17, 2025
              </p>

              <p className="mb-4">
                At Dwarkadish, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
              </p>

              <h2 className="text-xl font-semibold my-4">Information We Collect</h2>
              
              <h3 className="text-lg font-medium mb-2">Personal Information</h3>
              <p className="mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Register an account</li>
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our customer service</li>
                <li>Participate in promotions or surveys</li>
              </ul>
              <p className="mb-4">
                This information may include your name, email address, postal address, phone number, and payment information.
              </p>

              <h3 className="text-lg font-medium mb-2">Automatically Collected Information</h3>
              <p className="mb-4">
                When you visit our website, we may automatically collect certain information about your device, including:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Pages visited and time spent</li>
                <li>Referral sources</li>
              </ul>

              <h2 className="text-xl font-semibold my-4">How We Use Your Information</h2>
              <p className="mb-2">
                We may use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Processing and fulfilling your orders</li>
                <li>Creating and managing your account</li>
                <li>Sending you order confirmations and updates</li>
                <li>Providing customer support</li>
                <li>Sending promotional emails and newsletters (if you've opted in)</li>
                <li>Improving our website and services</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Preventing fraudulent transactions</li>
              </ul>

              <h2 className="text-xl font-semibold my-4">Information Sharing</h2>
              <p className="mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Service providers who help us operate our business (payment processors, shipping companies)</li>
                <li>Legal authorities when required by law</li>
                <li>Business partners for joint marketing efforts (only with your consent)</li>
              </ul>
              <p className="mb-4">
                We do NOT sell your personal information to third parties.
              </p>

              <h2 className="text-xl font-semibold my-4">Your Rights</h2>
              <p className="mb-2">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Access and update your personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to the processing of your information</li>
              </ul>

              <h2 className="text-xl font-semibold my-4">Security Measures</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no Internet transmission is completely secure, so we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-semibold my-4">Changes to This Policy</h2>
              <p className="mb-4">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-xl font-semibold my-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="my-2">Email: <a href="mailto:privacy@dwarkadish.com" className="text-crimson-600 hover:underline">privacy@dwarkadish.com</a></p>
              <p>Phone: +91 98765 43210</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
