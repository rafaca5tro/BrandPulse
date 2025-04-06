
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, AlertTriangle, X } from "lucide-react";

const ProblemSection = () => {
  return (
    <section className="py-20 bg-[#0A0A0F] relative overflow-hidden">
      {/* Decorative elements - subtle glowing orbs */}
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            The <span className="text-red-500">Problem</span> With Brand Presence
          </h2>
          <p className="text-xl text-slate-400">
            Most businesses think their brand is effective — but potential customers scroll past, partners hesitate, and opportunities are missed. Why? Their digital presence is misaligned with their true value — and they don't even realize it.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden border border-red-900/30 hover:border-red-800/50 hover:bg-[#161A2C]">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingDown className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Audience Engagement Falling</h3>
              <p className="text-slate-400">
                Digital content gets ignored, social posts underperform, and customer sentiment drops while businesses remain unaware of the root causes.
              </p>
              
              <div className="mt-6 bg-red-950/20 border border-red-900/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-400">Warning Signs</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-400">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Engagement rates below 1%</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>High bounce rates (&gt;70%)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden border border-red-900/30 hover:border-red-800/50 hover:bg-[#161A2C]">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                <X className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Partnership Barriers</h3>
              <p className="text-slate-400">
                Inconsistent branding creates hesitancy from potential partners and investors who need confidence in your digital presence before committing.
              </p>
              
              <div className="mt-6 bg-red-950/20 border border-red-900/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-400">Warning Signs</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-400">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Long sales cycles</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Deals stalling at proposal stage</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden border border-red-900/30 hover:border-red-800/50 hover:bg-[#161A2C]">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mb-6">
                <TrendingDown className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Customer Acquisition Issues</h3>
              <p className="text-slate-400">
                Potential customers judge businesses by their digital presence before buying. A weak brand means missed opportunities with high-value clients.
              </p>
              
              <div className="mt-6 bg-red-950/20 border border-red-900/30 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-red-400">Warning Signs</h4>
                    <ul className="mt-2 space-y-1 text-sm text-slate-400">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Converting &lt;2% of prospects</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                        <span>Price sensitivity with leads</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1]/30 to-[#8B5CF6]/30 rounded-xl blur-md"></div>
            <div className="relative bg-[#13141F] p-8 rounded-xl border border-slate-800">
              <div className="flex items-center justify-center mb-4">
                <div className="px-4 py-2 bg-[#6366F1]/20 rounded-full">
                  <span className="text-[#8B5CF6] font-medium">The Solution</span>
                </div>
              </div>
              <p className="text-center text-lg text-slate-300">
                Until now, there was no fast, trusted way to get a comprehensive brand diagnosis and strategic fix. PlaymakerAI changes that with AI-powered analysis that takes minutes, not months.
              </p>
              
              <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                <div className="bg-[#161A2C] p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-400 mb-1">5-10 weeks</div>
                  <p className="text-sm text-slate-400">Traditional brand audit timeline</p>
                </div>
                <div className="bg-[#161A2C] p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-400 mb-1">2 minutes</div>
                  <p className="text-sm text-slate-400">PlaymakerAI audit timeline</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
