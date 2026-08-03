
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FaqPage = () => {
  const faqCategories = [
    {
      title: "Product Information",
      questions: [
        {
          question: "What types of sarees do you offer?",
          answer: "We offer a wide range of traditional Indian sarees including Banarasi Silk, Kanjivaram, Patola, Paithani, and Bandhani. Each saree is handcrafted by skilled artisans using traditional techniques passed down through generations."
        },
        {
          question: "How do I know which saree is right for me?",
          answer: "We recommend choosing based on the occasion, your personal style, and comfort. Silk sarees are perfect for weddings and formal events, while cotton and linen sarees are ideal for daily wear. You can also contact our stylists for personalized recommendations."
        },
        {
          question: "Are your sarees handwoven?",
          answer: "Yes, most of our premium collections feature handwoven sarees crafted by skilled artisans. Each piece takes several days to months to complete, depending on the complexity of the design and weaving technique."
        },
        {
          question: "Do you offer blouse pieces with sarees?",
          answer: "Yes, all our sarees come with matching blouse pieces. We also offer customized blouse stitching services for an additional fee."
        }
      ]
    },
    {
      title: "Orders & Payment",
      questions: [
        {
          question: "How can I place an order?",
          answer: "You can place an order directly through our website by selecting your desired product, adding it to cart, and proceeding to checkout. We accept various payment methods including credit/debit cards, net banking, UPI, and cash on delivery for select areas."
        },
        {
          question: "Is it safe to use my credit card on your website?",
          answer: "Absolutely. Our website uses industry-standard SSL encryption to protect your personal and payment information. We do not store your credit card details on our servers."
        },
        {
          question: "Can I modify or cancel my order?",
          answer: "Orders can be modified or canceled within 12 hours of placing them. Please contact our customer service team immediately if you need to make changes to your order."
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship to many countries worldwide. International shipping rates and delivery times vary depending on the destination. Please check our Shipping & Delivery page for more details."
        }
      ]
    },
    {
      title: "Care & Maintenance",
      questions: [
        {
          question: "How should I care for my silk saree?",
          answer: "We recommend dry cleaning for silk sarees. If hand washing, use mild detergent in cold water, avoid wringing, and dry in shade. Store in muslin cloth away from direct sunlight and moisture. Refold periodically to prevent permanent creases."
        },
        {
          question: "How often should I air my sarees?",
          answer: "We recommend airing your silk sarees every 2-3 months. Unfold them completely and leave them in a well-ventilated area away from direct sunlight for a few hours before refolding and storing."
        },
        {
          question: "Can I iron my saree?",
          answer: "Yes, but with caution. Use a low to medium heat setting and preferably place a thin cloth between the iron and saree. For embroidered or embellished sections, iron from the reverse side or avoid ironing those areas completely."
        },
        {
          question: "How do I remove stains from my saree?",
          answer: "For fresh stains, blot (don't rub) the area with a clean cloth. For persistent stains, we recommend consulting a professional cleaner specializing in traditional textiles. Avoid using harsh chemicals or bleach."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-crimson-700">Frequently Asked Questions</h1>
          
          <p className="text-gray-600 mb-8">
            Find answers to the most common questions about our products, services, and policies. If you can't find what you're looking for, please don't hesitate to contact our customer service team.
          </p>
          
          <div className="space-y-8">
            {faqCategories.map((category, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
                
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem key={faqIndex} value={`item-${index}-${faqIndex}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{faq.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
          
          <div className="bg-crimson-50 border border-crimson-100 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-3 text-crimson-700">Still have questions?</h2>
            <p className="text-gray-700 mb-4">
              Our customer service team is here to help you with any other questions you might have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="bg-crimson-600 text-white px-5 py-2.5 rounded-md hover:bg-crimson-700 transition-colors text-center"
              >
                Contact Us
              </a>
              <a 
                href="mailto:support@dwarkadish.com" 
                className="border border-crimson-600 text-crimson-600 px-5 py-2.5 rounded-md hover:bg-crimson-50 transition-colors text-center"
              >
                Email Support
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FaqPage;
