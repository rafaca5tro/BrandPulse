
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, BarChart } from "lucide-react";

const MarketSection = () => {
  return (
    <section id="market" className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6">Market Gap and Opportunity</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-2">Why Now</h3>
              <p className="text-lg text-gray-300">
                Branding has become survival. Post-COVID and NIL-era, digital presence = commercial leverage. But clubs are flying blind. Agencies charge $10K+ for slow audits. We do it in 2 minutes — with AI.
              </p>
            </div>
            
            <div className="flex gap-4 mb-8">
              <div className="bg-[#8BFE3E]/20 text-white font-medium p-4 rounded-lg flex items-center gap-2">
                <BarChart size={20} className="text-[#8BFE3E]" />
                <span>$10K+ for traditional audits</span>
              </div>
              <div className="bg-[#8BFE3E]/20 text-white font-medium p-4 rounded-lg flex items-center gap-2">
                <TrendingUp size={20} className="text-[#8BFE3E]" />
                <span>100,000+ potential clients</span>
              </div>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">Total Addressable Market</h3>
              <p className="text-gray-300 mb-4">
                100,000+ sports properties with ambition and brand blind spots.
              </p>
              <div className="h-6 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-[#8BFE3E] rounded-full animate-pulse-green" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
              <div className="flex items-center mb-6">
                <Users className="text-[#8BFE3E] mr-3" size={28} />
                <h3 className="text-2xl font-bold text-white">Target Users</h3>
              </div>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-[#8BFE3E]/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-white text-sm">🏟️</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Pro/Amateur Football Clubs</h4>
                    <p className="text-gray-300">Teams seeking to modernize their brand for fan engagement</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-[#8BFE3E]/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-white text-sm">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">National Teams & Federations</h4>
                    <p className="text-gray-300">Organizations representing multiple teams and athletes</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-[#8BFE3E]/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-white text-sm">🎮</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Esports Orgs</h4>
                    <p className="text-gray-300">Digital-native teams with high content production needs</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-[#8BFE3E]/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-white text-sm">🧑‍🎓</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">NIL Athletes</h4>
                    <p className="text-gray-300">College athletes building personal brands for sponsorships</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-[#8BFE3E]/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-white text-sm">🤝</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Sports Marketing Agencies</h4>
                    <p className="text-gray-300">Agencies serving multiple sports clients</p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <div className="bg-[#8BFE3E]/20 p-2 rounded-full mr-3 mt-1">
                    <span className="text-white text-sm">💼</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Consultants (White-label tool)</h4>
                    <p className="text-gray-300">Independent professionals offering brand services</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
