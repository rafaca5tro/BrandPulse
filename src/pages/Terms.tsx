
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 font-playfair">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-200">
            <h2 className="text-2xl font-semibold font-playfair text-white">1. Introduction</h2>
            <p className="mb-6">
              Welcome to PlaymakerAI ("Company", "we", "our", "us")! As you have clicked our Terms of Service, please read these Terms of Service carefully before using our web application.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">2. Communications</h2>
            <p className="mb-6">
              By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">3. Purchases</h2>
            <p className="mb-6">
              If you wish to purchase any product or service made available through the Service ("Purchase"), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">4. Subscriptions</h2>
            <p className="mb-6">
              Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis, depending on the type of subscription plan you select. At the end of each period, your subscription will automatically renew under the same conditions unless you cancel it or we cancel it.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">5. Content</h2>
            <p className="mb-6">
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, or other material. You are responsible for the content that you upload to the Service.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">6. Prohibited Uses</h2>
            <p className="mb-6">
              You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service for any illegal purpose or in any way that violates any applicable law or regulation.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">7. Intellectual Property</h2>
            <p className="mb-6">
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of the Company and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">8. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">9. Limitation of Liability</h2>
            <p className="mb-6">
              In no event shall the Company, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            
            <h2 className="text-2xl font-semibold font-playfair text-white">10. Changes</h2>
            <p className="mb-6">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Terms;
