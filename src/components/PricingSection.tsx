import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-[#0A0A0F] relative overflow-hidden">
      {/* Decorative elements - subtle glowing orbs */}
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-[#6366F1]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-slate-400">
            Choose the plan that fits your business needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Freemium Plan */}
          <Card className="border border-slate-800 bg-[#0D0F17] shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 overflow-hidden">
            <div className="h-2 bg-slate-700 w-full"></div>
            <CardHeader className="pt-6">
              <h3 className="text-xl font-bold text-white">Freemium</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-white">$0</span>
                <span className="text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">Perfect for individuals and small projects</p>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">3 audits per month</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Basic scorecard</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Non-exportable report</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Link to="/audit" className="w-full">
                <Button variant="outline" className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Pro Plan */}
          <Card className="border-0 bg-gradient-to-br from-[#13141F] to-[#090A10] shadow-2xl relative transform hover:-translate-y-1 transition-all duration-300 overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] w-full"></div>
            <div className="absolute top-0 right-0 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs font-bold py-1 px-3 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader className="pt-6">
              <h3 className="text-xl font-bold text-white">Pro</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-white">$29</span>
                <span className="text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">For professionals and growing brands</p>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300"><span className="font-medium text-white">Unlimited</span> audits</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Advanced scorecard</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Full list of priority fixes</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Exportable PDF reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Sample copy suggestions</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Shareable report links</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Link to="/auth" className="w-full">
                <Button className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white border-0 shadow-lg shadow-indigo-500/25">
                  Get Pro Access
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          {/* Team Plan */}
          <Card className="border border-slate-800 bg-[#0D0F17] shadow-xl hover:shadow-2xl hover:border-slate-700 transition-all duration-300 overflow-hidden">
            <div className="h-2 bg-slate-700 w-full"></div>
            <CardHeader className="pt-6">
              <h3 className="text-xl font-bold text-white">Team</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold text-white">$99</span>
                <span className="text-slate-400 ml-1">/month</span>
              </div>
              <p className="text-slate-400 text-sm mt-2">For agencies and larger organizations</p>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Everything in Pro</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">White-label reports</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Team workspaces</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">5 user seats</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">API access</span>
                </li>
                <li className="flex items-start">
                  <Check className="text-[#8BFE3E] mr-2 flex-shrink-0 mt-1" size={18} />
                  <span className="text-slate-300">Priority support</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4">
              <Button variant="outline" className="w-full bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white">Contact Sales</Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            <div className="bg-[#13141F] border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-2">How accurate is the AI analysis?</h4>
              <p className="text-slate-400">Our AI model is based on Claude 3.7 and has been trained on thousands of successful brand audits. It provides insights comparable to professional brand consultants with accuracy rates exceeding 90% in comparison tests.</p>
            </div>
            
            <div className="bg-[#13141F] border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-2">Can I upgrade or downgrade at any time?</h4>
              <p className="text-slate-400">Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades are applied at the end of your current billing cycle.</p>
            </div>
            
            <div className="bg-[#13141F] border border-slate-800 rounded-lg p-6">
              <h4 className="text-lg font-medium text-white mb-2">Is there a free trial for paid plans?</h4>
              <p className="text-slate-400">We offer a 7-day free trial for our Pro plan. You can cancel anytime during the trial period without being charged.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;