
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

export interface FontStyle {
  name: string;
  style: string;
  sample: string;
  usage: string;
}

export interface TypographyDisplayProps {
  fonts: FontStyle[];
}

const TypographyDisplay: React.FC<TypographyDisplayProps> = ({ fonts }) => {
  const validFonts = Array.isArray(fonts) ? fonts : [];

  return (
    <div className="mt-6 animate-fade-in">
      <h3 className="text-xl font-semibold mb-4 font-['Inter'] text-gray-100 tracking-tight">
        Typography Analysis
      </h3>
      <Card className="border border-gray-800/50 bg-gray-900/95 rounded-xl shadow-2xl">
        <CardContent className="pt-6">
          <div className="space-y-6">
            {validFonts.map((font, index) => (
              <div
                key={index}
                className="border-b border-gray-700/50 pb-4 last:border-0 last:pb-0 transition-all duration-200 hover:bg-gray-800/30"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-2 md:mb-0">
                    <p className="text-sm font-medium text-gray-100 font-['Inter']">{font.name}</p>
                    <p className="text-xs text-gray-400 font-['Inter']">{font.style}</p>
                  </div>
                  <div>
                    <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full font-['Inter']">
                      {font.usage}
                    </span>
                  </div>
                </div>
                <div
                  className="mt-3 p-4 bg-gray-800/50 rounded-md shadow-sm"
                  style={{ fontFamily: font.name }}
                >
                  <p className="text-xl text-gray-200 font-['Inter']">{font.sample}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypographyDisplay;
