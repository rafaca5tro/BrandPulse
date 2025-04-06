
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Force light mode - we're now always in light mode
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F]">
      <div className="relative bg-[#13141F] border border-[#8BFE3E]/20 p-8 rounded-xl shadow-2xl backdrop-blur-sm max-w-md w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-[#8BFE3E]/20 to-[#8BFE3E]/10 rounded-xl blur-md -z-10"></div>
        
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#8BFE3E] to-[#8BFE3E]/70 font-playfair">404</h1>
          <p className="text-xl text-slate-300 mb-8 font-light">Oops! The page you're looking for doesn't exist.</p>
          
          <Link to="/">
            <Button className="bg-gradient-to-r from-[#8BFE3E] to-[#8BFE3E]/90 hover:from-[#8BFE3E]/90 hover:to-[#8BFE3E]/80 text-black px-6 py-2 rounded-full shadow-lg shadow-[#8BFE3E]/25 transition-all duration-300 flex items-center gap-2">
              <Home size={18} />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
