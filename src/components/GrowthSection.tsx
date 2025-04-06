
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, BarChart, Settings, FileText } from "lucide-react";

const GrowthSection = () => {
  return (
    <section id="growth" className="py-16 md:py-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Growth Hack Tactics
          </h2>
          <p className="text-xl text-gray-300">
            Strategic approaches to drive user acquisition and market penetration.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border border-gray-700 shadow-md hover:shadow-xl transition-all bg-gray-800">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-[#8BFE3E]/20 rounded-lg flex items-center justify-center mb-4">
                <FileText className="text-[#8BFE3E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Before/After Audits</h3>
              <p className="text-gray-300 mb-4">
                Post real audits of famous teams → viral + controversial. Tag teams. Wait.
              </p>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Medium effort, high impact</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 shadow-md hover:shadow-xl transition-all bg-gray-800">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-[#8BFE3E]/20 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="text-[#8BFE3E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Sponsor-Readiness Score</h3>
              <p className="text-gray-300 mb-4">
                Make branding a KPI for sponsorships. New vanity metric.
              </p>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Low effort, high impact</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 shadow-md hover:shadow-xl transition-all bg-gray-800">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-[#8BFE3E]/20 rounded-lg flex items-center justify-center mb-4">
                <Settings className="text-[#8BFE3E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">White-label Tool</h3>
              <p className="text-gray-300 mb-4">
                Every sports consultant becomes a Playmaker AI reseller.
              </p>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Low effort, high impact</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 shadow-md hover:shadow-xl transition-all bg-gray-800">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-[#8BFE3E]/20 rounded-lg flex items-center justify-center mb-4">
                <Users className="text-[#8BFE3E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Live Audit Webinars</h3>
              <p className="text-gray-300 mb-4">
                "We teardown your brand live" → podcast + virality + lead magnet.
              </p>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Medium effort, high impact</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-700 shadow-md hover:shadow-xl transition-all bg-gray-800">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-[#8BFE3E]/20 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="text-[#8BFE3E]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Emerging Market Blitz</h3>
              <p className="text-gray-300 mb-4">
                LATAM, Africa, SEA — massive need, no structure. Translate early.
              </p>
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 bg-amber-400 rounded-full mr-2"></div>
                <span className="text-gray-300">Medium effort, high impact</span>
              </div>
            </CardContent>
          </Card>
          
          <div className="md:col-span-2 lg:col-span-1">
            <Card className="border-0 bg-[#8BFE3E]/10 text-white h-full border border-[#8BFE3E]/30">
              <CardContent className="p-8">
                <div className="w-12 h-12 bg-[#8BFE3E]/20 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-[#8BFE3E]" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Manual Launch Test</h3>
                <p className="text-white/90 mb-4">
                  Pick 5 clubs or athletes. Run a full AI-powered teardown manually. Deliver a 1-pager for each.
                </p>
                <div className="p-4 bg-gray-800/80 rounded-lg border border-gray-700">
                  <p className="font-medium mb-2 text-white">Ask yourself:</p>
                  <p className="italic text-gray-300">
                    "If I sent this to a sports director or athlete manager — would they pay for it? Would they feel exposed… or grateful?"
                  </p>
                  <p className="mt-4 font-medium text-white">If the answer is "Damn, yes" — Playmaker AI v1 is greenlit.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GrowthSection;
