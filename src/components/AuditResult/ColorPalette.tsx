import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

// Define interfaces for type safety
export interface ColorSwatch {
  color: string;
  name: string;
  hex: string;
}

export interface ColorPaletteProps {
  title: string;
  colors: ColorSwatch[];
}

const ColorPalette: React.FC<ColorPaletteProps> = ({ title, colors }) => {
  // Validate colors prop
  const validColors = Array.isArray(colors) ? colors : [];

  // Calculate luminance for text contrast (unchanged logic, optimized)
  const isLightColor = (hex: string): boolean => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  };

  return (
    <div className="mt-6 animate-fade-in">
      {/* Title with consistent typography */}
      <h3 className="text-xl font-semibold mb-4 font-['Inter'] text-gray-100 tracking-tight">
        {title}
      </h3>
      <Card
        className="border border-gray-800/50 bg-gray-900/95 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(147,51,234,0.2)]"
      >
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {validColors.map((swatch, index) => {
              const textColor = isLightColor(swatch.hex) ? 'text-gray-900' : 'text-gray-100';

              return (
                <div key={index} className="flex flex-col items-center group">
                  <div
                    className="w-full aspect-square rounded-lg mb-2 border border-gray-700/50 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.1)] flex items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: swatch.color }}
                  >
                    {/* Hex overlay on hover */}
                    <span
                      className={`text-xs font-semibold ${textColor} absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-gray-900/20`}
                    >
                      {swatch.hex}
                    </span>
                  </div>
                  {/* Name and hex with refined styling */}
                  <p className="text-sm font-medium font-['Inter'] text-gray-200">{swatch.name}</p>
                  <p className="text-xs font-['Inter'] text-gray-400">{swatch.hex}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorPalette;
