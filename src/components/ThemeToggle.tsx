
import React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { theme } = useTheme();
  
  // We're using a consistent dark theme with purple accents
  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full bg-gray-900/80 border-purple-600/20 transition-colors"
      disabled
    >
      {theme === 'dark' ? (
        <Moon className="h-5 w-5 text-purple-400" />
      ) : (
        <Sun className="h-5 w-5 text-purple-400" />
      )}
      <span className="sr-only">{theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled'}</span>
    </Button>
  );
}
