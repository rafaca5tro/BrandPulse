import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Send, Mail, MessageSquare, ArrowRight } from "lucide-react";

const ContactSection = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The form will be handled by Formspree
    toast.success("Message sent successfully!", {
      description: "We'll get back to you as soon as possible."
    });
  };

  return (
    <section id="contact" className="py-20 bg-[#0D0F17] relative overflow-hidden">
      {/* Decorative elements - subtle glowing orbs */}
      <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-[#6366F1]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#8B5CF6]/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4">
            Let's <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">Connect</span>
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Have questions about our platform? Want to learn more about how AI can transform your brand presence?
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
              <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-800 h-full">
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none text-slate-300">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mr-3">
                        <MessageSquare className="text-[#8B5CF6]" size={20} />
                      </div>
                      Digital Brand Insights
                    </h3>
                    
                    <p className="text-base leading-relaxed mb-6 text-slate-400">
                      In today's digital landscape, your brand's online presence is often the first—and sometimes only—impression you make on potential customers.
                    </p>
                    
                    <div className="bg-[#161A2C] p-4 rounded-lg mb-6">
                      <p className="text-sm text-slate-300 font-medium">Studies show that:</p>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 h-4 rounded-full bg-[#8B5CF6] mt-0.5"></div>
                          <span className="text-slate-400">75% of consumers judge a business's credibility based on its website design</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="min-w-4 h-4 rounded-full bg-[#8B5CF6] mt-0.5"></div>
                          <span className="text-slate-400">Companies with consistent branding see an average revenue increase of 23%</span>
                        </li>
                      </ul>
                    </div>
                    
                    <p className="text-base leading-relaxed text-slate-400">
                      Our AI-powered brand audit identifies crucial gaps in your digital presence and provides actionable, data-driven recommendations that drive measurable results.
                    </p>
                    
                    <div className="mt-8">
                      <h4 className="text-lg font-medium text-white mb-3">Ready to try it?</h4>
                      <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white border-0 shadow-lg shadow-indigo-500/25 flex items-center gap-2">
                        Start Free Analysis <ArrowRight size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-3">
              <Card className="border-0 bg-[#13141F]/80 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-800">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center mr-3">
                      <Mail className="text-[#8B5CF6]" size={20} />
                    </div>
                    Contact Us
                  </h3>
                  
                  <form 
                    action="https://formspree.io/f/xqazrvlz" 
                    method="POST"
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300">Name</label>
                        <Input 
                          id="name" 
                          name="name" 
                          required 
                          placeholder="Your name" 
                          className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300">Email</label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          placeholder="Your email" 
                          className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-slate-300">Subject</label>
                      <Input 
                        id="subject" 
                        name="subject" 
                        required 
                        placeholder="How can we help you?" 
                        className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="block text-sm font-medium text-slate-300">Message</label>
                      <Textarea 
                        id="message" 
                        name="message" 
                        required 
                        placeholder="Your message" 
                        rows={6}
                        className="bg-[#161A2C] border-slate-700 focus:border-[#8B5CF6] text-white placeholder:text-slate-500"
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white border-0 shadow-lg shadow-indigo-500/25 h-12 flex items-center justify-center gap-2"
                    >
                      <Send size={16} className="mr-2" />
                      Send Message
                    </Button>
                  </form>
                  
                  <div className="mt-8 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="font-medium text-white">Email</div>
                      <a href="mailto:hello@playmaker-ai.com" className="text-sm text-slate-400 hover:text-[#8B5CF6] transition-colors">
                        hello@playmaker-ai.com
                      </a>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-white">Support</div>
                      <a href="mailto:support@playmaker-ai.com" className="text-sm text-slate-400 hover:text-[#8B5CF6] transition-colors">
                        support@playmaker-ai.com
                      </a>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-white">Social</div>
                      <a href="https://twitter.com/playmaker_ai" className="text-sm text-slate-400 hover:text-[#8B5CF6] transition-colors">
                        @playmaker_ai
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
