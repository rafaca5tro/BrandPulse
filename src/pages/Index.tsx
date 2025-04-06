
import React, { useEffect } from 'react';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import FeaturesSection from "@/components/FeaturesSection";
import PricingSection from "@/components/PricingSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { storeUserEmail } from "@/services/stripeService";
import { toast } from "sonner";

const Index = () => {
  const { user, isSuperuser } = useAuth();
  const SUPERUSER_EMAIL = "consulting@novastra.ae";

  // Set up superuser account and provide feedback
  useEffect(() => {
    const configureSuperUser = async () => {
      // Check if the user is the superuser email
      if (user?.email === SUPERUSER_EMAIL) {
        try {
          // Store email for superuser detection across services
          storeUserEmail(user.email);
          
          // Reset used audits count to ensure availability
          localStorage.setItem("playmaker_ai_used_audits", "0");
          
          // Set user as team plan (highest tier)
          localStorage.setItem("playmaker_ai_user_plan", "team");
          
          console.log('SuperUser detected and configured with full access permissions');
          
          if (!isSuperuser) {
            // Only show the welcome toast if not already shown (avoids duplicates with auth system)
            toast.success('Welcome, Consulting Team!', {
              description: 'Your account has unlimited access to all premium features.',
              duration: 5000
            });
          }
        } catch (error) {
          console.error('Error configuring superuser:', error);
        }
      }
    };

    if (user) {
      configureSuperUser();
    }
  }, [user, isSuperuser]);

  // Ensure dark mode is consistently applied
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    document.body.classList.add('dark');
    document.body.classList.remove('light');
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <PricingSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
