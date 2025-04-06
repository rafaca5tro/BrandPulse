import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut, User, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the homepage
    if (location.pathname !== '/') {
      // Navigate to homepage with the anchor
      navigate(`/#${sectionId}`);
      setMobileMenuOpen(false);
      return;
    }
    
    // If we're already on homepage, just scroll to the section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return 'U';
    
    const parts = user.email.split('@')[0].split(/[.-_]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-[#0A0A0F] border-b border-slate-800/50 backdrop-filter backdrop-blur-lg bg-opacity-90 fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-heading tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#6366F1] to-[#8B5CF6]">
              Playmaker<span className="text-white">AI</span>
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link to="/audit" className="text-slate-300 hover:text-white transition-colors">BrandAudit AI</Link>
          {user && (
            <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          )}
          <button onClick={() => scrollToSection('features')} className="text-slate-300 hover:text-white transition-colors">Features</button>
          <button onClick={() => scrollToSection('pricing')} className="text-slate-300 hover:text-white transition-colors">Pricing</button>
          <button onClick={() => scrollToSection('contact')} className="text-slate-300 hover:text-white transition-colors">Contact</button>
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X size={24} className="text-slate-300" />
          ) : (
            <Menu size={24} className="text-slate-300" />
          )}
        </button>
        
        {/* User Actions */}
        <div className="hidden md:block">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-slate-700 text-white bg-[#13141F] hover:bg-slate-800 gap-2">
                  <Avatar className="h-6 w-6 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                    <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
                    <AvatarFallback className="text-xs font-medium bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <span>Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#13141F] border-slate-700 text-slate-300">
                <DropdownMenuLabel className="text-slate-100">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
                      <AvatarFallback className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{user.email}</span>
                      <span className="text-xs text-slate-400">User Account</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem asChild className="text-slate-300 focus:bg-slate-700 focus:text-white">
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex space-x-2">
              <Link to="/auth">
                <Button variant="outline" className="border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white flex items-center gap-2">
                  Register <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A0A0F] border-b border-slate-800 py-4 px-4 z-50">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/audit" 
              className="text-slate-300 hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              BrandAudit AI
            </Link>
            {user && (
              <Link 
                to="/dashboard" 
                className="text-slate-300 hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <button 
              onClick={() => scrollToSection('features')} 
              className="text-slate-300 hover:text-white transition-colors py-2 text-left"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="text-slate-300 hover:text-white transition-colors py-2 text-left"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-slate-300 hover:text-white transition-colors py-2 text-left"
            >
              Contact
            </button>
            
            {user ? (
              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
                      <AvatarFallback className="text-xs font-medium bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-slate-300">{user.email}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-700 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-800 flex flex-col space-y-2">
                <Link 
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800">
                    Sign In
                  </Button>
                </Link>
                <Link 
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5254D0] hover:to-[#7B4CD6] text-white flex items-center justify-center gap-2">
                    Register <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;