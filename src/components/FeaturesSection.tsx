import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Search, FileText, BarChart, Sparkles, Zap, LineChart } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-[#0D0F17] relative overflow-hidden">
      {/* Decorative elements - subtle glowing orbs */}
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-[#6366F1]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Transform Your Brand <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">In Minutes</span>
          </h2>
          <p className="text-xl text-slate-400">
            Our AI-powered engine transforms your brand assets into actionable insights instantly, not months.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden group hover:bg-[#161A2C] border border-slate-800 hover:border-slate-700">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-[#6366F1]/30 group-hover:to-[#8B5CF6]/30 transition-colors">
                <Search className="text-[#8B5CF6]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Input Sources</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full mr-2"></div>
                  <span>Website URL</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#7c5fe9] rounded-full mr-2"></div>
                  <span>Instagram / TikTok / X</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></div>
                  <span>PDF Deck</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#9d58ee] rounded-full mr-2"></div>
                  <span>(Optional) Brand goals</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden group hover:bg-[#161A2C] border border-slate-800 hover:border-slate-700">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-[#6366F1]/30 group-hover:to-[#8B5CF6]/30 transition-colors">
                <Sparkles className="text-[#8B5CF6]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Audit Engine</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full mr-2"></div>
                  <span>Brand Positioning Score</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#7c5fe9] rounded-full mr-2"></div>
                  <span>Visual Consistency Analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></div>
                  <span>Messaging Effectiveness</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#9d58ee] rounded-full mr-2"></div>
                  <span>Digital Presence Evaluation</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-xl overflow-hidden group hover:bg-[#161A2C] border border-slate-800 hover:border-slate-700">
            <CardContent className="p-8">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-6 group-hover:from-[#6366F1]/30 group-hover:to-[#8B5CF6]/30 transition-colors">
                <FileText className="text-[#8B5CF6]" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Output</h3>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#6366F1] rounded-full mr-2"></div>
                  <span>Comprehensive Scorecard</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#7c5fe9] rounded-full mr-2"></div>
                  <span>Priority Fixes</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-2"></div>
                  <span>Sample Copy Suggestions</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-[#9d58ee] rounded-full mr-2"></div>
                  <span>Exportable & Shareable Reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-[#13141F] p-8 rounded-2xl border border-slate-800 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">How It Works</h3>
              <ol className="space-y-6">
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Submit your brand assets</h4>
                    <p className="text-slate-400">Enter your website URL, social media handles, or upload your pitch deck for analysis.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">AI analysis runs</h4>
                    <p className="text-slate-400">Our advanced AI engine scans and analyzes all content, examining visuals, messaging, and digital presence.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white flex items-center justify-center font-bold mr-4 flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Get your report</h4>
                    <p className="text-slate-400">Within 2 minutes, receive a comprehensive report with actionable insights and recommendations.</p>
                  </div>
                </li>
              </ol>
              <div className="mt-8">
                <Link to="/audit/result" className="text-[#8B5CF6] font-medium flex items-center hover:text-[#9d58ee] transition-colors">
                  See example report <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Dashboard preview */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1]/30 to-[#8B5CF6]/30 rounded-xl blur-md"></div>
                <div className="relative bg-[#0D0F17] border border-slate-700/50 rounded-xl overflow-hidden shadow-2xl">
                  {/* Dashboard Header */}
                  <div className="bg-[#0A0A0F] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-slate-400">Brand Analysis Report</div>
                    <div className="w-16"></div> {/* Spacer for balance */}
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-5">
                    {/* Overall Score */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                          <BarChart className="text-white" size={20} />
                        </div>
                        <div>
                          <h4 className="text-white text-sm font-medium">Overall Brand Score</h4>
                          <div className="text-xs text-slate-400">Needs improvement</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-white">68<span className="text-sm text-slate-400">/100</span></div>
                    </div>
                    
                    {/* Category Scores */}
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-slate-300">Visual Identity</div>
                          <div className="text-xs font-medium text-green-400">82%</div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{width: '82%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-slate-300">Messaging</div>
                          <div className="text-xs font-medium text-yellow-400">72%</div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-slate-300">Social Presence</div>
                          <div className="text-xs font-medium text-red-400">58%</div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{width: '58%'}}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs text-slate-300">Website Performance</div>
                          <div className="text-xs font-medium text-yellow-400">65%</div>
                        </div>
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{width: '65%'}}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Insights Section */}
                    <div className="bg-[#161A2C] rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={14} className="text-purple-400" />
                        <span className="text-sm text-white font-medium">Top Insights</span>
                      </div>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 h-4 rounded-full bg-indigo-500 mt-0.5"></div>
                          <span className="text-xs text-slate-300">Website loading time is too slow (5.2s), losing 30% of mobile visitors</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 h-4 rounded-full bg-indigo-500 mt-0.5"></div>
                          <span className="text-xs text-slate-300">Instagram engagement rate (1.2%) is below industry average (3.8%)</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Mini-chart section */}
                    <div className="bg-[#161A2C] rounded-lg p-3">
                      <h4 className="text-xs font-medium text-white mb-2">Weekly Engagement Trend</h4>
                      <div className="h-16 flex items-end gap-1">
                        <div className="h-20% w-5 bg-[#6366F1]/50 rounded-sm"></div>
                        <div className="h-40% w-5 bg-[#6366F1]/50 rounded-sm"></div>
                        <div className="h-30% w-5 bg-[#6366F1]/50 rounded-sm"></div>
                        <div className="h-60% w-5 bg-[#6366F1]/50 rounded-sm"></div>
                        <div className="h-50% w-5 bg-[#6366F1]/50 rounded-sm"></div>
                        <div className="h-80% w-5 bg-[#8B5CF6] rounded-sm"></div>
                        <div className="h-70% w-5 bg-[#8B5CF6] rounded-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating stats */}
                <div className="absolute -top-4 -right-4 bg-[#13141F]/90 py-2 px-3 rounded-lg shadow-lg border border-slate-700/50 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-[#8B5CF6]" />
                    <span className="text-xs font-medium text-white">AI-Generated Insights</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional feature highlights */}
        <div className="mt-20">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Advanced Brand Analytics</h3>
            <p className="text-slate-400">Uncover insights that traditional brand audits miss</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-[#13141F] border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-4">
                <LineChart className="text-[#8B5CF6]" size={24} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">Competitor Gap Analysis</h4>
              <p className="text-slate-400 mb-4">See how your brand stacks up against competitors in your industry with side-by-side comparisons of key metrics.</p>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-[#8B5CF6]" />
                  <span>Identify positioning opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-[#8B5CF6]" />
                  <span>Benchmark against industry leaders</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-[#13141F] border border-slate-800 p-6 rounded-xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mb-4">
                <Zap className="text-[#8B5CF6]" size={24} />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">AI-Generated Recommendations</h4>
              <p className="text-slate-400 mb-4">Get actionable, prioritized suggestions for immediate improvements to your brand's digital presence.</p>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-[#8B5CF6]" />
                  <span>Personalized to your industry</span>
                </li>
                <li className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-[#8B5CF6]" />
                  <span>Implement changes in minutes, not months</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;