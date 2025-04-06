
import React from 'react';
import Header from "@/components/Header";
import AuditForm from "@/components/AuditForm";
import Footer from "@/components/Footer";
import { CheckCircle2, LineChart, BarChart, PieChart, Zap } from 'lucide-react';

const AuditPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      <Header />
      <main className="container mx-auto py-24 px-4 relative overflow-hidden">
        {/* Decorative elements - subtle glowing orbs with indigo/purple palette */}
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#6366F1]/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl -z-10"></div>
      
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] mb-4">BrandAudit AI</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Upload your website, socials, or pitch deck — get a comprehensive AI-powered brand analysis and strategic upgrade plan in just 2 minutes.
          </p>
        </div>
        
        <AuditForm />
        
        <div className="mt-16 grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#13141F]/80 backdrop-blur-sm p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-4">
              <LineChart className="text-[#8B5CF6]" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Brand Positioning Score</h3>
            <p className="text-slate-400">Get a quantitative analysis of your brand's market position with actionable insights tailored to your industry.</p>
          </div>
          
          <div className="bg-[#13141F]/80 backdrop-blur-sm p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="text-[#8B5CF6]" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Visual Consistency Check</h3>
            <p className="text-slate-400">Analyze logo usage, color palette, typography, and overall design language across all your digital touchpoints.</p>
          </div>
          
          <div className="bg-[#13141F]/80 backdrop-blur-sm p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-4">
              <PieChart className="text-[#8B5CF6]" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Messaging Analysis</h3>
            <p className="text-slate-400">Evaluate your key messaging, tone of voice, and communication strategy for maximum customer impact.</p>
          </div>
          
          <div className="bg-[#13141F]/80 backdrop-blur-sm p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="text-[#8B5CF6]" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Growth Opportunities</h3>
            <p className="text-slate-400">Discover untapped potential and get specific recommendations to accelerate your brand's growth.</p>
          </div>
        </div>
        
        {/* Testimonials section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-12">Trusted by Forward-Thinking Brands</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#13141F]/80 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-4">A</div>
                <div>
                  <h3 className="font-bold text-white">Acme Sports</h3>
                  <p className="text-sm text-slate-400">Sports Equipment Manufacturer</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                "The BrandAudit AI tool identified inconsistencies in our brand messaging we hadn't noticed for years. Our team implemented the recommendations and saw a 27% increase in conversion rates within 3 months."
              </p>
              <div className="flex items-center text-amber-400">
                <CheckCircle2 size={16} className="mr-1" />
                <span className="text-sm font-medium">Verified customer</span>
              </div>
            </div>
            
            <div className="bg-[#13141F]/80 backdrop-blur-sm p-6 rounded-xl border border-slate-800">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold mr-4">G</div>
                <div>
                  <h3 className="font-bold text-white">Green Valley FC</h3>
                  <p className="text-sm text-slate-400">Professional Soccer Club</p>
                </div>
              </div>
              <p className="text-slate-300 mb-4">
                "As a mid-tier club competing with bigger names, our brand presence is crucial. PlaymakerAI helped us refine our social media strategy and visual identity, leading to a 45% growth in follower engagement."
              </p>
              <div className="flex items-center text-amber-400">
                <CheckCircle2 size={16} className="mr-1" />
                <span className="text-sm font-medium">Verified customer</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuditPage;
