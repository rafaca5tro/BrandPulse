import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-[#0A0A0F]">
      {/* Dark theme background with subtle pattern overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-1.2.1&auto=format&fit=crop&w=2400&q=80" 
          alt="Dark Tech Background" 
          className="w-full h-full object-cover opacity-30 filter contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1118] via-[#131621]/95 to-[#0A0A0F]"></div>
      </div>
      
      {/* Decorative elements - subtle glowing orbs */}
      <div className="absolute top-1/4 right-1/3 w-72 h-72 bg-[#6366F1]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row-reverse items-center gap-16 max-w-6xl mx-auto">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="flex justify-center md:justify-start mb-8">
              <img src="/logo.svg" alt="PlaymakerAI Logo" className="h-16" />
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans mb-6 leading-tight text-white">
              <div className="flex items-center gap-3 opacity-90 mb-2">
                <span>Fix Your</span> 
                <div className="relative inline-flex">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">Brand Gaps</span>
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 -z-0"></div>
                </div>
              </div>
              <span className="block">With <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] relative">
                AI Analysis
                <svg className="absolute -top-6 -right-6 w-5 h-5 text-[#8B5CF6]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" />
                </svg>
              </span></span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-4 text-slate-300 font-light leading-relaxed">
              Upload your marketing assets, get actionable insights and AI-powered recommendations in 
              <span className="font-semibold ml-1 bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">under 2 minutes</span>.
            </p>
            <div className="flex flex-wrap gap-4 mb-8 text-sm justify-center md:justify-start">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">Brand Consistency Analysis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">Competitor Gap Detection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-300">AI-Generated Improvement Plan</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
              <Link to="/audit">
                <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white h-12 px-8 text-lg flex items-center gap-2 rounded-full shadow-lg shadow-indigo-500/25 transition-all duration-300">
                  Try For Free <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/#features">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 h-12 px-8 text-lg flex items-center rounded-full transition-colors duration-200">
                  Explore Features
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1]/30 to-[#8B5CF6]/30 rounded-xl blur-md"></div>
              <div className="relative bg-[#13141F] border border-slate-700/50 p-1 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="relative rounded-lg shadow-2xl w-full overflow-hidden">
                  {/* Custom dashboard visualization showing actual AI analysis */}
                  <div className="bg-[#0D0F17] p-4">
                    {/* Header with brand being analyzed */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center text-white font-bold">A</div>
                        <span className="text-white font-medium">Acme Inc</span>
                      </div>
                      <div className="px-3 py-1 bg-indigo-500/20 rounded-full">
                        <span className="text-xs text-indigo-300">Analysis in progress</span>
                      </div>
                    </div>
                    
                    {/* AI Analysis sections */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-[#161A2C] p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300 text-sm">Brand Consistency</span>
                          <span className="text-indigo-400 font-bold">72%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full w-full">
                          <div className="h-full bg-indigo-500 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                      <div className="bg-[#161A2C] p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-slate-300 text-sm">Messaging Clarity</span>
                          <span className="text-red-400 font-bold">48%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full w-full">
                          <div className="h-full bg-red-500 rounded-full" style={{width: '48%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Insights section with real-time generation effect */}
                    <div className="bg-[#161A2C] p-3 rounded-lg mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-sm text-white font-medium">Key Insights</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 h-4 rounded-full bg-indigo-500 mt-1"></div>
                          <span className="text-xs text-slate-300">Inconsistent tone across marketing channels reducing brand recognition</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 h-4 rounded-full bg-indigo-500 mt-1"></div>
                          <span className="text-xs text-slate-300">Value proposition unclear on homepage - visitors leaving within 15 seconds</span>
                        </li>
                        <li className="flex items-start gap-2 opacity-60">
                          <div className="min-w-4 h-4 rounded-full bg-indigo-500 mt-1"></div>
                          <span className="text-xs text-slate-300 flex items-center">
                            Competitor analysis reveals opportunity to... 
                            <span className="inline-block w-2 h-4 bg-white/80 ml-1 animate-pulse"></span>
                          </span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Progress bar at bottom */}
                    <div className="mb-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Analyzing website & social media</span>
                        <span className="text-indigo-300">67%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full w-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" style={{width: '67%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-[#13141F]/90 p-3 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-md">
                  <div className="flex items-center space-x-2">
                    <Sparkles size={16} className="text-indigo-400" />
                    <span className="text-sm font-medium text-white">Real-time Analysis</span>
                  </div>
                </div>
              </div>
              
              {/* Multiple floating stats cards with real metrics */}
              <div className="absolute -top-6 -left-6 bg-[#13141F]/90 p-3 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-md hidden md:block">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">Avg. Conversion Lift</span>
                  <span className="text-xl font-bold text-white">+37.8%</span>
                  <div className="mt-1 h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-[#13141F]/90 p-3 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-md hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">Analysis Time</span>
                    <span className="text-lg font-bold text-white">1:47</span>
                  </div>
                  <div className="h-8 w-8 rounded-full flex items-center justify-center bg-purple-500/20">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-[#13141F]/90 py-2 px-3 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-md hidden md:block">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-xs font-medium text-green-400">GPT-4 Analysis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;