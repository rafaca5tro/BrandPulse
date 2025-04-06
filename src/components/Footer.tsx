
import React from 'react';
import { Separator } from "@/components/ui/separator";
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, X, ExternalLink, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0A0A0F] text-slate-300 py-16 border-t border-slate-800/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-12">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl font-bold mb-4 font-heading bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
              Playmaker<span className="text-white">AI</span>
            </h2>
            <p className="text-slate-400 max-w-xs">
              AI-powered brand audits that transform your digital presence in minutes, not months.
            </p>
            <div className="mt-6 flex items-center">
              <div className="flex gap-1.5 mr-3">
                <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
              </div>
              <span className="text-xs font-medium text-indigo-400">GPT-4 Powered</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-8 md:mt-0">
            <div>
              <h3 className="font-bold text-white mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="/#features" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Features <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                <li><a href="/#pricing" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Pricing <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                <li><Link to="/audit" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Try It Now <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="/#contact" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Contact <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></a></li>
                <li><Link to="/auth" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Login <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-white mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="/terms" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Terms <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link to="/privacy" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Privacy <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link to="/cookies" className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 group">Cookies <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-800 my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © 2025 Playmaker AI. All rights reserved.
          </p>
          <div className="flex gap-5">
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              aria-label="X / Twitter"
            >
              <X className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-indigo-400 transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
