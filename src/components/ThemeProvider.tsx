
import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "playmaker-ai-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Force dark mode on document
    const root = window.document.documentElement;
    root.classList.remove("light", "system");
    root.classList.add("dark");
    
    // Set CSS variables for the elegant dark theme with purple/indigo accents
    root.style.setProperty('--transition-duration', '0.3s');
    root.style.setProperty('--text-primary', 'rgba(255, 255, 255, 0.95)');
    root.style.setProperty('--text-secondary', 'rgba(255, 255, 255, 0.7)');
    root.style.setProperty('--card-bg', 'rgba(19, 20, 31, 0.95)');
    root.style.setProperty('--accent-glow', 'rgba(147, 51, 234, 0.2)');
    root.style.setProperty('--primary-accent', 'rgb(147, 51, 234)');
    root.style.setProperty('--secondary-accent', 'rgb(99, 102, 241)');
    root.style.setProperty('--border-subtle', 'rgba(75, 85, 99, 0.3)');
  }, []);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      // Still allow theme to be set in state but enforce dark mode in DOM
      setTheme(newTheme);
      console.log(`Theme set to ${newTheme}, but enforcing dark mode for consistency`);
      const root = window.document.documentElement;
      root.classList.remove("light", "system");
      root.classList.add("dark");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
