
import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead">
              Your privacy is important to us. It is PlaymakerAI's policy to respect your privacy regarding any information we may collect from you across our website and other sites we own and operate.
            </p>
            
            <h2>Information We Collect</h2>
            <p>
              We only collect information about you if we have a reason to do so. For example, to provide our services, to communicate with you, or to make our services better. We collect information in three ways: if and when you provide information to us, automatically through operating our services, and from outside sources.
            </p>
            
            <h3>Information You Provide to Us</h3>
            <p>
              We collect information that you provide to us when you:
            </p>
            <ul>
              <li>Create an account: We collect your name, email address, and username.</li>
              <li>Perform an audit: We collect the URLs, business information, and other content you provide for analysis.</li>
              <li>Make a payment: We collect payment information, billing address, and contact details.</li>
              <li>Contact our support: We keep records of your communications to help solve any issues you might be facing.</li>
            </ul>
            
            <h3>Information We Collect Automatically</h3>
            <p>
              We automatically collect some information about you when you use our services, including:
            </p>
            <ul>
              <li>Usage information: We collect information about your activity on our services.</li>
              <li>Device information: We collect information about the device you use to access our services.</li>
              <li>Log information: We collect standard server logs when you use our services.</li>
              <li>Location information: We may determine the approximate location of your device from your IP address.</li>
            </ul>
            
            <h2>Use of Your Information</h2>
            <p>
              We use information about you as mentioned above and for the purposes listed below:
            </p>
            <ul>
              <li>To provide our services</li>
              <li>To further develop and improve our services</li>
              <li>To monitor and analyze trends</li>
              <li>To measure, gauge, and improve the effectiveness of our advertising</li>
              <li>To monitor and prevent any problems with our services</li>
              <li>To communicate with you</li>
              <li>To personalize your experience</li>
            </ul>
            
            <h2>Sharing Information</h2>
            <p>
              We do not sell our users' private personal information. We share information about you in the limited circumstances spelled out below:
            </p>
            <ul>
              <li>With your consent: We may share information with your consent.</li>
              <li>With service providers: We may share information with third parties who provide services on our behalf.</li>
              <li>For legal reasons: We may disclose information in response to a subpoena, court order, or other governmental request.</li>
              <li>To protect rights, property, and others: We may share information to protect the rights, property, and safety of our company, our users, and the public.</li>
              <li>With your team: If you're part of a team account, administrators may access information in your account.</li>
            </ul>
            
            <h2>Security</h2>
            <p>
              We take security seriously and do what we can to protect your information. While no online service is 100% secure, we implement appropriate technical, physical, and organizational measures to protect the information we collect and store.
            </p>
            
            <h2>Your Rights</h2>
            <p>
              Depending on where you live, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your personal information. You can contact us about these rights at any time.
            </p>
            
            <h2>Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We'll notify you of any significant changes in the way we treat your personal information.
            </p>
            
            <h2>Contact Us</h2>
            <p>
              If you have any questions about our privacy practices or this policy, please contact us.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
